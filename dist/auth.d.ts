export interface AuthCredentials {
    cwlUsername: string;
    cwlPassword: string;
}
export interface AuthSession {
    cookie: string;
    sessionSecureToken: string;
    expiresAt: number;
}
export declare class WorkdayAuth {
    private credentials;
    private session;
    constructor(credentials: AuthCredentials);
    login(): Promise<AuthSession>;
    getValidSession(): Promise<AuthSession>;
    clearSession(): void;
}
//# sourceMappingURL=auth.d.ts.map