import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  build: {
    transpile: ["vuetify"],
  },

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@nuxt/content",
    [
      "nuxt-content-body-html",
      {
        fields: {
          bodyHtml: {},
        },
      },
    ],
    "nuxt-module-feed",
    "@nuxtjs/google-fonts",
    "@nuxt/eslint",
    "@nuxtjs/sitemap",
    "nuxt-schema-org",
    "nuxt-seo-experiments",
    "nuxt-route-meta",
  ],

  runtimeConfig: {
    public: {
      siteUrl:
        process.env.PUBLIC_WEB_URL ||
        "https://deepin-community.github.io/sig-deepin-ports",
    },
  },

  feed: {
    sources: [
      {
        path: "/feed.blog.xml",
        type: "atom1",
        cacheTime: 60 * 15,
      },
      {
        path: "/feed.installdocs.xml",
        type: "atom1",
        cacheTime: 60 * 15,
      },
      {
        path: "/feed.testdocs.xml",
        type: "atom1",
        cacheTime: 60 * 15,
      },
    ],
  },

  site: {
    url: process.env.PUBLIC_WEB_URL || "https://deepin-community.github.io",
    name: "deepin-ports SIG",
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  pages: true,
  css: ["@mdi/font/css/materialdesignicons.min.css"],

  googleFonts: {
    families: {
      Roboto: [100, 300, 400, 500, 700, 900],
    },
  },

  app: {
    baseURL: "/sig-deepin-ports/",
    head: {
      titleTemplate: "deepin-ports SIG | %s",
      meta: [
        {
          name: "keywords",
          content: "deepin,deepin-ports,SIG,sig-deepin-ports",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1",
        },
      ],
      link: [
        {
          rel: "alternate",
          type: "application/atom+xml",
          title: "Blog",
          href: "/feed.blog.xml",
        },
        {
          rel: "alternate",
          type: "application/atom+xml",
          title: "Install Docs",
          href: "/feed.installdocs.xml",
        },
        {
          rel: "alternate",
          type: "application/atom+xml",
          title: "Test Reports",
          href: "/feed.testdocs.xml",
        },
      ],
    },
  },

  schemaOrg: {
    identity: {
      type: "Organization",
      name: "deepin",
      description:
        "deepin is a Linux distribution devoted to providing a beautiful, easy to use, safe and reliable system for global users.",
      url: "https://deepin.org",
      sameAs: [
        "https://github.com/deepin-community",
        "https://github.com/linuxdeepin",
      ],
    },
  },

  compatibilityDate: "2025-06-05",
});
