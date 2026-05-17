import { z } from "zod";
export declare const GetCourseSectionsInput: z.ZodObject<{
    academicPeriodIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    academicLevelId: z.ZodOptional<z.ZodString>;
    courseId: z.ZodOptional<z.ZodString>;
    view: z.ZodOptional<z.ZodEnum<["courseSectionSummary", "savedCourseSection"]>>;
    facets: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodLiteral<"course">]>>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    academicPeriodIds?: string[] | undefined;
    academicLevelId?: string | undefined;
    courseId?: string | undefined;
    view?: "courseSectionSummary" | "savedCourseSection" | undefined;
    facets?: boolean | "course" | undefined;
    limit?: number | undefined;
}, {
    academicPeriodIds?: string[] | undefined;
    academicLevelId?: string | undefined;
    courseId?: string | undefined;
    view?: "courseSectionSummary" | "savedCourseSection" | undefined;
    facets?: boolean | "course" | undefined;
    limit?: number | undefined;
}>;
export declare function getCourseSections(input: z.infer<typeof GetCourseSectionsInput>): Promise<unknown>;
export declare const GetCourseSectionInput: z.ZodObject<{
    sectionWid: z.ZodString;
    view: z.ZodOptional<z.ZodEnum<["savedCourseSection"]>>;
}, "strip", z.ZodTypeAny, {
    sectionWid: string;
    view?: "savedCourseSection" | undefined;
}, {
    sectionWid: string;
    view?: "savedCourseSection" | undefined;
}>;
export declare function getCourseSection(input: z.infer<typeof GetCourseSectionInput>): Promise<unknown>;
//# sourceMappingURL=courseSections.d.ts.map