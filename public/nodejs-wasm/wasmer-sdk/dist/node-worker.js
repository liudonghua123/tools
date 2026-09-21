import { parentPort } from "node:worker_threads";
import { NETWORK_RPC_CONTROL_BYTES, networkResponseBufferBytes, } from "./node-network-rpc.js";
import { installCapiObjectBridge, isCapiDispatchHandled, receiveCapiDispatch, setCapiMessageWorkerId, } from "./capi-worker-bridge.js";
if (!parentPort)
    throw new Error("Wasmer SDK worker has no parent port");
const port = parentPort;
Error.stackTraceLimit = 50;
installNetworkProxy();
installCacheProxy();
installCapiObjectBridge((message, transfer = []) => port.postMessage(message, transfer));
Object.defineProperty(globalThis, "postMessage", {
    configurable: true,
    value: (message) => port.postMessage(message),
});
let worker;
const pendingMessages = [];
let nextCacheRequestId = 1;
const pendingCacheRequests = new Map();
port.on("message", async (data) => {
    try {
        await handleMessage(data);
    }
    catch (error) {
        console.error("Wasmer SDK worker failed:", error);
        throw error;
    }
});
async function handleMessage(data) {
    data = receiveCapiDispatch(data);
    if (isCapiDispatchHandled(data))
        return;
    if (data?.type === "wasmer-cache-rpc-response") {
        const pending = pendingCacheRequests.get(data.requestId);
        if (!pending)
            return;
        pendingCacheRequests.delete(data.requestId);
        if (data.ok)
            pending.resolve(data.value);
        else
            pending.reject(new Error(data.error));
        return;
    }
    if (data?.type === "init") {
        setCapiMessageWorkerId(data.id);
        const sdk = await import(data.sdkUrl);
        await sdk.default({
            module_or_path: data.module,
            memory: data.memory,
        });
        const initializedWorker = new sdk.ThreadPoolWorker(data.id);
        while (pendingMessages.length > 0) {
            await initializedWorker.handle(pendingMessages.shift());
        }
        worker = initializedWorker;
        return;
    }
    if (worker)
        await worker.handle(data);
    else
        pendingMessages.push(data);
}
function installCacheProxy() {
    const scope = globalThis;
    scope.__wasmerNodeCacheGet = (cacheId, path) => callCache(cacheId, "get", [path]);
    scope.__wasmerNodeCachePut = (cacheId, path, bytes) => callCache(cacheId, "put", [path, bytes.slice()]);
    scope.__wasmerNodeCacheRemove = (cacheId, path) => callCache(cacheId, "remove", [path]);
}
function callCache(cacheId, method, args) {
    const requestId = nextCacheRequestId++;
    return new Promise((resolve, reject) => {
        pendingCacheRequests.set(requestId, { resolve, reject });
        port.postMessage({
            type: "wasmer-cache-rpc",
            cacheId,
            requestId,
            method,
            args,
        });
    });
}
function installNetworkProxy() {
    const scope = globalThis;
    scope.__wasmerHostResolveSync = (bridgeId, host) => callNetwork(bridgeId, "resolve", [host]);
    scope.__wasmerHostConnectTcpSync = (bridgeId, local, peer) => callNetwork(bridgeId, "connectTcp", [local, peer]);
    scope.__wasmerHostListenTcp = (bridgeId, address) => callNetwork(bridgeId, "listenTcp", [address]);
    scope.__wasmerHostListenerAccept = (bridgeId, id) => callNetwork(bridgeId, "listenerAccept", [id]);
    scope.__wasmerHostListenerRefresh = (bridgeId, id) => callNetwork(bridgeId, "listenerRefresh", [id]);
    scope.__wasmerHostListenerReadable = (bridgeId, id) => callNetwork(bridgeId, "listenerReadable", [id]);
    scope.__wasmerHostListenerClose = (bridgeId, id) => callNetwork(bridgeId, "listenerClose", [id]);
    scope.__wasmerHostSocketRead = (bridgeId, id, maximum) => callNetwork(bridgeId, "socketRead", [id, maximum]);
    scope.__wasmerHostSocketWrite = (bridgeId, id, bytes) => callNetwork(bridgeId, "socketWrite", [id, bytes]);
    scope.__wasmerHostSocketFlush = (bridgeId, id) => callNetwork(bridgeId, "socketFlush", [id]);
    scope.__wasmerHostSocketClose = (bridgeId, id) => callNetwork(bridgeId, "socketClose", [id]);
    scope.__wasmerHostSocketReadable = (bridgeId, id) => callNetwork(bridgeId, "socketReadable", [id]);
    scope.__wasmerHostSocketWritable = (bridgeId, id) => callNetwork(bridgeId, "socketWritable", [id]);
    scope.__wasmerHostSocketSetNoDelay = (bridgeId, id, enabled) => callNetwork(bridgeId, "socketSetNoDelay", [id, enabled]);
    scope.__wasmerHostSocketSetKeepAlive = (bridgeId, id, enabled) => callNetwork(bridgeId, "socketSetKeepAlive", [id, enabled]);
    scope.__wasmerHostSocketRefresh = (bridgeId, id) => callNetwork(bridgeId, "socketRefresh", [id]);
}
function callNetwork(bridgeId, method, args) {
    const response = new SharedArrayBuffer(networkResponseBufferBytes(method, args));
    const control = new Int32Array(response, 0, 4);
    port.postMessage({
        type: "wasmer-network-rpc",
        bridgeId,
        method,
        args,
        response,
    });
    const status = Atomics.wait(control, 0, 0);
    if (status !== "ok" && status !== "not-equal") {
        throw new Error(`Node network bridge wait failed: ${status}`);
    }
    const kind = control[1];
    const length = control[2];
    const payload = new Uint8Array(response, NETWORK_RPC_CONTROL_BYTES, length);
    switch (kind) {
        case 1:
            return JSON.parse(decodeShared(payload));
        case 2:
            return payload.slice();
        case 3:
            return undefined;
        case 4:
            return null;
        case 5:
            throw new Error(decodeShared(payload));
        default:
            throw new Error(`invalid Node network bridge response kind ${kind}`);
    }
}
function decodeShared(bytes) {
    return new TextDecoder().decode(bytes.slice());
}
//# sourceMappingURL=node-worker.js.map