import { z } from "zod";
import { request, RequestOptions } from "https";
import { getWorkdayConfig } from "../utils/client.js";

export const GetCourseSectionUiDetailInput = z.object({
  uiInstanceId: z.string(),
});

export async function getCourseSectionUiDetail(
  input: z.infer<typeof GetCourseSectionUiDetailInput>
) {
  const cfg = getWorkdayConfig();
  const path = `/ubc/inst/1\$15194/${input.uiInstanceId}.htmld`;
  const url = new URL(path, cfg.baseUrl);

  const cookieParts = [
    `wd-browser-id=${cfg.wdBrowserId}`,
    `JSESSIONID=${cfg.jsessionId}`,
    `UserSignedIn=1`,
  ];
  if (cfg.wdAltSessionId) {
    cookieParts.push(`wd-alt-sessionid=${cfg.wdAltSessionId}`);
  }

  const opts: RequestOptions = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname + url.search,
    method: "GET",
    headers: {
      Accept: "text/html",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: `${cfg.baseUrl}/`,
      Origin: cfg.baseUrl,
      "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36",
      "sec-ch-ua": '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "session-secure-token": cfg.sessionToken,
      Cookie: cookieParts.join("; "),
    },
  };

  return new Promise<string>((resolve, reject) => {
    const req = request(opts, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.end();
  });
}

export const SearchCourseSectionsUiFacetsInput = z.object({
  academicPeriodIds: z.array(z.string()).optional(),
  academicLevelId: z.string().optional(),
  deliveryModeId: z.string().optional(),
  courseSubjectId: z.string().optional(),
  credits: z.string().optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

export async function searchCourseSectionsUiFacets(
  input: z.infer<typeof SearchCourseSectionsUiFacetsInput>
) {
  const cfg = getWorkdayConfig();
  const url = new URL("/ubc/flowController.htmld", cfg.baseUrl);

  const body = new URLSearchParams();
  body.set("_eventId", "validate");
  body.set("facetSearchResult", "");
  if (input.academicPeriodIds) {
    for (const id of input.academicPeriodIds) {
      body.append("academicPeriod", id);
    }
  }
  if (input.academicLevelId) body.set("academicLevel", input.academicLevelId);
  if (input.deliveryModeId) body.set("deliveryMode", input.deliveryModeId);
  if (input.courseSubjectId) body.set("courseSubject", input.courseSubjectId);
  if (input.credits) body.set("credits", input.credits);
  if (input.pageSize) body.set("pageSize", String(input.pageSize));

  const cookieParts = [
    `wd-browser-id=${cfg.wdBrowserId}`,
    `JSESSIONID=${cfg.jsessionId}`,
    `UserSignedIn=1`,
  ];
  if (cfg.wdAltSessionId) {
    cookieParts.push(`wd-alt-sessionid=${cfg.wdAltSessionId}`);
  }

  const opts: RequestOptions = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname,
    method: "POST",
    headers: {
      Accept: "text/html",
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: `${cfg.baseUrl}/`,
      Origin: cfg.baseUrl,
      "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36",
      "sec-ch-ua": '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "session-secure-token": cfg.sessionToken,
      Cookie: cookieParts.join("; "),
    },
  };

  return new Promise<string>((resolve, reject) => {
    const req = request(opts, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.write(body.toString());
    req.end();
  });
}

export const GetRegistrationTroubleshootInput = z.object({
  courseSectionUiInstanceId: z.string().optional(),
  academicRecordUiInstanceId: z.string().optional(),
});

export async function getRegistrationTroubleshoot(
  input: z.infer<typeof GetRegistrationTroubleshootInput>
) {
  const cfg = getWorkdayConfig();
  let path: string;
  if (input.courseSectionUiInstanceId) {
    path = `/ubc/inst/${input.courseSectionUiInstanceId}/rel-task/2997\$16031.htmld`;
  } else if (input.academicRecordUiInstanceId) {
    path = `/ubc/inst/${input.academicRecordUiInstanceId}/rel-task/2997\$15938.htmld`;
  } else {
    throw new Error("Either courseSectionUiInstanceId or academicRecordUiInstanceId is required");
  }

  const url = new URL(path, cfg.baseUrl);

  const cookieParts = [
    `wd-browser-id=${cfg.wdBrowserId}`,
    `JSESSIONID=${cfg.jsessionId}`,
    `UserSignedIn=1`,
  ];
  if (cfg.wdAltSessionId) {
    cookieParts.push(`wd-alt-sessionid=${cfg.wdAltSessionId}`);
  }

  const opts: RequestOptions = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname + url.search,
    method: "GET",
    headers: {
      Accept: "text/html",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: `${cfg.baseUrl}/`,
      Origin: cfg.baseUrl,
      "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36",
      "sec-ch-ua": '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "session-secure-token": cfg.sessionToken,
      Cookie: cookieParts.join("; "),
    },
  };

  return new Promise<string>((resolve, reject) => {
    const req = request(opts, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.end();
  });
}
