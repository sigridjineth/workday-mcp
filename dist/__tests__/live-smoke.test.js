import { describe, it, expect } from 'vitest';
import { WorkdayClient } from '../client.js';
const RUN_LIVE = process.env.RUN_LIVE_WORKDAY_SMOKE === '1';
const required = ['WORKDAY_BASE_URL', 'WORKDAY_SEARCH_ENDPOINT', 'WORKDAY_COOKIE', 'WORKDAY_SESSION_SECURE_TOKEN'];
const missing = required.filter((key) => !process.env[key]);
function getClient() {
    if (missing.length) {
        throw new Error(`CONFIG_MISSING: ${missing.join(', ')}`);
    }
    return new WorkdayClient({
        baseUrl: process.env.WORKDAY_BASE_URL,
        tenant: process.env.WORKDAY_TENANT || 'ubc',
        cookie: process.env.WORKDAY_COOKIE,
        sessionSecureToken: process.env.WORKDAY_SESSION_SECURE_TOKEN,
        searchEndpoint: process.env.WORKDAY_SEARCH_ENDPOINT,
    });
}
describe.skipIf(!RUN_LIVE)('Live Workday smoke', () => {
    it('env check', () => {
        if (missing.length) {
            throw new Error(`CONFIG_MISSING: ${missing.join(', ')}`);
        }
        expect(missing.length).toBe(0);
    });
    it('getFeatureToggles returns toggles or ENDPOINT_CHANGED', async () => {
        const client = getClient();
        const result = await client.getFeatureToggles();
        const record = result;
        if ('code' in record) {
            expect(record.code).toBe('ENDPOINT_CHANGED');
        }
        else {
            expect(Array.isArray(result.toggles)).toBe(true);
        }
    });
    it('getCourseSections returns sections or ENDPOINT_CHANGED', async () => {
        const client = getClient();
        const result = await client.getCourseSections('CPSC');
        const record = result;
        if ('code' in record) {
            expect(record.code).toBe('ENDPOINT_CHANGED');
        }
        else {
            expect(Array.isArray(result.data)).toBe(true);
        }
    });
});
//# sourceMappingURL=live-smoke.test.js.map