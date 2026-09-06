import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'LingShu Docs',
  tagline: 'The Pivot of Agent Orchestration — JDK 8+ Java Agent Engine',
  favicon: 'img/lingshu_logo.svg',

  url: 'https://lingshu-ai-agent.github.io',
  baseUrl: '/lingshu-docs/',

  organizationName: 'lingshu-ai-agent',
  projectName: 'lingshu-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-preview.png',
    navbar: {
      title: 'LingShu',
      logo: {
        alt: 'LingShu Logo',
        src: 'img/lingshu_logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/lingshu-ai-agent/lingshu',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Quick Start', to: '/intro' },
            { label: 'Concepts', to: '/category/concepts' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub Org', href: 'https://github.com/lingshu-ai-agent' },
            { label: 'Issues', href: 'https://github.com/lingshu-ai-agent/lingshu/issues' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Engine Repo', href: 'https://github.com/lingshu-ai-agent/lingshu' },
            { label: 'Design Doc', href: 'https://github.com/lingshu-ai-agent/lingshu/blob/main/dsh_agent_design.md' },
          ],
        },
      ],
      copyright: `Apache 2.0 · Built with 🪷 by the LingShu community`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'yaml', 'json', 'bash'],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;