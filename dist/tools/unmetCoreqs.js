import { z } from "zod";
import { workdayFetch } from "../utils/client.js";
export const GetUnmetCoreqsInput = z.object({
    academicRecordId: z.string(),
    academicPeriodId: z.string(),
    courseListingId: z.string(),
    additionalCourseListingIds: z.array(z.string()).optional(),
});
export async function getUnmetCoreqs(input) {
    const params = new URLSearchParams();
    params.set("academicRecord", input.academicRecordId);
    params.set("academicPeriod", input.academicPeriodId);
    params.set("courseListing", input.courseListingId);
    if (input.additionalCourseListingIds) {
        for (const id of input.additionalCourseListingIds) {
            params.append("additionalCourseListings", id);
        }
    }
    const query = `?${params.toString()}`;
    const response = await workdayFetch(`/wday/sirg/protectedapi/studentRegistration/v1/ubc/values/savedSchedule/unmetCoreqs${query}`);
    return response;
}
//# sourceMappingURL=unmetCoreqs.js.map