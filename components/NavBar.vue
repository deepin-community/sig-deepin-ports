<template>
  <v-app-bar class="px-md-6" scroll-behavior="elevate hide">
    <v-app-bar-title>
      <v-avatar rounded class="mr-2">
        <v-img src="~/assets/logo.svg" />
      </v-avatar>
      <b class="text-primary">deepin-ports SIG</b>
      <span class="hidden-sm-and-down">
        |
        {{ route.meta.title || route.name || "Error" }}
      </span>
    </v-app-bar-title>
    <v-spacer />
    <div v-for="link in navlinks" :key="link.title" class="hidden-md-and-down">
      <v-btn
        v-if="link.type != NavType.Group"
        rounded="pill"
        variant="text"
        :to="link.type == NavType.Internal ? link.target : undefined"
        :href="link.type == NavType.External ? link.target : undefined"
        :target="link.type == NavType.External ? '_blank' : undefined"
      >
        {{ link.title }}
        <v-icon v-if="link.type == NavType.External" size="small" end
          >mdi-open-in-new</v-icon
        >
      </v-btn>

      <v-btn v-else rounded="pill" variant="text">
        {{ link.title }}<v-icon>mdi-menu-down</v-icon>
        <v-menu activator="parent" open-on-hover>
          <v-list :lines="false" rounded="lg" density="compact" nav>
            <template v-for="item in link.targets" :key="item.title">
              <v-list-subheader v-if="item.type == NavType.Subtitle">{{
                item.title
              }}</v-list-subheader>
              <v-list-item
                v-if="
                  item.type == NavType.Internal || item.type == NavType.External
                "
                :to="item.type == NavType.Internal ? item.target : undefined"
                :href="item.type == NavType.External ? item.target : undefined"
                :title="item.title"
              >
                <template v-if="item.type == NavType.External" #append>
                  <v-icon>mdi-open-in-new</v-icon>
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </v-btn>
    </div>
    <v-divider vertical inset class="mx-2 hidden-md-and-down" />
    <GlobalSearch />
    <v-app-bar-nav-icon
      class="hidden-lg-and-up ml-1"
      variant="text"
      @click.stop="drawer = !drawer"
    />
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    class="hidden-lg-and-up"
    location="bottom"
    temporary
  >
    <v-list>
      <template v-for="link in navlinks" :key="link.title">
        <v-list-item
          v-if="link.type != NavType.Group"
          :title="link.title"
          :to="link.type == NavType.Internal ? link.target : undefined"
          :href="link.type == NavType.External ? link.target : undefined"
          :append-icon="
            link.type == NavType.External ? 'mdi-open-in-new' : undefined
          "
        />
        <v-list-group v-else>
          <template #activator="{ props }">
            <v-list-item v-bind="props" :title="link.title" />
          </template>
          <template v-for="item in link.targets" :key="item.title">
            <v-list-subheader v-if="item.type == NavType.Subtitle">{{
              item.title
            }}</v-list-subheader>
            <v-list-item
              v-if="
                item.type == NavType.Internal || item.type == NavType.External
              "
              :to="item.type == NavType.Internal ? item.target : undefined"
              :href="item.type == NavType.External ? item.target : undefined"
              :title="item.title"
            >
              <template v-if="item.type == NavType.External" #append>
                <v-icon>mdi-open-in-new</v-icon>
              </template>
            </v-list-item>
          </template>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import navlinks_json from "~/assets/navlinks.json";
import type { Nav } from "~/types/nav";
import { NavType } from "~/types/nav";

const navlinks: Nav = navlinks_json;

const route = useRoute();

const drawer = ref(false);
</script>
