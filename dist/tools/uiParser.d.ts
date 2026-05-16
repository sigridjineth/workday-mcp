import { z } from "zod";
export declare const GetCourseSectionUiDetailInput: z.ZodObject<{
    uiInstanceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    uiInstanceId: string;
}, {
    uiInstanceId: string;
}>;
export declare function getCourseSectionUiDetail(input: z.infer<typeof GetCourseSectionUiDetailInput>): Promise<string>;
export declare const SearchCourseSectionsUiFacetsInput: z.ZodObject<{
    academicPeriodIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    academicLevelId: z.ZodOptional<z.ZodString>;
    deliveryModeId: z.ZodOptional<z.ZodString>;
    courseSubjectId: z.ZodOptional<z.ZodString>;
    credits: z.ZodOptional<z.ZodString>;
    pageSize: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    academicPeriodIds?: string[] | undefined;
    academicLevelId?: string | undefined;
    deliveryModeId?: string | undefined;
    courseSubjectId?: string | undefined;
    credits?: string | undefined;
    pageSize?: number | undefined;
}, {
    academicPeriodIds?: string[] | undefined;
    academicLevelId?: string | undefined;
    deliveryModeId?: string | undefined;
    courseSubjectId?: string | undefined;
    credits?: string | undefined;
    pageSize?: number | undefined;
}>;
export declare function searchCourseSectionsUiFacets(input: z.infer<typeof SearchCourseSectionsUiFacetsInput>): Promise<string>;
export declare const GetRegistrationTroubleshootInput: z.ZodObject<{
    courseSectionUiInstanceId: z.ZodOptional<z.ZodString>;
    academicRecordUiInstanceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    courseSectionUiInstanceId?: string | undefined;
    academicRecordUiInstanceId?: string | undefined;
}, {
    courseSectionUiInstanceId?: string | undefined;
    academicRecordUiInstanceId?: string | undefined;
}>;
export declare function getRegistrationTroubleshoot(input: z.infer<typeof GetRegistrationTroubleshootInput>): Promise<string>;
//# sourceMappingURL=uiParser.d.ts.map