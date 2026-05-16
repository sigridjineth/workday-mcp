import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { WorkdayClient } from './client.js';
const WORKDAY_BASE_URL = process.env.WORKDAY_BASE_URL || '';
const WORKDAY_AUTH_TOKEN = process.env.WORKDAY_AUTH_TOKEN || '';
if (!WORKDAY_BASE_URL || !WORKDAY_AUTH_TOKEN) {
    console.error('Missing required environment variables: WORKDAY_BASE_URL, WORKDAY_AUTH_TOKEN');
    process.exit(1);
}
const config = {
    baseUrl: WORKDAY_BASE_URL,
    authToken: WORKDAY_AUTH_TOKEN,
};
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
        description: 'Search for course sections by query string',
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
];
const server = new Server({
    name: 'ubc-workday-mcp',
    version: '1.0.0',
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
            case 'workday_get_course_section':
                result = await client.getCourseSection(args.id);
                break;
            case 'workday_get_course':
                result = await client.getCourse(args.id);
                break;
            case 'workday_get_grading_basis':
                result = await client.getGradingBasis(args.courseId);
                break;
            case 'workday_get_saved_schedules':
                result = await client.getSavedSchedules();
                break;
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