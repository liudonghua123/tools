interface WorkerEvent<T> {
    data: T;
}
export declare function nodeWorkerStats(): {
    workersCreated: number;
    activeWorkers: number;
    workerFailures: number;
};
/**
 * The DOM-shaped surface used by `web_sys::Worker`, backed by
 * `node:worker_threads`.
 */
export declare class NodeWorkerAdapter {
    #private;
    onmessage: ((event: WorkerEvent<unknown>) => void) | null;
    onerror: ((event: {
        message: string;
        filename: string;
        lineno: number;
        colno: number;
    }) => void) | null;
    constructor(url: string, options?: {
        name?: string;
        type?: string;
    });
    postMessage(message: unknown): void;
    terminate(): void;
}
export {};
//# sourceMappingURL=node-worker-adapter.d.ts.map