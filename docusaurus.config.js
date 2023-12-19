// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Whatspie Sass API",
  tagline: "V 2.0.0",
  url: "https://whatspie.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  organizationName: "devhunts", // Usually your GitHub org/user name.
  projectName: "whatspie-doc", // Usually your repo name.

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          docLayoutComponent: "@theme/DocPage",
          docItemComponent: "@theme/ApiItem", // Derived from docusaurus-theme-openapi
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        title: "Whatspie API",
        logo: {
          alt: "My Site Logo",
          src: "img/logo-icon.png",
        },
        items: [
          {
            label: "Documentation",
            position: "left",
            to: "/docs/api/v2",
          },
          {
            href: "https://github.com/DevHunts-Com/whatspie-api-docs",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Documentation",
                to: "/docs/whatspie/whatspie-sass-api",
              },
            ],
          },
          {
            title: "Our App",
            items: [
              {
                label: "Whatspie Wa Blast",
                to: "https://whatspie.com",
              },
              {
                label: "Whatspie Team Chat",
                to: "#",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} By Devhunts Team, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["ruby", "csharp", "php"],
      },
    }),

  plugins: [
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "openapi",
        docsPluginId: "classic",
        config: {
          whatspie: {
            specPath: "examples/whatspie-v2-theme-2.yaml", // checkpoint source
            outputDir: "docs/whatspie",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag",
            },
            version: '2.0.0'
          },
        },
      },
    ],
  ],

  themes: ["docusaurus-theme-openapi-docs"],
};

module.exports = config;
