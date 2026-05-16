import { request } from "https";
let config = null;
export function setWorkdayConfig(c) {
    config = c;
}
export function getWorkdayConfig() {
    if (!config) {
        throw new Error("Workday config not set");
    }
    return config;
}
export async function workdayFetch(path, options = {}) {
    const cfg = getWorkdayConfig();
    const url = new URL(path, cfg.baseUrl);
    const cookieParts = [
        `wd-browser-id=${cfg.wdBrowserId}`,
        `JSESSIONID=${cfg.jsessionId}`,
        `UserSignedIn=1`,
    ];
    if (cfg.wdAltSessionId) {
        cookieParts.push(`wd-alt-sessionid=${cfg.wdAltSessionId}`);
    }
    const opts = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: options.method || "GET",
        headers: {
            Accept: "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            Referer: `${cfg.baseUrl}/`,
            Origin: cfg.baseUrl,
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36",
            "sec-ch-ua": '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "session-secure-token": cfg.sessionToken,
            Cookie: cookieParts.join("; "),
            ...(options.headers || {}),
        },
    };
    return new Promise((resolve, reject) => {
        const req = request(opts, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                }
                catch {
                    resolve(data);
                }
            });
        });
        req.on("error", reject);
        if (options.body) {
            req.write(options.body);
        }
        req.end();
    });
}
//# sourceMappingURL=client.js.map