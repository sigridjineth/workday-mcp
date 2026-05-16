import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { WorkdayClient } from './client.js';
import { WorkdayConfig, CourseSection } from './types.js';

const WORKDAY_BASE_URL = process.env.WORKDAY_BASE_URL || '';
const WORKDAY_AUTH_TOKEN = process.env.WORKDAY_AUTH_TOKEN || '';

if (!WORKDAY_BASE_URL || !WORKDAY_AUTH_TOKEN) {
  console.error('Missing required environment variables: WORKDAY_BASE_URL, WORKDAY_AUTH_TOKEN');
  process.exit(1);
}

const config: WorkdayConfig = {
  baseUrl: WORKDAY_BASE_URL,
  authToken: WORKDAY_AUTH_TOKEN,
};

const client = new WorkdayClient(config);

const tools: Tool[] = [
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

const server = new Server(
  {
    name: 'ubc-workday-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: unknown;

    switch (name) {
      case 'workday_get_profile':
        result = await client.getProfile();
        break;
      case 'workday_search_course_sections':
        result = await client.searchCourseSections((args as { query: string }).query);
        break;
      case 'workday_get_course_section':
        result = await client.getCourseSection((args as { id: string }).id);
        break;
      case 'workday_get_course':
        result = await client.getCourse((args as { id: string }).id);
        break;
      case 'workday_get_grading_basis':
        result = await client.getGradingBasis((args as { courseId: string }).courseId);
        break;
      case 'workday_get_saved_schedules':
        result = await client.getSavedSchedules();
        break;
      case 'workday_get_feature_toggles':
        result = await client.getFeatureToggles();
        break;
      case 'workday_build_saved_schedule_payload': {
        const { name, sections } = args as { name: string; sections: string[] };
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
        result = await client.validateSavedSchedule((args as { scheduleId: string }).scheduleId);
        break;
      case 'workday_plan_online_schedule': {
        const searchResult = await client.searchCourseSections((args as { query: string }).query);
        if (searchResult && typeof searchResult === 'object' && 'code' in searchResult) {
          result = searchResult;
        } else {
          const sections = searchResult as CourseSection[];
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
  } catch (error) {
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
