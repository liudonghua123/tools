export type NodeCacheMethod = "get" | "put" | "remove";
/** Project-local package storage shared with native Wasmer SDKs. */
export declare class NodePackageCache {
    #private;
    readonly id: number;
    constructor(directory: string, readOnly?: boolean);
    get(path: string): Promise<Uint8Array | undefined>;
    put(path: string, bytes: Uint8Array): Promise<void>;
    remove(path: string): Promise<void>;
    close(): void;
}
export declare function installNodeCacheGlobals(): void;
export declare function nodePackageCache(id: number): NodePackageCache;
export declare function dispatchNodeCacheCall(cache: NodePackageCache, method: NodeCacheMethod, args: readonly unknown[]): Promise<unknown>;
//# sourceMappingURL=node-cache.d.ts.map