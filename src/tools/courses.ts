import { z } from "zod";
import { workdayFetch } from "../utils/client.js";

export const GetCourseInput = z.object({
  courseWid: z.string(),
  view: z.enum(["savedCourse"]).optional(),
  effectiveDate: z.string().optional(),
});

export async function getCourse(input: z.infer<typeof GetCourseInput>) {
  const params = new URLSearchParams();
  if (input.view) params.set("view", input.view);
  if (input.effectiveDate) params.set("effectiveDate", input.effectiveDate);

  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await workdayFetch(
    `/wday/sirg/protectedapi/studentCurriculum/v2/ubc/courses/${input.courseWid}${query}`
  );
  return response;
}
