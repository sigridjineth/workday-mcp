import { describe, it, expect } from 'vitest';
import { WorkdayWidgetClient } from '../client.js';

// Redacted fixture: mimics Workday htmld widget response structure
// No real WIDs, cookies, tokens, or raw HAR data
const REDACTED_WIDGET_FIXTURE = {
  widget: 'root',
  body: {
    widget: 'vbox',
    children: [
      {
        widget: 'hbox',
        children: [
          {
            widget: 'fieldSet',
            children: [
              {
                widget: 'monikerList',
                label: 'Course',
                instances: [
                  {
                    widget: 'moniker',
                    instanceId: 'REDACTED-INSTANCE-1',
                    text: 'ACAM_V 100 - Introduction to Asian Canadian Studies',
                    rt: true,
                    pv: true,
                    v: true,
                  },
                ],
              },
              {
                widget: 'richTextArea',
                label: 'Description',
                value: '<p>Asian Canadian Studies course description</p>',
              },
            ],
          },
        ],
      },
      {
        widget: 'hbox',
        children: [
          {
            widget: 'moniker',
            instanceId: 'REDACTED-INSTANCE-2',
            text: '2026-27 Winter Term 2 (UBC-V)',
          },
          {
            widget: 'moniker',
            instanceId: 'REDACTED-INSTANCE-3',
            text: 'UBCV | UBC Life Building (LIFE) | Floor: 2 | Room: 2212 | Tue Thu | 9:30 a.m. - 11:00 a.m. | 2027-01-05 - 2027-02-11',
          },
        ],
      },
      {
        widget: 'unknownWidget',
        someInternalField: 'should be skipped',
      },
    ],
  },
};

const REDACTED_EMPTY_FIXTURE = {
  widget: 'root',
  body: {
    widget: 'vbox',
    children: [],
  },
};

describe('WorkdayWidgetClient.parseWidgetTree', () => {
  const client = new WorkdayWidgetClient({
    baseUrl: 'https://example.com',
    tenant: 'test',
    cookie: 'test-cookie',
    sessionSecureToken: 'test-token',
  });

  it('parses course moniker from redacted fixture', () => {
    const result = client.parseWidgetTree(REDACTED_WIDGET_FIXTURE);
    expect(result.courses.length).toBeGreaterThanOrEqual(1);
    expect(result.courses[0].descriptor).toContain('ACAM_V 100');
    expect(result.courses[0].source).toBe('courseSectionDetail');
  });

  it('extracts description from richTextArea', () => {
    const result = client.parseWidgetTree(REDACTED_WIDGET_FIXTURE);
    const courseWithDesc = result.courses.find(c => c.publicNotes);
    expect(courseWithDesc).toBeDefined();
    expect(courseWithDesc!.publicNotes).toContain('Asian Canadian Studies');
  });

  it('skips unknown widgets and counts them', () => {
    const result = client.parseWidgetTree(REDACTED_WIDGET_FIXTURE);
    expect(result.debug.unknownWidgets).toBeGreaterThanOrEqual(1);
    expect(result.debug.unknownWidgetTypes).toContain('unknownWidget');
  });

  it('handles empty fixture gracefully', () => {
    const result = client.parseWidgetTree(REDACTED_EMPTY_FIXTURE);
    expect(result.courses).toHaveLength(0);
    expect(result.debug.widgetsVisited).toBeGreaterThanOrEqual(1);
    expect(result.debug.monikersFound).toBe(0);
  });

  it('does not expose raw WIDs or internal IDs in output', () => {
    const result = client.parseWidgetTree(REDACTED_WIDGET_FIXTURE);
    const json = JSON.stringify(result);
    expect(json).not.toContain('REDACTED-INSTANCE');
    expect(json).not.toContain('bbf90a82');
    expect(json).not.toContain('D3EB33A3');
  });
});
