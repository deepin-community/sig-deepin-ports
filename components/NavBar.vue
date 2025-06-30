<template>
  <v-app-bar class="px-md-6" :elevation="0">
    <v-app-bar-title>
      <v-avatar rounded class="mr-2">
        <v-img src="~/assets/logo.svg" />
      </v-avatar>
      <b>deepin-ports SIG</b>
      <span class="hidden-sm-and-down">
        |
        {{ route.meta.title || route.name || "Error" }}
      </span>
    </v-app-bar-title>
    <v-spacer />
    <v-app-bar-nav-icon
      class="mx-2 hidden-lg-and-up"
      variant="text"
      @click.stop="drawer = !drawer"
    />
    <div class="hidden-md-and-down" v-for="link in navlinks" :key="link.title">
      <v-btn
        v-if="link.type != 'group'"
        rounded="lg"
        variant="text"
        :active="false"
        :to="link.type == 'internal' ? link.target : null"
        :href="link.type == 'external' ? link.target : null"
        :append-icon="link.type == 'external' ? 'mdi-open-in-new' : undefined"
      >
        {{ link.title }}
      </v-btn>
      <v-btn v-else rounded="lg" variant="text">
        {{ link.title }}<v-icon>mdi-menu-down</v-icon>
        <v-menu activator="parent" open-on-hover>
          <v-list :lines="false" density="compact" nav>
            <template v-for="item in link.targets" :key="item.title">
              <v-list-subheader v-if="item.type == 'subtitle'">{{
                item.title
              }}</v-list-subheader>
              <v-list-item
                v-if="item.type == 'internal' || item.type == 'external'"
                :to="item.type == 'internal' ? item.target : null"
                :href="item.type == 'external' ? item.target : null"
                :title="item.title"
              >
                <template v-if="item.type == 'external'" #append>
                  <v-icon>mdi-open-in-new</v-icon>
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </v-btn>
    </div>
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    class="mx-2 hidden-lg-and-up"
    location="bottom"
    temporary
  >
    <v-list>
      <template v-for="link in navlinks" :key="link.title">
        <v-list-item
          v-if="link.type != 'group'"
          :title="link.title"
          :to="link.type == 'internal' ? link.target : null"
          :href="link.type == 'external' ? link.target : null"
          :append-icon="link.type == 'external' ? 'mdi-open-in-new' : undefined"
        />
        <v-list-group v-else>
          <template #activator="{ props }">
            <v-list-item v-bind="props" :title="link.title" />
          </template>
          <template v-for="item in link.targets" :key="item.title">
            <v-list-subheader v-if="item.type == 'subtitle'">{{
              item.title
            }}</v-list-subheader>
            <v-list-item
              v-if="item.type == 'internal' || item.type == 'external'"
              :to="item.type == 'internal' ? item.target : null"
              :href="item.type == 'external' ? item.target : null"
              :title="item.title"
            >
              <template v-if="item.type == 'external'" #append>
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
import navlinks from "~/assets/navlinks.json";

const route = useRoute();

const drawer = ref(false);
</script>
