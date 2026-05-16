import { z } from "zod";
import { workdayFetch } from "../utils/client.js";
export const GetGradingBasisOptionsInput = z.object({
    academicRecordId: z.string(),
    courseSectionId: z.string(),
});
export async function getGradingBasisOptions(input) {
    const params = new URLSearchParams();
    params.set("academicRecord", input.academicRecordId);
    params.set("courseSection", input.courseSectionId);
    const query = `?${params.toString()}`;
    const response = await workdayFetch(`/wday/sirg/protectedapi/studentRegistration/v1/ubc/values/savedSchedule/gradingBasis${query}`);
    return response;
}
//# sourceMappingURL=gradingBasis.js.map