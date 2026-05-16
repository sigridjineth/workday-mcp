import { WorkdayConfig, Profile, CourseSection, Course, GradingBasis, SavedSchedule, FeatureToggle, ValidationResult, WorkdayError } from './types.js';
import { mapHttpError, mapSchemaDriftError, mapLoginHtmlError } from './errors.js';

export class WorkdayClient {
  private config: WorkdayConfig;

  constructor(config: WorkdayConfig) {
    this.config = config;
  }

  private async request<T>(path: string): Promise<T | WorkdayError> {
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
        return JSON.parse(text) as T;
      } catch {
        return mapSchemaDriftError('Response is not valid JSON');
      }
    } catch (error) {
      return {
        code: 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      };
    }
  }

  async getProfile(): Promise<Profile | WorkdayError> {
    return this.request<Profile>('/api/profile');
  }

  async searchCourseSections(query: string): Promise<CourseSection[] | WorkdayError> {
    return this.request<CourseSection[]>(`/api/course-sections?search=${encodeURIComponent(query)}`);
  }

  async getCourseSection(id: string): Promise<CourseSection | WorkdayError> {
    return this.request<CourseSection>(`/api/course-sections/${encodeURIComponent(id)}`);
  }

  async getCourse(id: string): Promise<Course | WorkdayError> {
    return this.request<Course>(`/api/courses/${encodeURIComponent(id)}`);
  }

  async getGradingBasis(courseId: string): Promise<GradingBasis | WorkdayError> {
    return this.request<GradingBasis>(`/api/courses/${encodeURIComponent(courseId)}/grading-basis`);
  }

  async getSavedSchedules(): Promise<SavedSchedule[] | WorkdayError> {
    return this.request<SavedSchedule[]>('/api/schedules');
  }

  async getFeatureToggles(): Promise<FeatureToggle[] | WorkdayError> {
    return this.request<FeatureToggle[]>('/api/feature-toggles');
  }

  async validateSavedSchedule(scheduleId: string): Promise<ValidationResult | WorkdayError> {
    return this.request<ValidationResult>(`/api/schedules/${encodeURIComponent(scheduleId)}/validate`);
  }
}
