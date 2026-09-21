import dns from "node:dns/promises";
import net, {} from "node:net";
const bridges = new Map();
let nextBridgeId = 1;
/** Pause the socket once this much unread data is buffered. */
const RECEIVE_HIGH_WATER_BYTES = 1024 * 1024;
/** Resume the socket once the guest has drained the buffer to this level. */
const RECEIVE_RESUME_BYTES = 256 * 1024;
export class NodeNetworkBridge {
    id;
    #sockets = new Map();
    #listeners = new Map();
    #nextId = 1;
    #wake = () => { };
    constructor() {
        this.id = nextBridgeId++;
        bridges.set(this.id, this);
    }
    setWakeCallback(callback) {
        this.#wake = callback;
    }
    close() {
        for (const listener of this.#listeners.values()) {
            listener.server.close();
        }
        this.#listeners.clear();
        for (const state of this.#sockets.values()) {
            state.socket.destroy();
        }
        this.#sockets.clear();
        this.#wake = () => { };
        bridges.delete(this.id);
    }
    async resolve(host) {
        return (await dns.lookup(host, { all: true })).map(({ address }) => address);
    }
    async connectTcp(localText, peerText) {
        const local = parseAddress(localText);
        const peer = parseAddress(peerText);
        const socket = net.createConnection({
            host: peer.host,
            port: peer.port,
            localAddress: isUnspecified(local.host) ? undefined : local.host,
            localPort: local.port || undefined,
            allowHalfOpen: true,
        });
        const id = this.#registerSocket(socket);
        try {
            await new Promise((resolve, reject) => {
                socket.once("connect", resolve);
                socket.once("error", reject);
            });
        }
        catch (error) {
            // A refused connection (e.g. a readiness probe before the guest
            // listens) must not leave a dead entry in the socket table.
            this.#sockets.delete(id);
            socket.destroy();
            throw error;
        }
        return this.#descriptor(id);
    }
    listenTcp(addressText) {
        const address = parseAddress(addressText);
        const id = this.#nextId++;
        const accepted = [];
        const server = net.createServer({ allowHalfOpen: true }, (socket) => {
            accepted.push(this.#registerSocket(socket));
            this.#wake(id, "connection");
        });
        this.#listeners.set(id, { server, accepted });
        server.once("listening", () => this.#wake(id, "writable"));
        server.once("error", () => this.#wake(id, "error"));
        server.listen({ host: address.host, port: address.port });
        return { id, local: addressText };
    }
    listenerAccept(id) {
        const listener = this.#listeners.get(id);
        const socketId = listener?.accepted.shift();
        return socketId === undefined ? undefined : this.#descriptor(socketId);
    }
    listenerRefresh(id) {
        queueMicrotask(() => {
            if ((this.#listeners.get(id)?.accepted.length ?? 0) > 0) {
                this.#wake(id, "connection");
            }
        });
    }
    listenerReadable(id) {
        return (this.#listeners.get(id)?.accepted.length ?? 0) > 0;
    }
    listenerClose(id) {
        const listener = this.#listeners.get(id);
        listener?.server.close();
        for (const socketId of listener?.accepted ?? []) {
            this.socketClose(socketId);
        }
        this.#listeners.delete(id);
    }
    socketRead(id, maximum) {
        const state = this.#sockets.get(id);
        if (!state)
            return null;
        if (state.buffered === 0)
            return state.ended ? null : undefined;
        const output = new Uint8Array(Math.min(maximum, state.buffered));
        let written = 0;
        while (written < output.length) {
            const chunk = state.chunks[0];
            const count = Math.min(output.length - written, chunk.length - state.offset);
            output.set(chunk.subarray(state.offset, state.offset + count), written);
            written += count;
            state.offset += count;
            state.buffered -= count;
            if (state.offset === chunk.length) {
                state.chunks.shift();
                state.offset = 0;
            }
        }
        if (state.socket.isPaused() && state.buffered <= RECEIVE_RESUME_BYTES) {
            state.socket.resume();
        }
        return output;
    }
    socketWrite(id, bytes) {
        const state = this.#sockets.get(id);
        if (!state || state.socket.destroyed)
            throw new Error("socket is closed");
        state.socket.write(Buffer.from(bytes));
        return bytes.byteLength;
    }
    socketFlush(id) {
        return !(this.#sockets.get(id)?.socket.writableNeedDrain ?? false);
    }
    socketClose(id) {
        this.#sockets.get(id)?.socket.destroy();
        this.#sockets.delete(id);
    }
    socketReadable(id) {
        const state = this.#sockets.get(id);
        if (!state)
            return 0;
        return state.buffered || (state.ended ? 0 : -1);
    }
    socketWritable(id) {
        const socket = this.#sockets.get(id)?.socket;
        if (!socket || socket.destroyed)
            return 0;
        return socket.writableNeedDrain ? -1 : 64 * 1024;
    }
    socketSetNoDelay(id, enabled) {
        this.#sockets.get(id)?.socket.setNoDelay(enabled);
    }
    socketSetKeepAlive(id, enabled) {
        this.#sockets.get(id)?.socket.setKeepAlive(enabled);
    }
    socketRefresh(id) {
        queueMicrotask(() => {
            const state = this.#sockets.get(id);
            if (!state)
                return;
            if (state.buffered > 0)
                this.#wake(id, "readable");
            if (state.ended)
                this.#wake(id, "close");
            if (!state.socket.destroyed && !state.socket.writableNeedDrain) {
                this.#wake(id, "writable");
            }
        });
    }
    #registerSocket(socket) {
        const id = this.#nextId++;
        const state = {
            socket,
            chunks: [],
            offset: 0,
            buffered: 0,
            ended: false,
        };
        this.#sockets.set(id, state);
        socket.on("data", (chunk) => {
            const copy = new Uint8Array(chunk);
            state.chunks.push(copy);
            state.buffered += copy.byteLength;
            // Backpressure: a peer that sends faster than the guest reads must not
            // grow host memory without bound. `socketRead` resumes the socket once
            // the buffer drains.
            if (state.buffered >= RECEIVE_HIGH_WATER_BYTES && !socket.isPaused()) {
                socket.pause();
            }
            this.#wake(id, "readable");
        });
        socket.on("drain", () => this.#wake(id, "writable"));
        socket.on("end", () => {
            state.ended = true;
            this.#wake(id, "close");
        });
        socket.on("close", () => {
            state.ended = true;
            this.#wake(id, "close");
        });
        socket.on("error", () => this.#wake(id, "error"));
        return id;
    }
    #descriptor(id) {
        const socket = this.#sockets.get(id)?.socket;
        if (!socket)
            throw new Error(`unknown socket ${id}`);
        return {
            id,
            local: formatAddress(socket.address()),
            peer: formatAddress({
                address: socket.remoteAddress ?? "0.0.0.0",
                port: socket.remotePort ?? 0,
                family: socket.remoteFamily ?? "IPv4",
            }),
        };
    }
}
export function installNodeNetworkGlobals() {
    const scope = globalThis;
    scope.__wasmerHostResolve = (bridgeId, host) => bridgeFor(bridgeId).resolve(host);
    scope.__wasmerHostConnectTcp = (bridgeId, local, peer) => bridgeFor(bridgeId).connectTcp(local, peer);
    scope.__wasmerHostListenTcp = (bridgeId, address) => bridgeFor(bridgeId).listenTcp(address);
    scope.__wasmerHostListenerAccept = (bridgeId, id) => bridgeFor(bridgeId).listenerAccept(id);
    scope.__wasmerHostListenerRefresh = (bridgeId, id) => bridgeFor(bridgeId).listenerRefresh(id);
    scope.__wasmerHostListenerReadable = (bridgeId, id) => bridgeFor(bridgeId).listenerReadable(id);
    scope.__wasmerHostListenerClose = (bridgeId, id) => bridgeFor(bridgeId).listenerClose(id);
    scope.__wasmerHostSocketRead = (bridgeId, id, maximum) => bridgeFor(bridgeId).socketRead(id, maximum);
    scope.__wasmerHostSocketWrite = (bridgeId, id, bytes) => bridgeFor(bridgeId).socketWrite(id, bytes);
    scope.__wasmerHostSocketFlush = (bridgeId, id) => bridgeFor(bridgeId).socketFlush(id);
    scope.__wasmerHostSocketClose = (bridgeId, id) => bridgeFor(bridgeId).socketClose(id);
    scope.__wasmerHostSocketReadable = (bridgeId, id) => bridgeFor(bridgeId).socketReadable(id);
    scope.__wasmerHostSocketWritable = (bridgeId, id) => bridgeFor(bridgeId).socketWritable(id);
    scope.__wasmerHostSocketSetNoDelay = (bridgeId, id, enabled) => bridgeFor(bridgeId).socketSetNoDelay(id, enabled);
    scope.__wasmerHostSocketSetKeepAlive = (bridgeId, id, enabled) => bridgeFor(bridgeId).socketSetKeepAlive(id, enabled);
    scope.__wasmerHostSocketRefresh = (bridgeId, id) => bridgeFor(bridgeId).socketRefresh(id);
}
export function nodeNetworkBridge(bridgeId) {
    return bridgeFor(bridgeId);
}
export async function dispatchNodeNetworkCall(bridge, method, args) {
    const callable = bridge[method];
    return await callable.apply(bridge, args);
}
function parseAddress(value) {
    const bracketed = /^\[([^\]]+)\]:(\d+)$/.exec(value);
    if (bracketed)
        return { host: bracketed[1], port: Number(bracketed[2]) };
    const separator = value.lastIndexOf(":");
    return {
        host: value.slice(0, separator),
        port: Number(value.slice(separator + 1)),
    };
}
function formatAddress(value) {
    if (!value || typeof value === "string")
        return "0.0.0.0:0";
    return value.address.includes(":")
        ? `[${value.address}]:${value.port}`
        : `${value.address}:${value.port}`;
}
function isUnspecified(host) {
    return host === "0.0.0.0" || host === "::" || host === "[::]";
}
function bridgeFor(id) {
    const bridge = bridges.get(id);
    if (!bridge)
        throw new Error(`unknown or closed Node network bridge ${id}`);
    return bridge;
}
//# sourceMappingURL=node-network.js.map