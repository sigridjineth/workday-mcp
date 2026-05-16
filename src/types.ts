export interface WorkdayConfig {
  baseUrl: string;
  authToken: string;
}

export interface WorkdayError {
  code: 'AUTH_EXPIRED' | 'PERMISSION_DENIED' | 'ENDPOINT_CHANGED' | 'UNKNOWN_ERROR';
  message: string;
  status?: number;
}

export interface Profile {
  studentId: string;
  name: string;
  email: string;
  program: string;
}

export interface CourseSection {
  id: string;
  courseId: string;
  section: string;
  instructor: string;
  schedule: string;
  capacity: number;
  enrolled: number;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  description: string;
}

export interface GradingBasis {
  courseId: string;
  options: string[];
  default: string;
}

export interface SavedSchedule {
  id: string;
  name: string;
  sections: string[];
}

export interface FeatureToggle {
  name: string;
  enabled: boolean;
}

export interface SchedulePayload {
  name: string;
  sections: string[];
  payload: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  conflicts: string[];
  warnings: string[];
}

export interface PlanCandidate {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  recommendedSections: string[];
  reason: string;
}
