import { mkdir, readFile, rename, rm, writeFile, } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, isAbsolute, relative, resolve, } from "node:path";
let nextCacheId = 1;
const caches = new Map();
let globalsInstalled = false;
/** Project-local package storage shared with native Wasmer SDKs. */
export class NodePackageCache {
    id = nextCacheId++;
    #root;
    #readOnly;
    constructor(directory, readOnly = false) {
        this.#root = resolve(directory);
        this.#readOnly = readOnly;
        caches.set(this.id, this);
    }
    async get(path) {
        try {
            return await readFile(this.#path(path));
        }
        catch (error) {
            if (isNodeError(error, "ENOENT"))
                return undefined;
            throw error;
        }
    }
    async put(path, bytes) {
        if (this.#readOnly)
            return;
        const destination = this.#path(path);
        const directory = dirname(destination);
        await mkdir(directory, { recursive: true });
        const temporary = resolve(directory, `.${process.pid}.${randomUUID()}.tmp`);
        try {
            await writeFile(temporary, bytes, { mode: 0o600 });
            await rename(temporary, destination);
        }
        finally {
            await rm(temporary, { force: true });
        }
    }
    async remove(path) {
        if (this.#readOnly)
            return;
        await rm(this.#path(path), { force: true });
    }
    close() {
        caches.delete(this.id);
    }
    #path(path) {
        const destination = resolve(this.#root, path);
        const child = relative(this.#root, destination);
        if (child === "" || child.startsWith("..") || isAbsolute(child)) {
            throw new Error(`invalid Wasmer cache path: ${path}`);
        }
        return destination;
    }
}
export function installNodeCacheGlobals() {
    if (globalsInstalled)
        return;
    globalsInstalled = true;
    const scope = globalThis;
    scope.__wasmerNodeCacheGet = (cacheId, path) => dispatchNodeCacheCall(nodePackageCache(cacheId), "get", [path]);
    scope.__wasmerNodeCachePut = (cacheId, path, bytes) => dispatchNodeCacheCall(nodePackageCache(cacheId), "put", [
        path,
        bytes.slice(),
    ]);
    scope.__wasmerNodeCacheRemove = (cacheId, path) => dispatchNodeCacheCall(nodePackageCache(cacheId), "remove", [path]);
}
export function nodePackageCache(id) {
    const cache = caches.get(id);
    if (!cache)
        throw new Error(`unknown Wasmer package cache ${id}`);
    return cache;
}
export async function dispatchNodeCacheCall(cache, method, args) {
    switch (method) {
        case "get":
            return cache.get(args[0]);
        case "put":
            return cache.put(args[0], args[1]);
        case "remove":
            return cache.remove(args[0]);
    }
}
function isNodeError(error, code) {
    return (error instanceof Error &&
        "code" in error &&
        error.code === code);
}
//# sourceMappingURL=node-cache.js.map