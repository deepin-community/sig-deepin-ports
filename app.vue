<template>
  <v-app>
    <NuxtLoadingIndicator />
    <NavBar />
    <v-main>
      <NuxtPage />
    </v-main>
    <BackToTop />
    <FooterBar />
  </v-app>
</template>

<style>
html {
  overflow-y: auto !important;
}

.main-content {
  max-width: 900px;
}

a:not([class*="v"])::before {
  font-family: "Material Design Icons";
  content: "\F0339 ";
}
a:not([class*="v"]) {
  text-decoration: none;
}
a:not([class*="v"]):hover {
  text-decoration: underline;
}
</style>
