import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main API documentation sidebar
  // Ordered by the reader's workflow: token → device → send → groups → contacts → events → AI tooling
  apiSidebar: [
    'intro',
    'quickstart',
    'authentication',
    {
      type: 'category',
      label: 'Devices',
      items: [
        {type: 'doc', id: 'device-management', label: 'Overview'},
        'devices/create',
        'devices/list',
        'devices/get',
        'devices/qr',
        'devices/update',
        'devices/delete',
      ],
    },
    {
      type: 'category',
      label: 'Messaging',
      items: [
        'messaging/get-message',
        'messaging/send-text',
        'messaging/send-image',
        'messaging/send-video',
        'messaging/send-file',
        'messaging/send-location',
        'messaging/send-reaction',
        'messaging/guide',
      ],
    },
    {
      type: 'category',
      label: 'Groups',
      items: [
        'groups/list-groups',
        'groups/get-group',
        'groups/refresh-groups',
        'groups/send-group-messages',
        'groups/add-members',
        'groups/update-group',
      ],
    },
    {
      type: 'category',
      label: 'Contacts',
      items: ['contacts/check-contacts'],
    },
    'webhooks',
    {
      type: 'category',
      label: 'MCP Server',
      items: ['mcp/quickstart', 'mcp/guides', 'mcp/reference'],
    },
  ],
};

export default sidebars;
