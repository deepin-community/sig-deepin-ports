// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { md3 } from "vuetify/blueprints";
import { createVuetify } from "vuetify";

const deepinTheme = {
  dark: false,
  colors: {
    primary: "#0091c9",
  },
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    blueprint: md3,
    theme: {
      defaultTheme: "deepinTheme",
      themes: {
        deepinTheme,
      },
    },
  });
  app.vueApp.use(vuetify);
});
