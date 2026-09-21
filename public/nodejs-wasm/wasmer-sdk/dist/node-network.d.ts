type Wake = (id: number, event: string) => void;
export type NodeNetworkMethod = "resolve" | "connectTcp" | "listenTcp" | "listenerAccept" | "listenerReadable" | "listenerRefresh" | "listenerClose" | "socketRead" | "socketWrite" | "socketFlush" | "socketClose" | "socketReadable" | "socketWritable" | "socketSetNoDelay" | "socketSetKeepAlive" | "socketRefresh";
export declare class NodeNetworkBridge {
    #private;
    readonly id: number;
    constructor();
    setWakeCallback(callback: Wake): void;
    close(): void;
    resolve(host: string): Promise<string[]>;
    connectTcp(localText: string, peerText: string): Promise<object>;
    listenTcp(addressText: string): object;
    listenerAccept(id: number): object | undefined;
    listenerRefresh(id: number): void;
    listenerReadable(id: number): boolean;
    listenerClose(id: number): void;
    socketRead(id: number, maximum: number): Uint8Array | null | undefined;
    socketWrite(id: number, bytes: Uint8Array): number;
    socketFlush(id: number): boolean;
    socketClose(id: number): void;
    socketReadable(id: number): number;
    socketWritable(id: number): number;
    socketSetNoDelay(id: number, enabled: boolean): void;
    socketSetKeepAlive(id: number, enabled: boolean): void;
    socketRefresh(id: number): void;
}
export declare function installNodeNetworkGlobals(): void;
export declare function nodeNetworkBridge(bridgeId: number): NodeNetworkBridge;
export declare function dispatchNodeNetworkCall(bridge: NodeNetworkBridge, method: NodeNetworkMethod, args: unknown[]): Promise<unknown>;
export {};
//# sourceMappingURL=node-network.d.ts.map