import { describe, it, expect } from 'vitest';
import { WorkdayWidgetClient } from '../client.js';

const RUN_LIVE = process.env.RUN_LIVE_WORKDAY_SMOKE === '1';

describe.skipIf(!RUN_LIVE)('Live Workday smoke', () => {
  const client = new WorkdayWidgetClient({
    baseUrl: process.env.WORKDAY_BASE_URL!,
    tenant: process.env.WORKDAY_TENANT!,
    cookie: process.env.WORKDAY_COOKIE!,
    sessionSecureToken: process.env.WORKDAY_SESSION_SECURE_TOKEN!,
    searchEndpoint: process.env.WORKDAY_SEARCH_ENDPOINT || undefined,
    startPath: process.env.WORKDAY_START_PATH || undefined,
  });

  it('getFeatureToggles returns toggles or ENDPOINT_CHANGED', async () => {
    const result = await client.getFeatureToggles();
    const record = result as unknown as Record<string, unknown>;
    if ('code' in record) {
      expect(record.code).toBe('ENDPOINT_CHANGED');
    } else {
      expect(Array.isArray((result as unknown as { toggles: unknown[] }).toggles)).toBe(true);
    }
  });

  it('getCourseSections returns sections or ENDPOINT_CHANGED', async () => {
    const result = await client.getCourseSections({ limit: 5 });
    const record = result as unknown as Record<string, unknown>;
    if ('code' in record) {
      expect(record.code).toBe('ENDPOINT_CHANGED');
    } else {
      expect(Array.isArray((result as unknown as { data: unknown[] }).data)).toBe(true);
    }
  });
});
