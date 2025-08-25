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
  apiSidebar: [
    'intro',
    'authentication', 
    'device-management',
    {
      type: 'category',
      label: '💬 Messaging',
      items: [
        'messaging/send-text',
        'messaging/send-image',
        'messaging/send-file',
        'messaging/send-location'
      ],
    },
    {
      type: 'category',
      label: '👥 Group Management',
      items: [
        'groups/send-group-messages',
        'groups/list-groups',
        'groups/get-group',
        'groups/update-group',
        'groups/add-members',
      ],
    },
    {
      type: 'category',
      label: '📞 Contacts',
      items: [
        'contacts/check-contacts',
      ],
    },
  ],
};

export default sidebars;
