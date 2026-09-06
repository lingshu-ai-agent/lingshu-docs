import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Concepts',
      collapsed: false,
      items: [
        'concepts/identity-and-memory',
      ],
    },
    {
      type: 'category',
      label: 'Coming Soon',
      collapsed: true,
      items: [
        // 占位 — 等后续 docs 补全
      ],
    },
  ],
};

export default sidebars;