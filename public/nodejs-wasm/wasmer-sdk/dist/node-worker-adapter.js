import { Worker as NodeWorker, } from "node:worker_threads";
import { dispatchNodeNetworkCall, nodeNetworkBridge, } from "./node-network.js";
import { dispatchNodeCacheCall, nodePackageCache, } from "./node-cache.js";
import { NETWORK_RPC_CONTROL_BYTES } from "./node-network-rpc.js";
let workersCreated = 0;
let activeWorkers = 0;
let workerFailures = 0;
export function nodeWorkerStats() {
    return { workersCreated, activeWorkers, workerFailures };
}
/**
 * The DOM-shaped surface used by `web_sys::Worker`, backed by
 * `node:worker_threads`.
 */
export class NodeWorkerAdapter {
    onmessage = null;
    onerror = null;
    #worker;
    #terminating = false;
    #failed = false;
    constructor(url, options = {}) {
        const workerOptions = {
            name: options.name,
        };
        this.#worker = new NodeWorker(new URL(url), workerOptions);
        workersCreated += 1;
        activeWorkers += 1;
        this.#worker.on("message", (data) => {
            if (isNetworkRequest(data)) {
                void respondToNetworkRequest(data);
            }
            else if (isCacheRequest(data)) {
                void respondToCacheRequest(this.#worker, data);
            }
            else {
                this.onmessage?.({ data });
            }
        });
        this.#worker.on("error", (error) => {
            this.#reportFailure(error);
        });
        this.#worker.on("exit", (code) => {
            activeWorkers -= 1;
            if (!this.#terminating) {
                this.#reportFailure(new Error(`Wasmer SDK worker exited unexpectedly with status ${code}`));
            }
        });
    }
    #reportFailure(error) {
        if (this.#failed)
            return;
        this.#failed = true;
        workerFailures += 1;
        console.error("Wasmer SDK worker error:", error);
        this.onerror?.({
            message: error.message,
            filename: "",
            lineno: 0,
            colno: 0,
        });
    }
    postMessage(message) {
        this.#worker.postMessage(message);
    }
    terminate() {
        this.#terminating = true;
        void this.#worker.terminate();
    }
}
function isCacheRequest(value) {
    return (typeof value === "object" &&
        value !== null &&
        value.type === "wasmer-cache-rpc");
}
async function respondToCacheRequest(worker, request) {
    try {
        const result = await dispatchNodeCacheCall(nodePackageCache(request.cacheId), request.method, request.args);
        if (result instanceof Uint8Array) {
            const bytes = Uint8Array.from(result);
            worker.postMessage({
                type: "wasmer-cache-rpc-response",
                requestId: request.requestId,
                ok: true,
                value: bytes,
            }, [bytes.buffer]);
        }
        else {
            worker.postMessage({
                type: "wasmer-cache-rpc-response",
                requestId: request.requestId,
                ok: true,
                value: result,
            });
        }
    }
    catch (error) {
        worker.postMessage({
            type: "wasmer-cache-rpc-response",
            requestId: request.requestId,
            ok: false,
            error: String(error),
        });
    }
}
function isNetworkRequest(value) {
    return (typeof value === "object" &&
        value !== null &&
        value.type === "wasmer-network-rpc");
}
async function respondToNetworkRequest(request) {
    const control = new Int32Array(request.response, 0, 4);
    const payload = new Uint8Array(request.response, NETWORK_RPC_CONTROL_BYTES);
    try {
        const result = await dispatchNodeNetworkCall(nodeNetworkBridge(request.bridgeId), request.method, request.args);
        encodeResult(control, payload, result);
    }
    catch (error) {
        control[1] = 5;
        // Truncating is acceptable only here: this is a human-readable error
        // message, never data the caller will parse.
        control[2] = writeTruncatedText(payload, String(error));
    }
    Atomics.store(control, 0, 1);
    Atomics.notify(control, 0);
}
function encodeResult(control, payload, result) {
    if (result === undefined) {
        control[1] = 3;
        return;
    }
    if (result === null) {
        control[1] = 4;
        return;
    }
    if (result instanceof Uint8Array) {
        if (result.byteLength > payload.byteLength) {
            throw new Error(`network response is ${result.byteLength} bytes, exceeding ${payload.byteLength}`);
        }
        control[1] = 2;
        control[2] = result.byteLength;
        payload.set(result);
        return;
    }
    control[1] = 1;
    control[2] = writeJson(payload, JSON.stringify(result));
}
/** Write a JSON result; a truncated JSON payload would parse as garbage. */
function writeJson(destination, value) {
    const encoded = new TextEncoder().encode(value);
    if (encoded.byteLength > destination.byteLength) {
        throw new Error(`network response is ${encoded.byteLength} bytes, exceeding ${destination.byteLength}`);
    }
    destination.set(encoded);
    return encoded.byteLength;
}
function writeTruncatedText(destination, value) {
    const encoded = new TextEncoder().encode(value);
    const length = Math.min(encoded.byteLength, destination.byteLength);
    destination.set(encoded.subarray(0, length));
    return length;
}
//# sourceMappingURL=node-worker-adapter.js.map