import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { WorkdayClient } from './client.js';
const WORKDAY_BASE_URL = process.env.WORKDAY_BASE_URL || '';
const WORKDAY_TENANT = process.env.WORKDAY_TENANT || '';
const WORKDAY_COOKIE = process.env.WORKDAY_COOKIE || '';
const WORKDAY_SESSION_SECURE_TOKEN = process.env.WORKDAY_SESSION_SECURE_TOKEN || '';
const WORKDAY_SEARCH_ENDPOINT = process.env.WORKDAY_SEARCH_ENDPOINT || '';
const WORKDAY_REFERER = process.env.WORKDAY_REFERER || '';
if (!WORKDAY_BASE_URL || !WORKDAY_TENANT || !WORKDAY_COOKIE || !WORKDAY_SESSION_SECURE_TOKEN) {
    console.error('Missing required environment variables: WORKDAY_BASE_URL, WORKDAY_TENANT, WORKDAY_COOKIE, WORKDAY_SESSION_SECURE_TOKEN');
    process.exit(1);
}
const config = {
    baseUrl: WORKDAY_BASE_URL,
    tenant: WORKDAY_TENANT,
    cookie: WORKDAY_COOKIE,
    sessionSecureToken: WORKDAY_SESSION_SECURE_TOKEN,
};
if (WORKDAY_SEARCH_ENDPOINT) {
    config.searchEndpoint = WORKDAY_SEARCH_ENDPOINT;
}
if (WORKDAY_REFERER) {
    config.referer = WORKDAY_REFERER;
}
const client = new WorkdayClient(config);
const tools = [
    {
        name: 'workday_get_profile',
        description: 'Get the current student profile from Workday',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'workday_search_course_sections',
        description: 'Search for course sections by query string (legacy UI endpoint)',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query for course sections',
                },
            },
            required: ['query'],
        },
    },
    {
        name: 'workday_get_course_sections',
        description: 'Get course sections with filters using Protected REST API (HAR spec v1.1)',
        inputSchema: {
            type: 'object',
            properties: {
                academicPeriodIds: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Academic period WIDs (e.g., ["95ed03ede36c100da0e33ef1bc0a0000"] for 2026-27 Winter Term 2 UBC-V)',
                },
                academicLevelId: {
                    type: 'string',
                    description: 'Academic level WID',
                },
                courseId: {
                    type: 'string',
                    description: 'Course WID',
                },
                view: {
                    type: 'string',
                    enum: ['courseSectionSummary', 'savedCourseSection'],
                    description: 'Response view type',
                },
                includeFacets: {
                    type: 'boolean',
                    description: 'Include facet information',
                },
                facets: {
                    type: 'string',
                    enum: ['course'],
                    description: 'Facet type to include',
                },
                limit: {
                    type: 'number',
                    description: 'Maximum results (default: 100)',
                },
                deliveryModeId: {
                    type: 'string',
                    description: 'Delivery mode WID (e.g., "1b158166c696100004bf89394d230078" for Online Learning)',
                },
            },
        },
    },
    {
        name: 'workday_get_course_section',
        description: 'Get a specific course section by ID',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Course section ID',
                },
            },
            required: ['id'],
        },
    },
    {
        name: 'workday_get_course_section_detail',
        description: 'Get course section detail via Protected REST API (HAR spec v1.1)',
        inputSchema: {
            type: 'object',
            properties: {
                sectionWid: {
                    type: 'string',
                    description: 'Course section WID',
                },
                view: {
                    type: 'string',
                    enum: ['savedCourseSection'],
                    description: 'Response view type',
                },
            },
            required: ['sectionWid'],
        },
    },
    {
        name: 'workday_get_course_section_ui_detail',
        description: 'Get course section UI detail including public notes, meeting patterns, reserved seats, deadlines (HAR spec v1.1)',
        inputSchema: {
            type: 'object',
            properties: {
                sectionId: {
                    type: 'string',
                    description: 'Course section ID',
                },
            },
            required: ['sectionId'],
        },
    },
    {
        name: 'workday_get_course',
        description: 'Get course details by ID',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Course ID',
                },
            },
            required: ['id'],
        },
    },
    {
        name: 'workday_get_grading_basis',
        description: 'Get grading basis options for a course',
        inputSchema: {
            type: 'object',
            properties: {
                courseId: {
                    type: 'string',
                    description: 'Course ID',
                },
            },
            required: ['courseId'],
        },
    },
    {
        name: 'workday_get_saved_schedules',
        description: 'Get saved schedules from Workday',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'workday_get_feature_toggles',
        description: 'Get feature toggles from Workday',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'workday_build_saved_schedule_payload',
        description: 'Build a saved schedule payload locally (no network call)',
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Schedule name',
                },
                sections: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of course section IDs',
                },
            },
            required: ['name', 'sections'],
        },
    },
    {
        name: 'workday_validate_saved_schedule',
        description: 'Validate a saved schedule (validate-only, no create/update)',
        inputSchema: {
            type: 'object',
            properties: {
                scheduleId: {
                    type: 'string',
                    description: 'Schedule ID to validate',
                },
            },
            required: ['scheduleId'],
        },
    },
    {
        name: 'workday_plan_online_schedule',
        description: 'Plan an online schedule based on search results (read-only recommendation)',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Course search query',
                },
            },
            required: ['query'],
        },
    },
];
const server = new Server({
    name: 'ubc-workday-mcp',
    version: '1.1.0',
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        let result;
        switch (name) {
            case 'workday_get_profile':
                result = await client.getProfile();
                break;
            case 'workday_search_course_sections':
                result = await client.searchCourseSections(args.query);
                break;
            case 'workday_get_course_sections': {
                const { academicPeriodIds, academicLevelId, courseId, view, includeFacets, facets, limit, deliveryModeId, } = args;
                result = await client.getCourseSectionsProtected({
                    academicPeriodIds,
                    academicLevelId,
                    courseId,
                    view,
                    includeFacets,
                    facets,
                    limit,
                    deliveryModeId,
                });
                break;
            }
            case 'workday_get_course_section':
                result = await client.getCourseSection(args.id);
                break;
            case 'workday_get_course_section_detail': {
                const { sectionWid, view } = args;
                result = await client.getCourseSectionDetail(sectionWid, view);
                break;
            }
            case 'workday_get_course_section_ui_detail': {
                const { sectionId } = args;
                result = await client.getCourseSectionUIDetail(sectionId);
                break;
            }
            case 'workday_get_course':
                result = await client.getCourse(args.id);
                break;
            case 'workday_get_grading_basis':
                result = await client.getGradingBasis(args.courseId);
                break;
            case 'workday_get_saved_schedules':
                result = await client.getSavedSchedules();
                break;
            case 'workday_get_feature_toggles':
                result = await client.getFeatureToggles();
                break;
            case 'workday_build_saved_schedule_payload': {
                const { name, sections } = args;
                result = {
                    name,
                    sections,
                    payload: {
                        name,
                        sectionIds: sections,
                        createdAt: new Date().toISOString(),
                    },
                };
                break;
            }
            case 'workday_validate_saved_schedule':
                result = await client.validateSavedSchedule(args.scheduleId);
                break;
            case 'workday_plan_online_schedule': {
                const searchResult = await client.searchCourseSections(args.query);
                if (searchResult && typeof searchResult === 'object' && 'code' in searchResult) {
                    result = searchResult;
                }
                else {
                    const sections = searchResult;
                    result = sections.slice(0, 3).map((section) => ({
                        courseId: section.courseId,
                        courseCode: section.section,
                        courseTitle: section.instructor,
                        recommendedSections: [section.id],
                        reason: `Section ${section.section} with ${section.enrolled}/${section.capacity} enrolled`,
                    }));
                }
                break;
            }
            default:
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                code: 'UNKNOWN_ERROR',
                                message: `Unknown tool: ${name}`,
                            }),
                        },
                    ],
                    isError: true,
                };
        }
        const isError = result && typeof result === 'object' && 'code' in result;
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
            isError: !!isError,
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        code: 'UNKNOWN_ERROR',
                        message: error instanceof Error ? error.message : 'Unknown error',
                    }),
                },
            ],
            isError: true,
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch(console.error);
//# sourceMappingURL=index.js.map