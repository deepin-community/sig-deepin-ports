<template>
    <v-app-bar class="px-md-6" :elevation="0">
        <v-app-bar-title>
            <v-avatar rounded class="mr-2">
                <v-img src="~/assets/logo.svg" />
            </v-avatar>
            <b>deepin-ports SIG</b> |
            {{ route.meta.title || route.name || "Error" }}
        </v-app-bar-title>
        <v-spacer />
        <div v-for="link in navlinks" :key="link.title">
            <v-btn
                v-if="link.type != 'group'"
                rounded="lg"
                variant="text"
                :active="false"
                :to="link.type == 'internal' ? link.target : null"
                :href="link.type == 'external' ? link.target : null"
                :append-icon="
                    link.type == 'external' ? 'mdi-open-in-new' : undefined
                "
            >
                {{ link.title }}
            </v-btn>
            <v-btn v-else rounded="lg" variant="text">
                {{ link.title }}<v-icon>mdi-menu-down</v-icon>
                <v-menu activator="parent" open-on-hover>
                    <v-list :lines="false" density="compact" nav>
                        <template v-for="item in link.target" :key="item.title">
                            <v-list-subheader v-if="item.type == 'subtitle'">{{
                                item.title
                            }}</v-list-subheader>
                            <v-list-item
                                v-if="
                                    item.type == 'internal' ||
                                    item.type == 'external'
                                "
                                :to="
                                    item.type == 'internal' ? item.target : null
                                "
                                :href="
                                    item.type == 'external' ? item.target : null
                                "
                                :title="item.title"
                            >
                                <template
                                    v-if="item.type == 'external'"
                                    #append
                                >
                                    <v-icon>mdi-open-in-new</v-icon>
                                </template>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-menu>
            </v-btn>
        </div>
    </v-app-bar>
</template>

<script setup lang="ts">
import navlinks from "~/assets/navlinks.json";

const route = useRoute();
</script>
