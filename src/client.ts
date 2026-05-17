import {
  WorkdayConfig,
  CourseSectionCandidate,
  CourseDetail,
  GradingBasisResult,
  FeatureToggleResult,
  SavedSchedulePayload,
  ValidationResult,
  CourseSectionsResult,
  WidgetParseDebug,
  WorkdayError,
  Profile,
  CourseSection,
  Course,
  GradingBasis,
  SavedSchedule,
  FeatureToggle,
  ProtectedCourseSectionsResponse,
  ProtectedCourseSection,
  CourseSectionDetail,
  CourseSectionUIDetail,
  Facet,
} from './types.js';
import { mapHttpError, mapSchemaDriftError, mapLoginHtmlError } from './errors.js';

export class WorkdayClient {
  private config: WorkdayConfig;

  constructor(config: WorkdayConfig) {
    this.config = config;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Cookie': this.config.cookie,
      'session-secure-token': this.config.sessionSecureToken,
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Origin': this.config.baseUrl,
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-workday-client': '2026.20.14',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    };
    if (this.config.referer) {
      headers['Referer'] = this.config.referer;
    }
    return headers;
  }

  private async request<T>(path: string): Promise<T | WorkdayError> {
    try {
      const url = path.startsWith('http') ? path : `${this.config.baseUrl}${path}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
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
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // === Legacy UI endpoint (widget tree parsing) ===
  async getCourseSections(
    query: string,
    options?: { academicPeriod?: string; campus?: string }
  ): Promise<CourseSectionsResult | WorkdayError> {
    const endpoint = this.config.searchEndpoint || '/api/course-sections';
    const params = new URLSearchParams();
    params.append('search', query);
    if (options?.academicPeriod) params.append('academicPeriod', options.academicPeriod);
    if (options?.campus) params.append('campus', options.campus);

    const result = await this.request<Record<string, unknown>>(`${endpoint}?${params.toString()}`);

    if ('code' in result) {
      return result as WorkdayError;
    }

    return this.parseWidgetTree(result);
  }

  // === Protected REST API: Course Sections List/Search ===
  async getCourseSectionsProtected(options?: {
    academicPeriodIds?: string[];
    academicLevelId?: string;
    courseId?: string;
    view?: 'courseSectionSummary' | 'savedCourseSection';
    includeFacets?: boolean;
    facets?: 'course';
    limit?: number;
    deliveryModeId?: string;
    deliveryModeIds?: string[];
    offset?: number;
  }): Promise<ProtectedCourseSectionsResponse | WorkdayError> {
    const params = new URLSearchParams();
    
    if (options?.academicPeriodIds) {
      for (const id of options.academicPeriodIds) {
        params.append('academicPeriod', id);
      }
    }
    if (options?.academicLevelId) {
      params.append('academicLevel', options.academicLevelId);
    }
    if (options?.courseId) {
      params.append('course', options.courseId);
    }
    if (options?.view) {
      params.append('view', options.view);
    }
    if (options?.includeFacets) {
      params.append('facets', 'true');
    }
    if (options?.facets) {
      params.append('facets', options.facets);
    }
    if (options?.limit) {
      params.append('limit', String(options.limit));
    }
    if (options?.offset) {
      params.append('offset', String(options.offset));
    }
    if (options?.deliveryModeId) {
      params.append('deliveryMode', options.deliveryModeId);
    }
    if (options?.deliveryModeIds) {
      for (const id of options.deliveryModeIds) {
        params.append('deliveryMode', id);
      }
    }

    const queryString = params.toString();
    const path = `/wday/sirg/protectedapi/studentCurriculum/v2/ubc/courseSections${queryString ? '?' + queryString : ''}`;
    
    const result = await this.request<ProtectedCourseSectionsResponse>(path);
    
    if ('code' in result) {
      return result as WorkdayError;
    }
    
    return result;
  }

  // === Protected REST API: Course Section Detail ===
  async getCourseSectionDetail(
    sectionWid: string,
    view?: 'savedCourseSection'
  ): Promise<CourseSectionDetail | WorkdayError> {
    const params = new URLSearchParams();
    if (view) {
      params.append('view', view);
    }
    
    const queryString = params.toString();
    const path = `/wday/sirg/protectedapi/studentCurriculum/v2/ubc/courseSections/${encodeURIComponent(sectionWid)}${queryString ? '?' + queryString : ''}`;
    
    const result = await this.request<CourseSectionDetail>(path);
    
    if ('code' in result) {
      return result as WorkdayError;
    }
    
    return result;
  }

  // === UI Detail Parser ===
  async getCourseSectionUIDetail(sectionId: string): Promise<CourseSectionUIDetail | WorkdayError> {
    const endpoint = this.config.searchEndpoint || '/ubc/inst/1$15194/15194$475871.htmld';
    const result = await this.request<Record<string, unknown>>(`${endpoint}?id=${encodeURIComponent(sectionId)}`);

    if ('code' in result) {
      return result as WorkdayError;
    }

    return this.parseUIDetail(result, sectionId);
  }

  async getCourseDetail(sectionId: string): Promise<CourseDetail | WorkdayError> {
    const result = await this.request<Record<string, unknown>>(`/api/course-sections/${encodeURIComponent(sectionId)}`);

    if ('code' in result) {
      return result as WorkdayError;
    }

    return this.extractCourseDetail(result);
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

  // === Private parsers ===
  private parseWidgetTree(data: Record<string, unknown>): CourseSectionsResult {
    const debug: WidgetParseDebug = {
      totalWidgets: 0,
      parsedWidgets: 0,
      skippedWidgets: 0,
      unknownWidgetTypes: [],
    };

    const sections: CourseSectionCandidate[] = [];

    const widgets = this.extractWidgets(data);
    debug.totalWidgets = widgets.length;

    for (const widget of widgets) {
      const widgetType = this.getWidgetType(widget);

      if (widgetType === 'courseSection') {
        const section = this.parseCourseSectionWidget(widget);
        if (section) {
          sections.push(section);
          debug.parsedWidgets++;
        } else {
          debug.skippedWidgets++;
        }
      } else if (widgetType === 'unknown') {
        debug.skippedWidgets++;
        const typeName = this.getUnknownWidgetTypeName(widget);
        if (typeName && !debug.unknownWidgetTypes.includes(typeName)) {
          debug.unknownWidgetTypes.push(typeName);
        }
      }
    }

    return {
      sections,
      debug,
    };
  }

  private parseUIDetail(data: Record<string, unknown>, sectionId: string): CourseSectionUIDetail {
    const descriptor = this.extractDisplayName(data) || 'Unknown';
    
    // Extract public notes from widget tree
    let publicNotes: string | undefined;
    const widgets = this.extractWidgets(data);
    for (const widget of widgets) {
      if (widget.type === 'publicNotes' || widget.widgetType === 'publicNotes') {
        publicNotes = typeof widget.value === 'string' ? widget.value : undefined;
      }
      if (!publicNotes && widget.fields) {
        const fields = widget.fields as Record<string, unknown>;
        if (typeof fields.publicNotes === 'string') {
          publicNotes = fields.publicNotes;
        }
      }
    }

    // Extract meeting patterns
    const meetingPatterns: Array<{ dayOfWeek: string; startTime: string; endTime: string; location?: string }> = [];
    for (const widget of widgets) {
      if (widget.type === 'meetingPattern' || widget.widgetType === 'meetingPattern') {
        const mp = widget as Record<string, unknown>;
        if (mp.dayOfWeek && mp.startTime && mp.endTime) {
          meetingPatterns.push({
            dayOfWeek: String(mp.dayOfWeek),
            startTime: String(mp.startTime),
            endTime: String(mp.endTime),
            location: mp.location ? String(mp.location) : undefined,
          });
        }
      }
    }

    // Extract reserved seats
    const reservedSeats: Array<{ description: string; capacity: number; enrolled: number }> = [];
    for (const widget of widgets) {
      if (widget.type === 'reservedSeat' || widget.widgetType === 'reservedSeat') {
        const rs = widget as Record<string, unknown>;
        if (rs.description && rs.capacity !== undefined) {
          reservedSeats.push({
            description: String(rs.description),
            capacity: Number(rs.capacity) || 0,
            enrolled: Number(rs.enrolled) || 0,
          });
        }
      }
    }

    // Extract deadlines
    let dropDeadline: string | undefined;
    let withdrawalDeadline: string | undefined;
    for (const widget of widgets) {
      if (widget.type === 'deadline' || widget.widgetType === 'deadline') {
        const dl = widget as Record<string, unknown>;
        if (dl.type === 'drop') {
          dropDeadline = String(dl.date);
        } else if (dl.type === 'withdrawal') {
          withdrawalDeadline = String(dl.date);
        }
      }
    }

    // Extract waitlist capacity
    let waitlistCapacity: number | undefined;
    for (const widget of widgets) {
      if (widget.type === 'waitlist' || widget.widgetType === 'waitlist') {
        const wl = widget as Record<string, unknown>;
        if (wl.capacity !== undefined) {
          waitlistCapacity = Number(wl.capacity);
        }
      }
    }

    return {
      id: sectionId,
      descriptor,
      publicNotes,
      meetingPatterns: meetingPatterns.length > 0 ? meetingPatterns : undefined,
      reservedSeats: reservedSeats.length > 0 ? reservedSeats : undefined,
      waitlistCapacity,
      dropDeadline,
      withdrawalDeadline,
      raw: data,
    };
  }

  private extractWidgets(value: unknown, out: Record<string, unknown>[] = []): Record<string, unknown>[] {
    if (Array.isArray(value)) {
      for (const item of value) this.extractWidgets(item, out);
      return out;
    }

    if (!this.isRecord(value)) return out;

    if (this.looksLikeWidget(value)) {
      out.push(value);
    }

    const children = value.children;
    if (Array.isArray(children)) this.extractWidgets(children, out);

    const body = value.body;
    if (this.isRecord(body) || Array.isArray(body)) this.extractWidgets(body, out);

    for (const [key, child] of Object.entries(value)) {
      if (key === 'children' || key === 'body') continue;
      if (Array.isArray(child) || this.isRecord(child)) this.extractWidgets(child, out);
    }

    return out;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private looksLikeWidget(value: Record<string, unknown>): boolean {
    return typeof value.id === 'string' || typeof value.displayName === 'string' || typeof value.type === 'string' || typeof value.widgetType === 'string';
  }

  private getWidgetType(widget: Record<string, unknown>): string {
    if (widget.type === 'courseSection' || widget.widgetType === 'courseSection') {
      return 'courseSection';
    }

    if (widget.displayName || widget.title || widget.name) {
      return 'courseSection';
    }

    if (widget.id && (widget.type || widget.widgetType)) {
      return 'unknown';
    }

    return 'unknown';
  }

  private getUnknownWidgetTypeName(widget: Record<string, unknown>): string | undefined {
    if (typeof widget.type === 'string') return widget.type;
    if (typeof widget.widgetType === 'string') return widget.widgetType;
    if (typeof widget.kind === 'string') return widget.kind;
    return undefined;
  }

  private parseCourseSectionWidget(widget: Record<string, unknown>): CourseSectionCandidate | null {
    try {
      const displayName = this.extractDisplayName(widget);
      if (!displayName) return null;

      const id = typeof widget.id === 'string' ? widget.id : 'unknown';
      const moniker = typeof widget.moniker === 'string' ? widget.moniker : undefined;
      const path = typeof widget.path === 'string' ? widget.path : undefined;

      return {
        id,
        displayName,
        moniker,
        path,
        raw: widget,
      };
    } catch {
      return null;
    }
  }

  private extractDisplayName(widget: Record<string, unknown>): string | undefined {
    if (typeof widget.displayName === 'string') return widget.displayName;
    if (typeof widget.title === 'string') return widget.title;
    if (typeof widget.name === 'string') return widget.name;
    if (typeof widget.label === 'string') return widget.label;
    if (typeof widget.caption === 'string') return widget.caption;

    if (widget.fields && typeof widget.fields === 'object') {
      const fields = widget.fields as Record<string, unknown>;
      if (typeof fields.displayName === 'string') return fields.displayName;
      if (typeof fields.title === 'string') return fields.title;
      if (typeof fields.name === 'string') return fields.name;
    }

    return undefined;
  }

  private extractCourseDetail(data: Record<string, unknown>): CourseDetail {
    const displayName = this.extractDisplayName(data) || 'Unknown Course';
    const id = typeof data.id === 'string' ? data.id : 'unknown';

    return {
      id,
      displayName,
      raw: data,
    };
  }
}
