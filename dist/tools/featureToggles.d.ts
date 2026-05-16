import { z } from "zod";
export declare const GetFeatureTogglesInput: z.ZodObject<{
    externalClient: z.ZodOptional<z.ZodString>;
    jiraId: z.ZodOptional<z.ZodString>;
    externalAlias: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    externalClient?: string | undefined;
    jiraId?: string | undefined;
    externalAlias?: string | undefined;
}, {
    externalClient?: string | undefined;
    jiraId?: string | undefined;
    externalAlias?: string | undefined;
}>;
export declare function getFeatureToggles(input: z.infer<typeof GetFeatureTogglesInput>): Promise<unknown>;
//# sourceMappingURL=featureToggles.d.ts.map