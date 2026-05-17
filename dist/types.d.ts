export interface WorkdayConfig {
    baseUrl: string;
    tenant: string;
    cookie: string;
    sessionSecureToken: string;
    searchEndpoint?: string;
    startPath?: string;
    referer?: string;
}
export interface WorkdayError {
    code: string;
    message: string;
    status?: number;
    details?: Record<string, unknown>;
}
export interface CourseSectionCandidate {
    id: string;
    displayName: string;
    moniker?: string;
    path?: string;
    raw?: Record<string, unknown>;
}
export interface CourseDetail {
    id: string;
    displayName: string;
    raw?: Record<string, unknown>;
}
export interface CourseSectionsResult {
    sections: CourseSectionCandidate[];
    debug: WidgetParseDebug;
}
export interface WidgetParseDebug {
    totalWidgets: number;
    parsedWidgets: number;
    skippedWidgets: number;
    unknownWidgetTypes: string[];
}
export interface GradingBasisResult {
    courseId: string;
    gradingBasis: string;
}
export interface FeatureToggleResult {
    feature: string;
    enabled: boolean;
}
export interface SavedSchedulePayload {
    scheduleId: string;
    courses: string[];
}
export interface ValidationResult {
    valid: boolean;
    errors?: string[];
}
export interface Profile {
    id: string;
    name: string;
    email: string;
}
export interface CourseSection {
    id: string;
    courseId: string;
    section: string;
    instructor: string;
    schedule: string;
    location: string;
    capacity: number;
    enrolled: number;
}
export interface Course {
    id: string;
    code: string;
    title: string;
    description: string;
    credits: number;
}
export interface GradingBasis {
    courseId: string;
    options: string[];
}
export interface SavedSchedule {
    id: string;
    name: string;
    courses: string[];
}
export interface FeatureToggle {
    feature: string;
    enabled: boolean;
}
//# sourceMappingURL=types.d.ts.map