import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

const publicWebUrl =
  process.env.PUBLIC_WEB_URL ||
  "https://deepin-community.github.io/sig-deepin-ports/";

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
    "@nuxtjs/google-fonts",
    "@nuxt/eslint",
    "@nuxtjs/sitemap",
    "nuxt-schema-org",
    "nuxt-seo-experiments",
    "nuxt-route-meta",
    [
      "nuxt-content-git",
      {
        createdAtName: "gitCreatedAt",
        updatedAtName: "gitUpdatedAt",
      },
    ],
  ],
  runtimeConfig: {
    public: {
      siteUrl: publicWebUrl,
    },
  },
  site: {
    url: publicWebUrl,
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
});
