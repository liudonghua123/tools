import * as core from "../pkg/wasmer_sdk_js.js";
import { Wasmer as BrowserWasmer, type WasmerOptions } from "./index.js";
export * from "./index.js";
/**
 * Node entrypoint. WASIX TCP listeners, outbound TCP connections, and DNS are
 * backed directly by `node:net` and `node:dns`; no native addon is involved.
 */
export declare class Wasmer extends BrowserWasmer {
    protected static initializeCore(options: WasmerOptions): Promise<core.WasmerCore>;
    protected closeCore(client: core.WasmerCore): Promise<void>;
}
//# sourceMappingURL=node.d.ts.map