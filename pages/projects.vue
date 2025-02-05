<template>
  <v-container class="main-content my-6">
    <title-card
      title="deepin-ports 项目列表"
      subtitle="deepin-ports 的所有项目"
      text="一键导航，不用翻箱倒柜"
    />
    <v-row no-gutters>
      <v-col cols="6" v-for="project in projects" :key="project.repo">
        <v-card
          :title="project.title"
          :subtitle="project.repo"
          prepend-icon="mdi-github"
          append-icon="mdi-open-in-new"
          target="_blank"
          class="ma-1"
          :href="
            'https://github.com/' +
            (project.repo.includes('/')
              ? project.repo
              : 'deepin-community/' + project.repo)
          "
        >
          <v-card-text>
            {{ project.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import projects from "~/assets/projects.json";
</script>
