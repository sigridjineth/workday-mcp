import { z } from "zod";
export declare const GetGradingBasisOptionsInput: z.ZodObject<{
    academicRecordId: z.ZodString;
    courseSectionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    academicRecordId: string;
    courseSectionId: string;
}, {
    academicRecordId: string;
    courseSectionId: string;
}>;
export declare function getGradingBasisOptions(input: z.infer<typeof GetGradingBasisOptionsInput>): Promise<unknown>;
//# sourceMappingURL=gradingBasis.d.ts.map