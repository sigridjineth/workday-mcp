# UBC Workday HAR-only REST/MCP Parity Technical Specification

작성 기준: 업로드된 HAR 5개와 HAR 내부에서 로드된 `registration-calendar.mjs` 번들만 사용했다. 외부 웹/공식 문서/UBC Calendar/Workday 문서는 이 명세의 근거로 사용하지 않는다.

분석 대상 파일:

- `wd10.myworkday.com.har`
- `wd10.myworkday.com2.har`
- `wd10.myworkday.com23.har`
- `wd10.myworkday.com234.har`
- `wd10.myworkday.com2345.har`
- HAR에서 로드된 `registration-calendar.mjs`, observed asset path: `/wday/asset/registration-calendar/2026.15.1/registration-calendar.mjs`

PII 처리 원칙: HAR에는 사용자 이름, 학생번호, academicRecordId, session token 등이 포함된다. 본 명세는 개인 식별값을 `<PLACEHOLDER>`로 치환한다.

---

## 1. 목표와 범위

### 1.1 목표

UBC Workday 수강신청 UI와 1:1 parity에 가까운 RESTful API 또는 MCP 서버를 만든다. “parity”는 다음을 의미한다.

1. HAR에서 관찰된 Workday endpoint와 JS 번들 endpoint definition을 그대로 반영한다.
2. Workday UI에서 확인 가능한 course section, course detail, grading basis, saved schedule validation/create 흐름을 API화한다.
3. HAR에서 관찰되지 않은 데이터는 만들거나 추정하지 않는다.
4. 외부 데이터가 필요한 기능은 “미관찰/외부 조사 필요”로 명시한다.

### 1.2 포함 범위

HAR 기반으로 포함 가능한 기능:

- Feature toggle 조회
- Course section 목록 조회
- Course section facet/filter 조회
- Course section detail 조회
- Course listing/course detail 조회
- Course section UI report row 조회
- Meeting pattern, notes, reserved seats, drop/withdrawal deadline 파싱
- Grading basis 조회
- Saved schedule validate-only
- Saved schedule create/update/get endpoint definition
- Saved schedule item payload builder
- Corequisite 미충족 조회 endpoint definition
- Course scheduling optimization endpoint definition
- Workday UI faceted-search state machine proxy
- Workday flowController 기반 savedScheduleBespoke bootstrap proxy

### 1.3 제외 또는 미관찰 범위

HAR만으로 확정할 수 없는 기능:

- Arts 졸업요건 공식 판정
- UBC Calendar requirement rule set
- Academic Progress Report / degree audit endpoint
- 학생의 완료/이수/transfer credit 전체 목록 endpoint
- “쉬운 과목”의 실제 난이도 데이터
- historical grade distribution
- 실제 registration 실행 endpoint
- successful savedSchedule create response body의 실제 샘플
- REST `courseSections`의 모든 query parameter 목록
- Workday 공식 API 문서 기반 권장 사용법

---

## 2. Endpoint 분류

HAR에서 확인되는 endpoint는 크게 세 계층이다.

### 2.1 Protected REST API 계층

형태:

```http
/wday/sirg/protectedapi/{service}/{version}/ubc/{resource}
```

관찰된 서비스:

```txt
feature/v0
studentCurriculum/v2
studentRegistration/v1
```

이 계층은 REST/MCP parity 서버의 주된 backend가 되어야 한다.

### 2.2 Workday legacy UI JSON 계층

형태:

```http
/ubc/inst/...
/ubc/flowController.htmld
/ubc/prompt/...
/ubc/faceted-search2/...
```

이 계층은 REST API라기보다 Workday UI state machine이다. 하지만 UI와 1:1 parity를 목표로 한다면 다음 정보 때문에 반드시 proxy 또는 parser가 필요하다.

- course report row detail
- public notes
- reserved seat capacity text
- waitlist capacity
- drop/withdrawal deadline
- meeting pattern detail
- savedScheduleBespoke bootstrap fields
- per-student troubleshoot registration view

### 2.3 Frontend JS bundle 계층

관찰 파일:

```http
GET /wday/asset/registration-calendar/2026.15.1/registration-calendar.mjs
```

이 파일 안에서 protected API endpoint definitions, validation code mapping, saved schedule payload builder, calendar optimizer endpoint가 확인된다.

---

## 3. Observed feature toggles

HAR entry: `wd10.myworkday.com2345.har` #82.

Endpoint:

```http
GET /wday/sirg/protectedapi/feature/v0/ubc/toggles?externalClient=1b75a93a6dbd100011b545f4ad9c0000
```

Observed active toggles:

```txt
MAKE_COURSES_AND_COURSE_SECTIONS_ENDPOINT_PUBLIC = true
BESPOKE_SAVED_SCHEDULE_OPT_IN = true
GRADING_BASIS_AND_UNITS_ON_BESPOKE_SAVED_SCHEDULE = true
DATA_VALIDATION_ENHANCEMENTS_FOR_BESPOKE_SAVED_SCHEDULE = true
DESIGN_SAVED_SCHEDULE_FROM_ACADEMIC_PLAN_IN_BESPOKE = true
UI_FOR_A_COURSE_WITH_NO_MEETING_PATTERN = true
CALENDAR_ENTRY_DIALOG = true
ENABLE_PLAN_DATA_IN_SS_FLOWS_BESIDE_CREATE_FROM_PLAN = true
ADDITIONAL_DATA_VALIDATIONS_FOR_BESPOKE_SAVED_SCHEDULE = true
DEPENDENT_REGISTRATIONS_ON_SAVED_SCHEDULES_BESPOKE = true
AUTO_FILTER_BY_AL_ON_BESPOKE_SAVED_SCHEDULE = true
SAVED_SCHEDULE_CALENDAR_BESPOKE = true
```

Observed inactive toggles:

```txt
COURSE_SCHEDULING_OPTIMIZATION = false
SAVED_SCHEDULE_OPTIMIZATION = false
```

설계 반영:

- `studentCurriculum/v2` course/courseSections endpoint는 사용 가능.
- Bespoke saved schedule 기능은 사용 가능.
- Saved schedule validation은 사용 가능.
- Scheduling optimizer는 번들에 endpoint definition이 있지만 toggle이 false이므로 기본 기능으로 노출하지 않는다.

---

## 4. Protected REST API endpoint specification

### 4.1 Feature toggles

#### Workday endpoint

```http
GET /wday/sirg/protectedapi/feature/v0/ubc/toggles
```

#### Observed query parameters

```txt
externalClient=<EXTERNAL_CLIENT_ID>
jiraId=<JIRA_ID>
externalAlias=<FEATURE_ALIAS>
```

#### Observed response shape

```json
{
  "total": 14,
  "data": [
    {
      "id": "<TOGGLE_WID>",
      "externalAlias": "BESPOKE_SAVED_SCHEDULE_OPT_IN",
      "active": true,
      "name": "Bespoke Saved Schedule Opt In",
      "jiras": [
        {
          "id": "<JIRA_WID>",
          "descriptor": "STUREG-11532",
          "jiraId": "STUREG-11532"
        }
      ]
    }
  ]
}
```

#### Parity API wrapper

```http
GET /api/workday/feature-toggles?externalClient=<id>
```

#### MCP tool

```ts
workday_get_feature_toggles({
  externalClient?: string,
  jiraId?: string,
  externalAlias?: string
})
```

---

### 4.2 Course sections list/search

#### Workday endpoint

```http
GET /wday/sirg/protectedapi/studentCurriculum/v2/ubc/courseSections
```

#### Observed query parameters

```txt
academicPeriod=<ACADEMIC_PERIOD_WID>       // repeated in HAR
facets=true
facets=course
view=courseSectionSummary
view=savedCourseSection
limit=1
limit=100
academicLevel=<ACADEMIC_LEVEL_WID>
course=<COURSE_WID>
```

Important: `deliveryMode=<DELIVERY_MODE_WID>` is supported by the facet model and was discussed from observed facets, but a protected REST request with `deliveryMode` in the captured URL was not the primary observed REST example. For strict HAR-only implementation, either confirm in additional HAR capture or filter delivery mode client-side from returned `data[].deliveryMode`.

#### Observed examples

```http
GET /wday/sirg/protectedapi/studentCurriculum/v2/ubc/courseSections
  ?academicPeriod=<TERM_1_WID>
  &academicPeriod=<WINTER_SESSION_WID>
  &facets=true
```

```http
GET /wday/sirg/protectedapi/studentCurriculum/v2/ubc/courseSections
  ?view=courseSectionSummary
  &limit=1
  &academicPeriod=<TERM_1_WID>
  &academicPeriod=<WINTER_SESSION_WID>
  &facets=course
```

```http
GET /wday/sirg/protectedapi/studentCurriculum/v2/ubc/courseSections
  ?view=savedCourseSection
  &academicPeriod=<TERM_1_WID>
  &academicPeriod=<WINTER_SESSION_WID>
  &limit=100
  &academicLevel=<UNDERGRADUATE_LEVEL_WID>
  &course=<COURSE_WID>
```

#### Observed response fields

`view=courseSectionSummary` response includes fields such as:

```json
{
  "total": 7287,
  "data": [
    {
      "id": "<COURSE_SECTION_WID>",
      "descriptor": "ENGL_V 370-A_001 - ...",
      "academicPeriod": {
        "descriptor": "2026-27 Winter Term 1 (UBC-V)",
        "id": "<ACADEMIC_PERIOD_WID>"
      },
      "courseSubject": {
        "descriptor": "English (Vancouver)",
        "id": "<COURSE_SUBJECT_WID>"
      },
      "course": {
        "descriptor": "ENGL_V 370 - ...",
        "id": "<COURSE_WID>"
      },
      "instructionalFormat": {
        "descriptor": "Lecture",
        "id": "<INSTRUCTIONAL_FORMAT_WID>"
      },
      "deliveryMode": {
        "descriptor": "In Person Learning",
        "id": "<DELIVERY_MODE_WID>"
      },
      "academicLevel": {
        "descriptor": "Undergraduate",
        "id": "<ACADEMIC_LEVEL_WID>"
      },
      "status": {
        "descriptor": "Open",
        "id": "<STATUS_WID>"
      },
      "offeringAcademicUnits": [],
      "owningAcademicUnit": {},
      "owningInstitutionalAcademicUnit": {}
    }
  ],
  "facets": []
}
```

#### Parity API wrapper

```http
GET /api/workday/course-sections
```

Query parameters:

```txt
academicPeriodIds[]=<WID>
academicLevelId=<WID>
courseId=<WID>
view=courseSectionSummary|savedCourseSection
includeFacets=true|false
facets=course
limit=100
```

Do not expose unobserved query parameters as first-class API until captured.

#### MCP tool

```ts
workday_get_course_sections({
  academicPeriodIds?: string[],
  academicLevelId?: string,
  courseId?: string,
  view?: "courseSectionSummary" | "savedCourseSection",
  facets?: true | "course",
  limit?: number
})
```

---

### 4.3 Course section detail

#### Workday endpoint

```http
GET /wday/sirg/protectedapi/studentCurriculum/v2/ubc/courseSections/{sectionWid}
```

#### Observed query parameter

```txt
view=savedCourseSection
```

#### Observed response shape

```json
{
  "id": "<COURSE_SECTION_WID>",
  "descriptor": "APSC_V 450-101 - Professional Engineering Practice",
  "capacity": 450,
  "maximumUnits": "2",
  "minimumUnits": "2",
  "academicPeriod": {
    "descriptor": "2026-27 Winter Term 1 (UBC-V)",
    "id": "<TERM_WID>"
  },
  "name": "APSC_V 450-101",
  "unitType": {
    "descriptor": "Credits",
    "id": "<UNIT_TYPE_WID>"
  },
  "status": {
    "descriptor": "Open",
    "id": "<STATUS_WID>"
  },
  "deliveryMode": {
    "descriptor": "Online Learning",
    "id": "<DELIVERY_MODE_WID>"
  },
  "instructionalFormat": {
    "descriptor": "Lecture",
    "id": "<INSTRUCTIONAL_FORMAT_WID>"
  },
  "course": {
    "descriptor": "APSC_V 450 - Professional Engineering Practice",
    "id": "<COURSE_WID>"
  },
  "instructors": [
    {
      "id": "<INSTRUCTOR_WID>",
      "descriptor": "<INSTRUCTOR_NAME>"
    }
  ]
}
```

#### Parity API wrapper

```http
GET /api/workday/course-sections/{sectionWid}?view=savedCourseSection
```

#### MCP tool

```ts
workday_get_course_section({
  sectionWid: string,
  view?: "savedCourseSection"
})
```

---

### 4.4 Course detail

#### Workday endpoint

```http
GET /wday/sirg/protectedapi/studentCurriculum/v2/ubc/courses/{courseWid}
```

#### Observed query parameters

```txt
view=savedCourse
effectiveDate=2026-09-01
```

#### Observed response shape

```json
{
  "id": "<COURSE_WID>",
  "descriptor": "APSC_V 450 - Professional Engineering Practice",
  "effectiveDescriptor": "APSC_V 450 - Professional Engineering Practice",
  "name": "APSC_V 450",
  "components": [
    {
      "controlsGrading": true,
      "required": true,
      "instructionalFormat": {
        "descriptor": "Lecture",
        "id": "<INSTRUCTIONAL_FORMAT_WID>"
      }
    }
  ]
}
```

#### Use in saved schedule parity

This endpoint tells the planner which instructional formats are required. If a course requires both Lecture and Discussion, the saved schedule payload must include all required course sections, or validation may return:

```txt
A2372 Missing Required Instructional Format
A2373 Duplicate Instructional Formats
A2837 Incomplete Course Section Cluster
```

#### Parity API wrapper

```http
GET /api/workday/courses/{courseWid}?view=savedCourse&effectiveDate=YYYY-MM-DD
```

#### MCP tool

```ts
workday_get_course({
  courseWid: string,
  view?: "savedCourse",
  effectiveDate?: string
})
```

---

### 4.5 Grading basis options

#### Workday endpoint

```http
GET /wday/sirg/protectedapi/studentRegistration/v1/ubc/values/savedSchedule/gradingBasis
```

#### Observed query parameters

```txt
academicRecord=<ACADEMIC_RECORD_WID>
courseSection=<COURSE_SECTION_WID>
```

#### Observed response

```json
{
  "total": 1,
  "data": [
    {
      "descriptor": "Graded",
      "id": "<GRADING_BASIS_WID>",
      "default": true
    }
  ]
}
```

#### Parity API wrapper

```http
GET /api/workday/saved-schedule/grading-bases?academicRecordId=<id>&courseSectionId=<id>
```

#### MCP tool

```ts
workday_get_grading_basis_options({
  academicRecordId: string,
  courseSectionId: string
})
```

---

### 4.6 Saved schedule validate-create

#### Workday endpoint

```http
POST /wday/sirg/protectedapi/studentRegistration/v1/ubc/savedSchedules
```

#### Required header for validation

```http
x-validate-only: 1
Content-Type: application/json
```

#### Observed request body

```json
{
  "name": "<SCHEDULE_NAME>",
  "academicPeriod": {
    "id": "<TERM_WID>"
  },
  "academicRecord": {
    "id": "<ACADEMIC_RECORD_WID>"
  },
  "items": [
    {
      "academicPeriod": {
        "id": "<TERM_WID>"
      },
      "units": 2,
      "gradingBasis": {
        "id": "<GRADING_BASIS_WID>"
      },
      "courseListing": {
        "id": "<COURSE_WID>"
      },
      "courseSections": [
        {
          "id": "<COURSE_SECTION_WID>"
        }
      ]
    }
  ]
}
```

#### Observed validation failure response

```json
{
  "error": "invalid request: validation errors",
  "errors": [
    {
      "error": "During course registrations, you won't be able to register for this course section because you don't meet the eligibility requirements for the reserved seats and the unreserved seats are at full capacity. Replace the course section if you can't resolve this issue.",
      "code": "A2839",
      "field": "capacity",
      "path": "items[0].courseSections[0].capacity",
      "severity": "Critical"
    }
  ]
}
```

Note: JS validation map classifies `A2839` title as `No Available Capacity` and UI severity as warning, while the observed backend response contains `severity: Critical`. Parity server should preserve backend severity and also expose UI classification if useful.

#### Parity API wrapper

```http
POST /api/workday/saved-schedules/validate
```

#### MCP tool

```ts
workday_validate_saved_schedule_create({
  payload: SavedSchedulePayload
})
```

---

### 4.7 Saved schedule create

#### Workday endpoint definition from JS bundle

```http
POST /wday/sirg/protectedapi/studentRegistration/v1/ubc/savedSchedules
```

#### Header difference

For actual create, do not send `x-validate-only`.

#### Observation status

- Actual successful create response was not captured in the HAR.
- The endpoint definition is present in `registration-calendar.mjs`:

```txt
createSavedSchedule:
  serviceURI: studentRegistration/v1
  resourcePath: savedSchedules
  method: POST
  body: payload
```

#### Frontend redirect after success

The JS bundle redirects to:

```txt
/{tenant}/d/inst/15$369057/{savedScheduleId}.htmld
```

#### Parity API wrapper

```http
POST /api/workday/saved-schedules
```

#### MCP tool

```ts
workday_create_saved_schedule({
  payload: SavedSchedulePayload,
  confirmationToken: string
})
```

Write-gating requirement:

- Must run validate first.
- Must display exact payload summary to user.
- Must require explicit confirmation.
- Must not use this tool for registration.

---

### 4.8 Saved schedule update and validate-update

#### Workday endpoint definition from JS bundle

```http
PUT /wday/sirg/protectedapi/studentRegistration/v1/ubc/savedSchedules/{scheduleWid}
```

Validate-update header:

```http
x-validate-only: 1
```

JS endpoint definitions:

```txt
updateSavedSchedule:
  PUT savedSchedules/{scheduleWid}

validateSavedScheduleUpdate:
  PUT savedSchedules/{scheduleWid}
  headers: { "x-validate-only": "1" }
```

#### Parity wrappers

```http
PUT /api/workday/saved-schedules/{scheduleWid}/validate
PUT /api/workday/saved-schedules/{scheduleWid}
```

#### MCP tools

```ts
workday_validate_saved_schedule_update({
  scheduleWid: string,
  payload: SavedSchedulePayload
})

workday_update_saved_schedule({
  scheduleWid: string,
  payload: SavedSchedulePayload,
  confirmationToken: string
})
```

---

### 4.9 Saved schedule get

#### Workday endpoint definition from JS bundle

```http
GET /wday/sirg/protectedapi/studentRegistration/v1/ubc/savedSchedules/{scheduleWid}
```

Optional params are passed through the JS query object, but no concrete captured query parameters were observed.

#### Parity wrapper

```http
GET /api/workday/saved-schedules/{scheduleWid}
```

#### MCP tool

```ts
workday_get_saved_schedule({
  scheduleWid: string,
  params?: Record<string, string>
})
```

---

### 4.10 Unmet corequisites

#### Workday endpoint definition from JS bundle

```http
GET /wday/sirg/protectedapi/studentRegistration/v1/ubc/values/savedSchedule/unmetCoreqs
```

#### Inferred params from JS usage

```txt
academicRecord=<ACADEMIC_RECORD_WID>
academicPeriod=<ACADEMIC_PERIOD_WID>
courseListing=<COURSE_WID>
additionalCourseListings=<COURSE_WID>
```

Observation status:

- Endpoint definition exists in JS bundle.
- No actual network request to this endpoint was captured in the HAR.

#### Parity wrapper

```http
GET /api/workday/saved-schedule/unmet-corequisites
```

#### MCP tool

```ts
workday_get_unmet_coreqs({
  academicRecordId: string,
  academicPeriodId: string,
  courseListingId: string,
  additionalCourseListingIds?: string[]
})
```

---

### 4.11 Optimization preferences

#### Workday endpoint definitions from JS bundle

```http
POST /wday/sirg/protectedapi/studentRegistration/v1/ubc/savedSchedules/{scheduleWid}/optimizationPreferences
PUT  /wday/sirg/protectedapi/studentRegistration/v1/ubc/savedSchedules/{scheduleWid}/optimizationPreferences/{optimizationPreferencesWid}
GET  /wday/sirg/protectedapi/studentRegistration/v1/ubc/savedSchedules/{scheduleWid}/optimizationPreferences
```

Payload built by JS from selected preferences:

```json
{
  "courseOptions": [
    {
      "courseListing": {
        "id": "<COURSE_WID>"
      }
    }
  ],
  "deliveryModes": [
    {
      "id": "<DELIVERY_MODE_WID>"
    }
  ]
}
```

Feature toggle caveat:

```txt
SAVED_SCHEDULE_OPTIMIZATION = false
COURSE_SCHEDULING_OPTIMIZATION = false
```

Therefore these should not be enabled as a primary product feature without additional HAR capture showing active use.

---

### 4.12 Schedule generation optimizer

#### JS bundle endpoint definition

The bundle defines a Calypso endpoint:

```http
POST /wday/pt/calypso/stu-cs/stu-cs-calypso-modules/{tenant}/schedule/generate
```

Fallback path:

```http
POST /wday/calypso/stu-cs/stu-cs-calypso-modules/{tenant}/schedule/generate
```

Feature toggle status:

```txt
COURSE_SCHEDULING_OPTIMIZATION = false
SAVED_SCHEDULE_OPTIMIZATION = false
```

Observation status:

- Endpoint definition exists in JS bundle.
- No actual `schedule/generate` request was captured.
- Do not depend on it for v1 parity.

---

## 5. Workday UI / legacy endpoint specification

### 5.1 Academic period prompt flow

Observed in `wd10.myworkday.com2345.har` #508-#513.

Endpoints:

```http
POST /ubc/prompt/c133/152.htmld
POST /ubc/flowController.htmld
```

Observed sequence:

1. Prompt future/current/past period groups.
2. Select `Future Periods`.
3. Prompt academic years.
4. Select `2026-27 UBC-V Academic Year`.
5. Prompt academic periods.
6. Add `2026-27 Winter Term 1 (UBC-V)`.
7. Add `2026-27 Winter Term 2 (UBC-V)`.

Observed UI IIDs:

```txt
Academic Year: 12759$28 = 2026-27 UBC-V Academic Year
Winter Term 1: 6100$215
Winter Term 2: 6100$210
Winter Session: 6100$221
```

Important:

- These are UI instance IDs, not REST WIDs.
- They may be session/report/version-specific.
- Do not hardcode them as permanent IDs.

### 5.2 Academic level prompt flow

Observed endpoint:

```http
POST /ubc/prompt/c133/153.htmld
POST /ubc/flowController.htmld
```

Observed values:

```txt
10803$1  Academic Level Not Applicable
10803$11 Graduate
10803$2  Undergraduate
```

Again, these are UI prompt instance IDs.

### 5.3 Course section report submission

Observed endpoint:

```http
POST /ubc/flowController.htmld
```

Observed output:

```txt
facetSearchResult
paginationCount = 10,301
```

This corresponds to report result after selecting:

```txt
Start Date Within: 2026-27 Winter Term 1, 2026-27 Winter Term 2
Academic Level: Undergraduate
```

### 5.4 Faceted search replace/expand

Observed endpoints:

```http
POST /ubc/faceted-search2/c134/fs0/replace.htmld
POST /ubc/faceted-search2/c134/fs1/configure/expand.htmld
POST /ubc/faceted-search2/c134/fs2/replace.htmld
POST /ubc/faceted-search2/c134/fs3/replace.htmld
POST /ubc/faceted-search2/c134/fs4/configure/expand.htmld
POST /ubc/faceted-search2/c134/fs5/configure/expand.htmld
POST /ubc/faceted-search2/c134/fs6/replace.htmld
GET  /ubc/faceted-search2/c134/fs7/pagination/50.htmld
GET  /ubc/faceted-search2/c134/fs7/pagination/100.htmld
```

Observed facets:

```txt
Course Level/Tags            iid 5326$11108
Course Subject               iid 5326$11112
Credits                      iid 5326$11113
Delivery Mode                iid 5326$11035
Instructional Format         iid 5326$11037
Instructors                  iid 5326$11036
Meeting Days                 iid 5326$11110
Meeting Times                iid 5326$11033
Section Status               iid 5326$11111
Start Date Within            iid 5326$11109
```

Observed selected filters and counts:

```txt
Initial after Term 1 + Term 2 + Undergraduate:
  paginationCount = 10,301

Delivery Mode = Online Learning:
  paginationCount = 534

Online Learning + Term 1:
  paginationCount = 264

Online Learning + Term 2:
  facet count = 270

Online Learning + Term 1 + 3.0 credits:
  3.0 credit facet count = 216

Online Learning + Term 1 + Term 2 + 3.0 credits:
  3.0 credit facet count = 455
```

Observed facet value IIDs from c134:

```txt
Delivery Mode:
  12844$2 = In Person Learning
  12844$3 = Online Learning
  12844$1 = Hybrid Learning
  12844$4 = Multi-access Learning

Credits:
  11533$7 = 3.0

Start Date Within:
  6100$215 = 2026-27 Winter Term 1 (UBC-V)
  6100$210 = 2026-27 Winter Term 2 (UBC-V)
```

### 5.5 Faceted report row fields

Observed `templatedListItem` row fields:

Subtitles:

```txt
Course Section
Instructional Format
Section Status
Delivery Mode
Maximum Credits
Enrolled/Capacity
Includes Reserved Seats
Waitlisted/Waitlist Capacity
```

Detail result fields:

```txt
Section Details
Course Section Definition Public Notes
Building External URL
Reserved Seat Capacity
Drop and Withdrawal Deadlines
Clustered Course Sections
```

These fields are essential for parity because the protected REST `savedCourseSection` view does not expose all of them in observed samples.

### 5.6 Course section UI detail page

Observed endpoint:

```http
GET /ubc/inst/1$15194/{courseSectionUiInstanceId}.htmld
```

Observed fields:

```txt
Course
Description
Academic Period
Instructor Teaching
Start/End Date
Status
Total Section Capacity
Seats Available / Unreserved Seats Available
Reserved Seats Available
Credits
Grading Basis
Eligibility
Instructional Formats
Other Instructional Formats
Delivery Mode
Campus
Meeting Patterns
Course Tags
Notes
Reserved Seats Available by Eligibility
Add to Saved Schedule
Troubleshoot
```

This endpoint is valuable for:

- public notes
- eligibility text
- meeting patterns
- linked instructional formats
- seat reservations
- add-to-saved-schedule bootstrap

### 5.7 Troubleshoot registration related task

Observed endpoints:

```http
GET /ubc/inst/{courseSectionUiInstanceId}/rel-task/2997$16031.htmld
GET /ubc/inst/{academicRecordUiInstanceId}/rel-task/2997$15938.htmld
```

Observed fields:

```txt
Academic Period
Academic Record
Active Record During Academic Period
Course
Course Section
Enrollment Window
Maximum Credits
Enrolled Credits
Additional Credits From This Course Section
Holds
Restriction
Can Register
Details
```

Observed restriction examples:

```txt
Has Published, Visible Sections
No Duplicate Registrations
Can Register for Co-Requisites
Can Repeat
Access to Enrollment
Eligible
Has Capacity
No Time Conflict Exists
```

Use:

- Per-student diagnostic validation.
- Complement to saved schedule validation.

Caveat:

- This is not a clean REST API.
- It is stateful and may include PII.
- For parity server, expose as a diagnostic tool only.

### 5.8 flowController savedScheduleBespoke bootstrap

Observed sequence:

```http
POST /ubc/flowController.htmld
```

Events:

```txt
_eventId_validate = 128/wd:New_Saved_Schedule
_eventId_validate = 128/wd:Student_Schedule_Name
_eventId_submit   = 131
```

Output contains widget:

```txt
savedScheduleBespoke
```

Observed fields:

```txt
savedScheduleId
academicPlansData
courseListingIds
courseSectionIds
taskWid
academicLevelObjects
academicRecordId
savedScheduleName
academicPeriodIds
```

This is one way to bootstrap:

- academicRecordId
- courseListing WID
- courseSection WID
- schedule name
- academic period WIDs
- academic level WIDs

---

## 6. Saved schedule payload model

### 6.1 Payload shape

```ts
interface SavedSchedulePayload {
  name: string;
  academicPeriod: { id: string };
  academicRecord: { id: string };
  items: SavedScheduleItem[];
  unavailableTimes?: UnavailableTime[];
}

interface SavedScheduleItem {
  academicPeriod: { id: string };
  units: number;
  gradingBasis?: { id: string };
  courseListing: { id: string };
  courseSections: Array<{ id: string }>;
}

interface UnavailableTime {
  name: "Unavailable";
  daysOfTheWeek: string[];
  startTime: string;
  endTime: string;
}
```

### 6.2 Payload builder logic from JS bundle

The bundle groups selected sections by course ID:

```txt
selectedSections -> group by section.course.id -> one item per courseListing
```

For each item:

```txt
academicPeriod.id = selected section academicPeriod.id, otherwise WS.academicPeriods[0].id
units = selectedUnits
gradingBasis.id = selectedGradingBasis.id
courseListing.id = course ID
courseSections = selected course section WIDs
```

Top-level payload:

```txt
name = savedScheduleName
academicPeriod.id = WS.academicPeriods[0].id
academicRecord.id = WS.academicRecordId
items = built items
unavailableTimes = valid unavailable time entries
```

### 6.3 Period handling warning

The JS bundle supports validation codes:

```txt
A2423 Different Academic Periods
A2436 Unrelated Academic Periods
```

HAR alone does not prove successful creation of a single saved schedule containing both Term 1 and Term 2 items. For a parity server, implement per-academic-period validation and avoid cross-period create unless validate-only passes.

---

## 7. Validation error mapping

Source: `registration-calendar.mjs` validation map.

| Code | Title | UI severity | Context | Live |
|---|---|---:|---|---:|
| A2838 | Time Conflicts | warning | section | false |
| A3241 | Conflicts with Unavailable Time | warning | section | false |
| PREF1 | Delivery Mode Mismatch | preference | section | false |
| PREF2 | Required Course Section Added | preference | section | false |
| A2842 | Eligibility Not Met | warning | section | true |
| A2843 | Closed Course Section | warning | section | true |
| A2839 | No Available Capacity | warning | section | true |
| A2844 | Waitlist Only | warning | section | true |
| A2845 | No Enrollment Access | warning | section | true |
| A2841 | Repeat Attempt Limit Reached | warning | item | true |
| A2836 | Missing Corequisite Course | warning | item | true |
| A2837 | Incomplete Course Section Cluster | warning | section | false |
| A2840 | Cross-Listed Sections | warning | section | true |
| A2846 | Active Student Holds | warning | schedule | false |
| A2402 | Name Already In Use | critical | schedule | false |
| A2372 | Missing Required Instructional Format | critical | item | false |
| A2373 | Duplicate Instructional Formats | critical | item | false |
| A2423 | Different Academic Periods | critical | item | true |
| A2430 | Invalid Course Section | critical | section | false |
| A2431 | Invalid Course Section | critical | section | false |
| A2436 | Unrelated Academic Periods | critical | schedule | false |
| A2847 | Invalid Grading Basis | critical | item | false |
| A2598 | Invalid Number of Units | critical | item | false |
| A2597 | Invalid Number of Units | critical | item | false |
| A2419 | unnamed in bundle | critical | schedule | false |
| A2418 | unnamed in bundle | critical | item | false |
| A2411 | unnamed in bundle | critical | schedule | false |
| A3124 | unnamed in bundle | critical | schedule | false |

Validation parser rules from JS bundle:

```txt
If path matches items[i], attach courseWid = items[i].courseListing.id
If path matches items[i].courseSections[j], attach sectionWid = items[i].courseSections[j].id
```

---

## 8. RESTful parity server design

### 8.1 Proposed external API base

```http
/api/workday
```

### 8.2 Endpoint map

| Parity API | Workday backend | Status |
|---|---|---|
| `GET /feature-toggles` | `GET /wday/sirg/protectedapi/feature/v0/ubc/toggles` | observed |
| `GET /course-sections` | `GET /wday/sirg/protectedapi/studentCurriculum/v2/ubc/courseSections` | observed |
| `GET /course-sections/{id}` | `GET /wday/sirg/protectedapi/studentCurriculum/v2/ubc/courseSections/{id}` | observed |
| `GET /courses/{id}` | `GET /wday/sirg/protectedapi/studentCurriculum/v2/ubc/courses/{id}` | observed |
| `GET /saved-schedule/grading-bases` | `GET /studentRegistration/v1/ubc/values/savedSchedule/gradingBasis` | observed |
| `POST /saved-schedules/validate` | `POST /studentRegistration/v1/ubc/savedSchedules` + `x-validate-only` | observed |
| `POST /saved-schedules` | `POST /studentRegistration/v1/ubc/savedSchedules` | JS-defined |
| `GET /saved-schedules/{id}` | `GET /studentRegistration/v1/ubc/savedSchedules/{id}` | JS-defined |
| `PUT /saved-schedules/{id}/validate` | `PUT /studentRegistration/v1/ubc/savedSchedules/{id}` + `x-validate-only` | JS-defined |
| `PUT /saved-schedules/{id}` | `PUT /studentRegistration/v1/ubc/savedSchedules/{id}` | JS-defined |
| `GET /saved-schedule/unmet-corequisites` | `GET /studentRegistration/v1/ubc/values/savedSchedule/unmetCoreqs` | JS-defined |
| `GET /ui/course-sections/{uiId}` | `GET /ubc/inst/1$15194/{uiId}.htmld` | observed |
| `GET /ui/course-sections/{uiId}/troubleshoot` | `/ubc/inst/{uiId}/rel-task/...` | observed |
| `POST /ui/faceted-search/...` | `/ubc/faceted-search2/...` | observed |
| `POST /ui/flow-controller` | `/ubc/flowController.htmld` | observed |

### 8.3 REST wrapper normalization

The parity server should normalize Workday data into stable application objects:

```ts
interface CourseSectionCandidate {
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
```

---

## 9. MCP server design

### 9.1 Read tools

```ts
workday_get_feature_toggles(input)
workday_get_course_sections(input)
workday_get_course_section(input)
workday_get_course(input)
workday_get_grading_basis_options(input)
workday_get_unmet_coreqs(input)
workday_get_course_section_ui_detail(input)
workday_get_registration_troubleshoot(input)
workday_search_course_sections_ui_facets(input)
```

### 9.2 Write-gated tools

```ts
workday_validate_saved_schedule_create(input)
workday_create_saved_schedule(input)
workday_validate_saved_schedule_update(input)
workday_update_saved_schedule(input)
```

`create` and `update` tools must require confirmation. They are not read-only.

### 9.3 Tool annotations

Recommended MCP annotations:

```ts
workday_get_course_sections: {
  readOnlyHint: true,
  destructiveHint: false
}

workday_validate_saved_schedule_create: {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: false
}

workday_create_saved_schedule: {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: false,
  requiresConfirmation: true
}
```

### 9.4 Confirmation contract

Before any `create` or `update`:

```txt
1. Show schedule name.
2. Show academic period.
3. Show academic record descriptor in redacted form.
4. Show every course listing and section.
5. Show units and grading basis.
6. Show validation result.
7. Require explicit user confirmation.
```

---

## 10. Querying UBC Workday course registration tab with parity

### 10.1 Read online course candidates

HAR-based flow:

1. Resolve academic periods through prompt flow or known WID from savedScheduleBespoke.
2. Call `GET /studentCurriculum/v2/ubc/courseSections` with academicPeriod(s), academicLevel, facets.
3. Retrieve sections with `view=courseSectionSummary` or `view=savedCourseSection`.
4. Filter client-side for `deliveryMode.descriptor === "Online Learning"` unless additional HAR confirms REST `deliveryMode` query usage.
5. Use UI faceted report for row-level details such as reserved seats and notes.
6. Use detail page to resolve meeting patterns and required paired instructional formats.

### 10.2 Build saved schedule candidate

For each section:

1. Get course detail with `view=savedCourse` and `effectiveDate`.
2. Ensure required instructional formats are selected.
3. Get grading basis options.
4. Build one item per courseListing.
5. Validate payload.
6. Parse validation response.

### 10.3 9-credit online option generation using HAR-only data

Available HAR-only constraints:

```txt
deliveryMode = Online Learning
units / max credits = 3.0
academic period = Term 1 or Term 2
section status = Open / Waitlist / Closed if available
capacity / enrolled / reserved seats from UI report
meeting pattern from UI detail/report
notes contain asynchronous/synchronous/restriction text
required components from course detail and UI detail
```

Unavailable HAR-only constraints:

```txt
Arts graduation requirement fulfillment
student's completed requirement state
true course difficulty
historical grades
professor workload ratings
```

Therefore, HAR-only planner may produce:

```txt
Option A/B/C: 3 courses x 3 credits based on Workday availability/risk fields
```

But must label:

```txt
Arts requirement claim: not available from HAR
Difficulty claim: proxy only, not official
```

---

## 11. Arts requirement and “easy course” handling

### 11.1 HAR-only conclusion

No endpoint in the uploaded HAR directly provides:

```txt
Arts graduation requirements
BA breadth/writing/language/science/literature rules
Academic Progress Report
Degree audit
Requirement satisfaction state
Historical grades
Workload/difficulty
```

So a 1:1 Workday parity API should not claim to solve these from Workday unless additional HAR captures show such endpoints.

### 11.2 Safe API representation

```ts
interface RequirementClaim {
  source: "not_available_in_har" | "external_required" | "workday_observed";
  requirementType: string;
  status: "unknown" | "needs_external_data" | "confirmed" | "likely";
  evidence: string[];
}
```

For current HAR-only implementation:

```json
{
  "requirementClaims": [
    {
      "source": "not_available_in_har",
      "requirementType": "Arts graduation requirement",
      "status": "needs_external_data",
      "evidence": []
    }
  ]
}
```

### 11.3 Difficulty proxy from HAR-only fields

Allowed proxy signals:

```txt
Course level tag: 100/200-level lower risk than 300/400-level
Online asynchronous notes
No lab/discussion/cluster required
Open section
No reserved seats
Capacity available
No placement/certificate notes
No waitlist-only notes
No synchronous meeting pattern
```

Forbidden claim:

```txt
“This course is easy” as a factual statement
```

Allowed claim:

```txt
“This course has low Workday-observed scheduling/registration complexity according to HAR fields.”
```

---

## 12. External searches or additional captures needed

Do not perform these in HAR-only mode. Document them as future research/capture requirements.

### 12.1 External searches needed for advising layer

```txt
UBC Academic Calendar Arts degree requirements by cohort
UBC Calendar course requirement tags or lists
UBC Workday Academic Progress Report documentation
UBC official saved schedule / registration behavior documentation
```

### 12.2 External data needed for difficulty layer

```txt
Historical grade distribution source
Instructor/course workload data
Student review data, if legally/ethically usable
```

### 12.3 Additional HAR captures needed

```txt
Successful saved schedule create response
Saved schedule get response
Saved schedule update response
unmetCoreqs endpoint actual response
Optimization preferences actual response
schedule/generate actual request/response if feature is active
Degree audit / Academic Progress Report page HAR
Transcript/completed courses page HAR
Actual registration action HAR, if registration parity is ever considered
REST courseSections deliveryMode/status/credits query parameter captures
REST pagination beyond limit=100, if supported
```

---

## 13. Implementation warnings

1. Do not hardcode UI IIDs such as `6100$215`, `12844$3`, or `11533$7`.
2. Do not log session tokens, `sessionSecureToken`, cookies, student names, or academic record IDs.
3. Do not expose actual Workday WIDs in user-facing LLM responses unless required.
4. Do not treat saved schedule create as registration.
5. Do not assume Term 1 and Term 2 can be written into one saved schedule. Validate first.
6. Do not enable optimizer endpoint while feature toggles are false.
7. Do not claim Arts requirement satisfaction from HAR-only data.
8. Do not claim “easy course” from Workday data; only provide proxy ranking.

---

## 14. Recommended v1/v2/v3 roadmap

### v1: Read-only parity

- Implement protected REST course search.
- Implement course detail and course section detail.
- Implement UI faceted-search parser for notes/capacity/meeting details.
- Implement grading basis lookup.
- No writes.

### v2: Validate-only planning

- Build saved schedule payloads.
- Run validate-only.
- Parse errors using JS validation map.
- Return 3 schedule options with risks.
- Still no saved schedule create.

### v3: Write-gated saved schedule creation

- Require explicit user confirmation.
- Create saved schedule only after validate-only.
- Preserve backend validation errors.
- Never register courses.

### v4: External advising layer

- Add UBC Calendar and/or degree audit only after separate data authorization.
- Keep it separate from Workday parity API.

---

## 15. Minimal end-to-end algorithm for HAR-only planner

```ts
async function planOnlineScheduleHarOnly(input) {
  const toggles = await workday_get_feature_toggles({ externalClient: input.externalClient });
  assert(toggles.MAKE_COURSES_AND_COURSE_SECTIONS_ENDPOINT_PUBLIC === true);

  const sections = await workday_get_course_sections({
    academicPeriodIds: input.academicPeriodIds,
    academicLevelId: input.academicLevelId,
    view: "savedCourseSection",
    limit: 100
  });

  const online3Credit = sections.data
    .filter(s => s.deliveryMode?.descriptor === "Online Learning")
    .filter(s => Number(s.maximumUnits) === 3)
    .filter(s => s.status?.descriptor === "Open");

  const enriched = [];
  for (const section of online3Credit) {
    const course = await workday_get_course({
      courseWid: section.course.id,
      view: "savedCourse",
      effectiveDate: deriveEffectiveDate(section.academicPeriod)
    });

    const grading = await workday_get_grading_basis_options({
      academicRecordId: input.academicRecordId,
      courseSectionId: section.id
    });

    enriched.push({ section, course, gradingBasis: grading.data.find(g => g.default) });
  }

  const ranked = rankByHarOnlySignals(enriched);
  const options = generateCombinations(ranked, { totalCredits: 9, count: 3 });

  for (const option of options) {
    const payloadsByPeriod = buildSavedSchedulePayloadsByAcademicPeriod(option);
    option.validation = [];
    for (const payload of payloadsByPeriod) {
      option.validation.push(await workday_validate_saved_schedule_create({ payload }));
    }
  }

  return options.map(o => ({
    ...o,
    requirementClaims: [{
      source: "not_available_in_har",
      requirementType: "Arts graduation requirement",
      status: "needs_external_data",
      evidence: []
    }],
    difficultyClaim: "HAR-only proxy, not true difficulty"
  }));
}
```

