import { z } from "zod";
import { workdayFetch } from "../utils/client.js";
export const GetCourseSectionsInput = z.object({
    academicPeriodIds: z.array(z.string()).optional(),
    academicLevelId: z.string().optional(),
    courseId: z.string().optional(),
    view: z.enum(["courseSectionSummary", "savedCourseSection"]).optional(),
    facets: z.union([z.boolean(), z.literal("course")]).optional(),
    limit: z.number().min(1).max(100).optional(),
});
export async function getCourseSections(input) {
    const params = new URLSearchParams();
    if (input.academicPeriodIds) {
        for (const id of input.academicPeriodIds) {
            params.append("academicPeriod", id);
        }
    }
    if (input.academicLevelId)
        params.set("academicLevel", input.academicLevelId);
    if (input.courseId)
        params.set("course", input.courseId);
    if (input.view)
        params.set("view", input.view);
    if (input.facets !== undefined)
        params.set("facets", String(input.facets));
    if (input.limit)
        params.set("limit", String(input.limit));
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await workdayFetch(`/wday/sirg/protectedapi/studentCurriculum/v2/ubc/courseSections${query}`);
    return response;
}
export const GetCourseSectionInput = z.object({
    sectionWid: z.string(),
    view: z.enum(["savedCourseSection"]).optional(),
});
export async function getCourseSection(input) {
    const params = new URLSearchParams();
    if (input.view)
        params.set("view", input.view);
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await workdayFetch(`/wday/sirg/protectedapi/studentCurriculum/v2/ubc/courseSections/${input.sectionWid}${query}`);
    return response;
}
//# sourceMappingURL=courseSections.js.map