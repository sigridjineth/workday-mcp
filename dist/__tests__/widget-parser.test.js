import { describe, it, expect } from 'vitest';
import { WorkdayClient } from '../client.js';
// Redacted fixture: mimics Workday htmld widget response structure
// No real WIDs, cookies, tokens, or hostnames.
const REDACTED_WIDGET_RESPONSE = {
    body: {
        children: [
            {
                type: 'courseSection',
                id: 'REDACTED-001',
                displayName: 'ACAM 100 - Introduction to Asian Canadian Studies',
                moniker: 'REDACTED_MONIKER_001',
                path: '/redacted/path/001',
            },
            {
                type: 'courseSection',
                id: 'REDACTED-002',
                displayName: 'LIFE 2212 - Physiological Ecology',
                moniker: 'REDACTED_MONIKER_002',
                path: '/redacted/path/002',
            },
            {
                type: 'unknownWidget',
                id: 'REDACTED-003',
                someField: 'should be skipped',
            },
        ],
    },
};
const REDACTED_MINIMAL_RESPONSE = [
    {
        displayName: 'MATH 101 - Calculus I',
        id: 'REDACTED-004',
    },
];
const REDACTED_EMPTY_RESPONSE = {
    body: {
        children: [],
    },
};
const REDACTED_NESTED_RESPONSE = {
    data: {
        widgets: [
            {
                type: 'courseSection',
                id: 'REDACTED-005',
                displayName: 'PHYS 102 - Physics II',
                moniker: 'REDACTED_MONIKER_005',
            },
        ],
    },
};
const REDACTED_NO_DISPLAY_NAME = {
    body: {
        children: [
            {
                type: 'courseSection',
                id: 'REDACTED-006',
                // no displayName, should be skipped
            },
        ],
    },
};
describe('Widget parser', () => {
    const client = new WorkdayClient({
        baseUrl: 'https://example.com',
        tenant: 'test',
        cookie: 'test',
        sessionSecureToken: 'test',
    });
    it('parses redacted widget tree with multiple sections', () => {
        const result = client.parseWidgetTree(REDACTED_WIDGET_RESPONSE);
        expect(result.sections).toHaveLength(2);
        expect(result.sections[0].displayName).toBe('ACAM 100 - Introduction to Asian Canadian Studies');
        expect(result.sections[1].displayName).toBe('LIFE 2212 - Physiological Ecology');
        expect(result.debug.totalWidgets).toBe(3);
        expect(result.debug.parsedWidgets).toBe(2);
        expect(result.debug.skippedWidgets).toBe(1);
        expect(result.debug.unknownWidgetTypes).toContain('unknownWidget');
    });
    it('parses minimal flat array response', () => {
        const result = client.parseWidgetTree(REDACTED_MINIMAL_RESPONSE);
        expect(result.sections).toHaveLength(1);
        expect(result.sections[0].displayName).toBe('MATH 101 - Calculus I');
        expect(result.debug.totalWidgets).toBe(1);
        expect(result.debug.parsedWidgets).toBe(1);
        expect(result.debug.skippedWidgets).toBe(0);
    });
    it('handles empty response', () => {
        const result = client.parseWidgetTree(REDACTED_EMPTY_RESPONSE);
        expect(result.sections).toHaveLength(0);
        expect(result.debug.totalWidgets).toBe(0);
        expect(result.debug.parsedWidgets).toBe(0);
        expect(result.debug.skippedWidgets).toBe(0);
    });
    it('handles nested data structure', () => {
        const result = client.parseWidgetTree(REDACTED_NESTED_RESPONSE);
        expect(result.sections).toHaveLength(1);
        expect(result.sections[0].displayName).toBe('PHYS 102 - Physics II');
        expect(result.debug.totalWidgets).toBe(1);
        expect(result.debug.parsedWidgets).toBe(1);
    });
    it('skips widgets without displayName', () => {
        const result = client.parseWidgetTree(REDACTED_NO_DISPLAY_NAME);
        expect(result.sections).toHaveLength(0);
        expect(result.debug.totalWidgets).toBe(1);
        expect(result.debug.parsedWidgets).toBe(0);
        expect(result.debug.skippedWidgets).toBe(1);
    });
});
//# sourceMappingURL=widget-parser.test.js.map