export interface IdDescriptor {
    id: string;
    descriptor?: string;
}
export interface FeatureToggle {
    id: string;
    externalAlias: string;
    active: boolean;
    name: string;
    jiras?: Array<{
        id: string;
        descriptor: string;
        jiraId: string;
    }>;
}
export interface CourseSection {
    id: string;
    descriptor: string;
    academicPeriod?: IdDescriptor;
    courseSubject?: IdDescriptor;
    course?: IdDescriptor;
    instructionalFormat?: IdDescriptor;
    deliveryMode?: IdDescriptor;
    academicLevel?: IdDescriptor;
    status?: IdDescriptor;
    unitType?: IdDescriptor;
    minimumUnits?: string;
    maximumUnits?: string;
    capacity?: number;
    instructors?: IdDescriptor[];
    offeringAcademicUnits?: unknown[];
    owningAcademicUnit?: unknown;
    owningInstitutionalAcademicUnit?: unknown;
}
export interface CourseSectionDetail extends CourseSection {
    name?: string;
    enrolled?: number;
    waitlisted?: number;
    publicNotes?: string;
    meetingPatterns?: string[];
    dropDeadline?: string;
    withdrawalDeadline?: string;
    clusteredCourseSections?: string[];
    reservedSeatsText?: string;
    seatsAvailableText?: string;
    waitlistText?: string;
}
export interface CourseDetail {
    id: string;
    descriptor: string;
    effectiveDescriptor?: string;
    name: string;
    components?: Array<{
        controlsGrading: boolean;
        required: boolean;
        instructionalFormat: IdDescriptor;
    }>;
}
export interface GradingBasisOption {
    id: string;
    descriptor: string;
    default?: boolean;
}
export interface SavedSchedulePayload {
    name: string;
    academicPeriod: {
        id: string;
    };
    academicRecord: {
        id: string;
    };
    items: SavedScheduleItem[];
    unavailableTimes?: UnavailableTime[];
}
export interface SavedScheduleItem {
    academicPeriod: {
        id: string;
    };
    units: number;
    gradingBasis?: {
        id: string;
    };
    courseListing: {
        id: string;
    };
    courseSections: Array<{
        id: string;
    }>;
}
export interface UnavailableTime {
    name: "Unavailable";
    daysOfTheWeek: string[];
    startTime: string;
    endTime: string;
}
export interface ValidationError {
    error: string;
    code: string;
    field?: string;
    path?: string;
    severity: "Critical" | "Warning";
}
export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}
export interface CourseSectionCandidate {
    source: "studentCurriculum" | "facetedSearch" | "courseSectionDetail";
    sectionWid?: string;
    uiInstanceId?: string;
    descriptor: string;
    courseWid?: string;
    courseDescriptor?: string;
    academicPeriod?: IdDescriptor;
    status?: IdDescriptor;
    deliveryMode?: IdDescriptor;
    instructionalFormat?: IdDescriptor;
    academicLevel?: IdDescriptor;
    unitType?: IdDescriptor;
    minUnits?: number;
    maxUnits?: number;
    capacity?: number;
    enrolled?: number;
    seatsAvailableText?: string;
    reservedSeatsText?: string;
    waitlistText?: string;
    publicNotes?: string;
    meetingPatterns?: string[];
    dropDeadline?: string;
    withdrawalDeadline?: string;
    clusteredCourseSections?: string[];
    raw: unknown;
}
export interface RequirementClaim {
    source: "not_available_in_har" | "external_required" | "workday_observed";
    requirementType: string;
    status: "unknown" | "needs_external_data" | "confirmed" | "likely";
    evidence: string[];
}
//# sourceMappingURL=workday.d.ts.map