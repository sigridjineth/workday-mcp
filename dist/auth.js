import { chromium } from 'playwright';
export class WorkdayAuth {
    credentials;
    session = null;
    constructor(credentials) {
        this.credentials = credentials;
    }
    async login() {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        try {
            // Navigate to Workday login
            await page.goto('https://wd10.myworkday.com/ubc/d/gateway.htmld');
            // Wait for redirect to SAML login
            await page.waitForURL(/login/, { timeout: 10000 });
            // Fill CWL credentials
            await page.fill('input[name="username"]', this.credentials.cwlUsername);
            await page.fill('input[name="password"]', this.credentials.cwlPassword);
            await page.click('button[type="submit"]');
            // Wait for redirect back to Workday
            await page.waitForURL(/wd10\.myworkday\.com/, { timeout: 30000 });
            // Extract cookies
            const cookies = await context.cookies();
            const cookieString = cookies
                .map(c => `${c.name}=${c.value}`)
                .join('; ');
            // Extract session token from localStorage or cookies
            const sessionToken = await page.evaluate(() => {
                return localStorage.getItem('session-secure-token') || '';
            });
            this.session = {
                cookie: cookieString,
                sessionSecureToken: sessionToken,
                expiresAt: Date.now() + 3600000, // 1 hour
            };
            return this.session;
        }
        finally {
            await browser.close();
        }
    }
    async getValidSession() {
        if (this.session && this.session.expiresAt > Date.now()) {
            return this.session;
        }
        return this.login();
    }
    clearSession() {
        this.session = null;
    }
}
//# sourceMappingURL=auth.js.map