type Wake = (id: number, event: string) => boolean;
type WispUrlProvider = (request: {
    url?: string;
    error?: Error;
}) => string | Promise<string>;
/** TCP and DNS egress for a browser WASIX sandbox, multiplexed over WISP. */
export declare class WispNetworkBridge {
    #private;
    readonly id: number;
    constructor(url?: string, dnsUrl?: string, requestUrl?: WispUrlProvider);
    setWakeCallback(callback: Wake): void;
    setUrl(url: string): void;
    resolve(host: string): Promise<string[]>;
    connectTcp(_localText: string, peerText: string): Promise<object>;
    socketRead(id: number, maximum: number): Uint8Array | null | undefined;
    socketWrite(id: number, bytes: Uint8Array): number;
    socketFlush(id: number): boolean;
    socketClose(id: number): void;
    socketReadable(id: number): number;
    socketWritable(id: number): number;
    socketSetNoDelay(id: number, _enabled: boolean): void;
    socketSetKeepAlive(id: number, _enabled: boolean): void;
    socketRefresh(id: number): void;
    close(): void;
}
export declare function installWispNetworkGlobals(): void;
export {};
//# sourceMappingURL=wisp-network.d.ts.map