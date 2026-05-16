import { z } from "zod";
import { workdayFetch } from "../utils/client.js";
export const GetFeatureTogglesInput = z.object({
    externalClient: z.string().optional(),
    jiraId: z.string().optional(),
    externalAlias: z.string().optional(),
});
export async function getFeatureToggles(input) {
    const params = new URLSearchParams();
    if (input.externalClient)
        params.set("externalClient", input.externalClient);
    if (input.jiraId)
        params.set("jiraId", input.jiraId);
    if (input.externalAlias)
        params.set("externalAlias", input.externalAlias);
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await workdayFetch(`/wday/sirg/protectedapi/feature/v0/ubc/toggles${query}`);
    return response;
}
//# sourceMappingURL=featureToggles.js.map