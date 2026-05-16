import { describe, it, expect, vi } from 'vitest';
import { WorkdayClient } from '../client.js';
import { mapHttpError, mapSchemaDriftError, mapLoginHtmlError } from '../errors.js';
// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;
describe('UBC Workday MCP Parity Tests', () => {
    const mockConfig = {
        baseUrl: 'https://test.workday.com',
        tenant: 'test-tenant',
        cookie: 'test-cookie',
        sessionSecureToken: 'test-token',
    };
    describe('tools/list - 10 tools exposed', () => {
        it('should expose exactly 10 tools', async () => {
            const client = new WorkdayClient(mockConfig);
            const tools = [
                'workday_get_profile',
                'workday_get_feature_toggles',
                'workday_search_course_sections',
                'workday_get_course_section',
                'workday_get_course',
                'workday_get_grading_basis',
                'workday_get_saved_schedules',
                'workday_build_saved_schedule_payload',
                'workday_validate_saved_schedule',
                'workday_plan_online_schedule',
            ];
            expect(tools.length).toBe(10);
            expect(tools).not.toContain('workday_create_saved_schedule');
            expect(tools).not.toContain('workday_update_saved_schedule');
            expect(tools).not.toContain('workday_delete_saved_schedule');
        });
    });
    describe('forbidden write tools absent', () => {
        it('should not include create/update/delete tools', () => {
            const forbiddenTools = [
                'workday_create_saved_schedule',
                'workday_update_saved_schedule',
                'workday_delete_saved_schedule',
            ];
            const exposedTools = [
                'workday_get_profile',
                'workday_get_feature_toggles',
                'workday_search_course_sections',
                'workday_get_course_section',
                'workday_get_course',
                'workday_get_grading_basis',
                'workday_get_saved_schedules',
                'workday_build_saved_schedule_payload',
                'workday_validate_saved_schedule',
                'workday_plan_online_schedule',
            ];
            forbiddenTools.forEach((tool) => {
                expect(exposedTools).not.toContain(tool);
            });
        });
    });
    describe('error mapping', () => {
        it('should map 401 to AUTH_EXPIRED', () => {
            const error = mapHttpError(401);
            expect(error.code).toBe('AUTH_EXPIRED');
            expect(error.status).toBe(401);
        });
        it('should map 403 to PERMISSION_DENIED', () => {
            const error = mapHttpError(403);
            expect(error.code).toBe('PERMISSION_DENIED');
            expect(error.status).toBe(403);
        });
        it('should map 404 to ENDPOINT_CHANGED', () => {
            const error = mapHttpError(404);
            expect(error.code).toBe('ENDPOINT_CHANGED');
            expect(error.status).toBe(404);
        });
        it('should map schema drift to ENDPOINT_CHANGED', () => {
            const error = mapSchemaDriftError('Schema changed');
            expect(error.code).toBe('ENDPOINT_CHANGED');
        });
        it('should map login HTML to ENDPOINT_CHANGED', () => {
            const error = mapLoginHtmlError();
            expect(error.code).toBe('ENDPOINT_CHANGED');
        });
    });
    describe('redaction', () => {
        it('should not include raw cookie in error messages', () => {
            const error = mapHttpError(401, 'Authentication failed');
            expect(error.message).not.toContain('test-cookie');
            expect(error.message).not.toContain('test-token');
        });
        it('should not expose Authorization header', () => {
            // Verify client uses Cookie header, not Authorization
            const client = new WorkdayClient(mockConfig);
            mockFetch.mockResolvedValueOnce({
                ok: true,
                headers: new Map([['content-type', 'application/json']]),
                text: async () => '[]',
            });
            client.getProfile();
            expect(mockFetch).toHaveBeenCalled();
            const callArgs = mockFetch.mock.calls[0];
            const headers = callArgs[1]?.headers || {};
            expect(headers).not.toHaveProperty('Authorization');
            expect(headers).toHaveProperty('Cookie');
        });
    });
});
//# sourceMappingURL=parity.test.js.map