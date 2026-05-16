import { z } from "zod";
import { workdayFetch } from "../utils/client.js";

export const SavedScheduleItemSchema = z.object({
  academicPeriod: z.object({ id: z.string() }),
  units: z.number(),
  gradingBasis: z.object({ id: z.string() }).optional(),
  courseListing: z.object({ id: z.string() }),
  courseSections: z.array(z.object({ id: z.string() })),
});

export const SavedSchedulePayloadSchema = z.object({
  name: z.string(),
  academicPeriod: z.object({ id: z.string() }),
  academicRecord: z.object({ id: z.string() }),
  items: z.array(SavedScheduleItemSchema),
  unavailableTimes: z
    .array(
      z.object({
        name: z.literal("Unavailable"),
        daysOfTheWeek: z.array(z.string()),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),
});

export const ValidateSavedScheduleCreateInput = z.object({
  payload: SavedSchedulePayloadSchema,
});

export async function validateSavedScheduleCreate(
  input: z.infer<typeof ValidateSavedScheduleCreateInput>
) {
  const response = await workdayFetch(
    "/wday/sirg/protectedapi/studentRegistration/v1/ubc/savedSchedules",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-validate-only": "1",
      },
      body: JSON.stringify(input.payload),
    }
  );
  return response;
}

export const CreateSavedScheduleInput = z.object({
  payload: SavedSchedulePayloadSchema,
  confirmationToken: z.string(),
});

export async function createSavedSchedule(
  input: z.infer<typeof CreateSavedScheduleInput>
) {
  if (input.confirmationToken !== "CONFIRMED") {
    throw new Error("Confirmation required. Set confirmationToken to 'CONFIRMED' after reviewing payload.");
  }
  const response = await workdayFetch(
    "/wday/sirg/protectedapi/studentRegistration/v1/ubc/savedSchedules",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input.payload),
    }
  );
  return response;
}

export const GetSavedScheduleInput = z.object({
  scheduleWid: z.string(),
  params: z.record(z.string()).optional(),
});

export async function getSavedSchedule(
  input: z.infer<typeof GetSavedScheduleInput>
) {
  const params = new URLSearchParams(input.params || {});
  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await workdayFetch(
    `/wday/sirg/protectedapi/studentRegistration/v1/ubc/savedSchedules/${input.scheduleWid}${query}`
  );
  return response;
}

export const ValidateSavedScheduleUpdateInput = z.object({
  scheduleWid: z.string(),
  payload: SavedSchedulePayloadSchema,
});

export async function validateSavedScheduleUpdate(
  input: z.infer<typeof ValidateSavedScheduleUpdateInput>
) {
  const response = await workdayFetch(
    `/wday/sirg/protectedapi/studentRegistration/v1/ubc/savedSchedules/${input.scheduleWid}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-validate-only": "1",
      },
      body: JSON.stringify(input.payload),
    }
  );
  return response;
}

export const UpdateSavedScheduleInput = z.object({
  scheduleWid: z.string(),
  payload: SavedSchedulePayloadSchema,
  confirmationToken: z.string(),
});

export async function updateSavedSchedule(
  input: z.infer<typeof UpdateSavedScheduleInput>
) {
  if (input.confirmationToken !== "CONFIRMED") {
    throw new Error("Confirmation required. Set confirmationToken to 'CONFIRMED' after reviewing payload.");
  }
  const response = await workdayFetch(
    `/wday/sirg/protectedapi/studentRegistration/v1/ubc/savedSchedules/${input.scheduleWid}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input.payload),
    }
  );
  return response;
}
