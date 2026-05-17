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

// === HAR Spec v1.1: Protected REST API Types ===

export interface ProtectedCourseSection {
  id: string;
  descriptor: string;
  academicPeriod?: {
    descriptor: string;
    id: string;
  };
  courseSubject?: {
    descriptor: string;
    id: string;
  };
  course?: {
    descriptor: string;
    id: string;
  };
  instructionalFormat?: {
    descriptor: string;
    id: string;
  };
  deliveryMode?: {
    descriptor: string;
    id: string;
  };
  academicLevel?: {
    descriptor: string;
    id: string;
  };
  status?: {
    descriptor: string;
    id: string;
  };
  capacity?: number;
  maximumUnits?: string;
  minimumUnits?: string;
  unitType?: {
    descriptor: string;
    id: string;
  };
  instructors?: Array<{
    id: string;
    descriptor: string;
  }>;
  offeringAcademicUnits?: unknown[];
  owningAcademicUnit?: Record<string, unknown>;
  owningInstitutionalAcademicUnit?: Record<string, unknown>;
}

export interface ProtectedCourseSectionsResponse {
  total: number;
  data: ProtectedCourseSection[];
  facets?: Facet[];
}

export interface Facet {
  descriptor: string;
  facetParameter: string;
  values?: Array<{
    descriptor: string;
    id: string;
    count?: number;
  }>;
}

export interface CourseSectionDetail {
  id: string;
  descriptor: string;
  capacity?: number;
  maximumUnits?: string;
  minimumUnits?: string;
  academicPeriod?: {
    descriptor: string;
    id: string;
  };
  name?: string;
  unitType?: {
    descriptor: string;
    id: string;
  };
  status?: {
    descriptor: string;
    id: string;
  };
  deliveryMode?: {
    descriptor: string;
    id: string;
  };
  instructionalFormat?: {
    descriptor: string;
    id: string;
  };
  course?: {
    descriptor: string;
    id: string;
  };
  instructors?: Array<{
    id: string;
    descriptor: string;
  }>;
}

export interface CourseSectionUIDetail {
  id: string;
  descriptor: string;
  publicNotes?: string;
  meetingPatterns?: MeetingPattern[];
  reservedSeats?: ReservedSeatInfo[];
  waitlistCapacity?: number;
  dropDeadline?: string;
  withdrawalDeadline?: string;
  raw?: Record<string, unknown>;
}

export interface MeetingPattern {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location?: string;
}

export interface ReservedSeatInfo {
  description: string;
  capacity: number;
  enrolled: number;
}
