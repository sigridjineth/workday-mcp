export interface WorkdayConfig {
    baseUrl: string;
    sessionToken: string;
    jsessionId: string;
    wdBrowserId: string;
    wdAltSessionId?: string;
}
export declare function setWorkdayConfig(c: WorkdayConfig): void;
export declare function getWorkdayConfig(): WorkdayConfig;
export declare function workdayFetch(path: string, options?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}): Promise<unknown>;
//# sourceMappingURL=client.d.ts.map