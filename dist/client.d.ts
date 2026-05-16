import { WorkdayConfig, Profile, CourseSection, Course, GradingBasis, SavedSchedule, WorkdayError } from './types.js';
export declare class WorkdayClient {
    private config;
    constructor(config: WorkdayConfig);
    private request;
    getProfile(): Promise<Profile | WorkdayError>;
    searchCourseSections(query: string): Promise<CourseSection[] | WorkdayError>;
    getCourseSection(id: string): Promise<CourseSection | WorkdayError>;
    getCourse(id: string): Promise<Course | WorkdayError>;
    getGradingBasis(courseId: string): Promise<GradingBasis | WorkdayError>;
    getSavedSchedules(): Promise<SavedSchedule[] | WorkdayError>;
}
//# sourceMappingURL=client.d.ts.map