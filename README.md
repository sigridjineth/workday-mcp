# UBC Workday MCP

Model Context Protocol (MCP) server for UBC Workday integration.

## Security Notice

This server is **read-only by design**. No write, create, or update operations are exposed through MCP tools.

- Raw HAR files, cookies, and tokens must never be saved, logged, or committed.
- Only `.env.example` is provided. Copy to `.env` and fill in your credentials locally.
- Never commit `.env` or any file containing secrets.

## Tools (v1 - Read Only)

- `workday_get_profile` — Get current student profile
- `workday_search_course_sections` — Search course sections
- `workday_get_course_section` — Get a specific course section
- `workday_get_course` — Get course details
- `workday_get_grading_basis` — Get grading basis options
- `workday_get_saved_schedules` — Get saved schedules

## Error Codes

| HTTP Status | Mapped Code        | Meaning                              |
|-------------|--------------------|--------------------------------------|
| 401         | `AUTH_EXPIRED`     | Authentication expired               |
| 403         | `PERMISSION_DENIED`| Access denied                        |
| 404         | `ENDPOINT_CHANGED` | API endpoint/schema may have changed |
| HTML login  | `ENDPOINT_CHANGED` | Received login page instead of JSON  |

## Setup

```bash
npm install
npm run build
```

Copy `.env.example` to `.env` and configure your Workday credentials.

## Running

```bash
npm start
```
