import { z } from "zod";
export declare const GetUnmetCoreqsInput: z.ZodObject<{
    academicRecordId: z.ZodString;
    academicPeriodId: z.ZodString;
    courseListingId: z.ZodString;
    additionalCourseListingIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    academicRecordId: string;
    academicPeriodId: string;
    courseListingId: string;
    additionalCourseListingIds?: string[] | undefined;
}, {
    academicRecordId: string;
    academicPeriodId: string;
    courseListingId: string;
    additionalCourseListingIds?: string[] | undefined;
}>;
export declare function getUnmetCoreqs(input: z.infer<typeof GetUnmetCoreqsInput>): Promise<unknown>;
//# sourceMappingURL=unmetCoreqs.d.ts.map