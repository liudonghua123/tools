import { readFile } from "node:fs/promises";
import init, * as core from "../pkg/wasmer_sdk_js.js";
import { Wasmer as BrowserWasmer, WasmerError, } from "./index.js";
import { installNodeCacheGlobals, NodePackageCache, } from "./node-cache.js";
import { installNodeNetworkGlobals, NodeNetworkBridge, } from "./node-network.js";
import { NodeWorkerAdapter } from "./node-worker-adapter.js";
export * from "./index.js";
let nodeInitialization;
const nodeNetworks = new WeakMap();
const nodeCaches = new WeakMap();
/**
 * Node entrypoint. WASIX TCP listeners, outbound TCP connections, and DNS are
 * backed directly by `node:net` and `node:dns`; no native addon is involved.
 */
export class Wasmer extends BrowserWasmer {
    static async initializeCore(options) {
        nodeInitialization ??= (async () => {
            const wasm = options.wasm ??
                (await readFile(new URL("../pkg/wasmer_sdk_js_bg.wasm", import.meta.url)));
            await init({ module_or_path: wasm });
        })()
            .catch((error) => {
            nodeInitialization = undefined;
            throw error;
        });
        await nodeInitialization;
        installNodeNetworkGlobals();
        installNodeCacheGlobals();
        installNodeWorkers();
        const cache = createNodeCache(options.cache);
        const network = new NodeNetworkBridge();
        try {
            const client = core.WasmerCore.create({
                outputBytes: options.outputBytes,
                parallelism: options.parallelism,
                cache: {
                    mode: options.cache === false
                        ? "disabled"
                        : options.cache === "memory"
                            ? "memory"
                            : "node",
                },
            }, network, cache);
            nodeNetworks.set(client, network);
            if (cache)
                nodeCaches.set(client, cache);
            return client;
        }
        catch (error) {
            network.close();
            cache?.close();
            throw error;
        }
    }
    async closeCore(client) {
        try {
            await super.closeCore(client);
        }
        finally {
            nodeNetworks.get(client)?.close();
            nodeNetworks.delete(client);
            nodeCaches.get(client)?.close();
            nodeCaches.delete(client);
        }
    }
}
function createNodeCache(options) {
    if (options === false || options === "memory")
        return undefined;
    if (options?.namespace !== undefined) {
        throw new WasmerError("`cache.namespace` is only available from the browser entrypoint", "INVALID_ARGUMENT");
    }
    return new NodePackageCache(options?.directory ?? ".wasmer", options?.readOnly ?? false);
}
function installNodeWorkers() {
    if (!("Worker" in globalThis)) {
        Object.defineProperty(globalThis, "Worker", {
            configurable: true,
            value: NodeWorkerAdapter,
        });
    }
    const workerConfig = core;
    workerConfig.setSDKUrl(new URL("../pkg/wasmer_sdk_js.js", import.meta.url).href);
    workerConfig.setWorkerUrl(new URL("./node-worker.js", import.meta.url).href);
}
//# sourceMappingURL=node.js.map