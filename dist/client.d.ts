import { WorkdayConfig, CourseDetail, ValidationResult, CourseSectionsResult, WorkdayError, Profile, CourseSection, Course, GradingBasis, SavedSchedule, FeatureToggle, ProtectedCourseSectionsResponse, CourseSectionDetail, CourseSectionUIDetail } from './types.js';
export declare class WorkdayClient {
    private config;
    constructor(config: WorkdayConfig);
    private getHeaders;
    private request;
    getCourseSections(query: string, options?: {
        academicPeriod?: string;
        campus?: string;
    }): Promise<CourseSectionsResult | WorkdayError>;
    getCourseSectionsProtected(options?: {
        academicPeriodIds?: string[];
        academicLevelId?: string;
        courseId?: string;
        view?: 'courseSectionSummary' | 'savedCourseSection';
        includeFacets?: boolean;
        facets?: 'course';
        limit?: number;
        deliveryModeId?: string;
    }): Promise<ProtectedCourseSectionsResponse | WorkdayError>;
    getCourseSectionDetail(sectionWid: string, view?: 'savedCourseSection'): Promise<CourseSectionDetail | WorkdayError>;
    getCourseSectionUIDetail(sectionId: string): Promise<CourseSectionUIDetail | WorkdayError>;
    getCourseDetail(sectionId: string): Promise<CourseDetail | WorkdayError>;
    getProfile(): Promise<Profile | WorkdayError>;
    searchCourseSections(query: string): Promise<CourseSection[] | WorkdayError>;
    getCourseSection(id: string): Promise<CourseSection | WorkdayError>;
    getCourse(id: string): Promise<Course | WorkdayError>;
    getGradingBasis(courseId: string): Promise<GradingBasis | WorkdayError>;
    getSavedSchedules(): Promise<SavedSchedule[] | WorkdayError>;
    getFeatureToggles(): Promise<FeatureToggle[] | WorkdayError>;
    validateSavedSchedule(scheduleId: string): Promise<ValidationResult | WorkdayError>;
    private parseWidgetTree;
    private parseUIDetail;
    private extractWidgets;
    private isRecord;
    private looksLikeWidget;
    private getWidgetType;
    private getUnknownWidgetTypeName;
    private parseCourseSectionWidget;
    private extractDisplayName;
    private extractCourseDetail;
}
//# sourceMappingURL=client.d.ts.map