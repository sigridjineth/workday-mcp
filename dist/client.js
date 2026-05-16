import { mapHttpError, mapSchemaDriftError, mapLoginHtmlError } from './errors.js';
export class WorkdayClient {
    config;
    constructor(config) {
        this.config = config;
    }
    async request(path) {
        try {
            const response = await fetch(`${this.config.baseUrl}${path}`, {
                headers: {
                    'Cookie': `workday_cookie=${this.config.cookie}; session_secure_token=${this.config.sessionSecureToken}`,
                    'Accept': 'application/json',
                    'X-Workday-Tenant': this.config.tenant,
                },
            });
            if (!response.ok) {
                return mapHttpError(response.status, await response.text().catch(() => undefined));
            }
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('text/html')) {
                return mapLoginHtmlError();
            }
            const text = await response.text();
            if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
                return mapLoginHtmlError();
            }
            try {
                return JSON.parse(text);
            }
            catch {
                return mapSchemaDriftError('Response is not valid JSON');
            }
        }
        catch (error) {
            return {
                code: 'UNKNOWN_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error',
                status: 0,
            };
        }
    }
    async getProfile() {
        return this.request('/api/profile');
    }
    async searchCourseSections(query) {
        return this.request(`/api/course-sections?search=${encodeURIComponent(query)}`);
    }
    async getCourseSection(id) {
        return this.request(`/api/course-sections/${encodeURIComponent(id)}`);
    }
    async getCourse(id) {
        return this.request(`/api/courses/${encodeURIComponent(id)}`);
    }
    async getGradingBasis(courseId) {
        return this.request(`/api/courses/${encodeURIComponent(courseId)}/grading-basis`);
    }
    async getSavedSchedules() {
        return this.request('/api/schedules');
    }
    async getFeatureToggles() {
        return this.request('/api/feature-toggles');
    }
    async validateSavedSchedule(scheduleId) {
        return this.request(`/api/schedules/${encodeURIComponent(scheduleId)}/validate`);
    }
}
//# sourceMappingURL=client.js.map