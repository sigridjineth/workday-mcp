import { z } from "zod";
export declare const GetCourseInput: z.ZodObject<{
    courseWid: z.ZodString;
    view: z.ZodOptional<z.ZodEnum<["savedCourse"]>>;
    effectiveDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    courseWid: string;
    view?: "savedCourse" | undefined;
    effectiveDate?: string | undefined;
}, {
    courseWid: string;
    view?: "savedCourse" | undefined;
    effectiveDate?: string | undefined;
}>;
export declare function getCourse(input: z.infer<typeof GetCourseInput>): Promise<unknown>;
//# sourceMappingURL=courses.d.ts.map