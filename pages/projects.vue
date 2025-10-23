<template>
  <v-container class="main-content my-6">
    <title-card
      title="deepin-ports 项目列表"
      subtitle="deepin-ports 的所有项目"
      text="一键导航，不用翻箱倒柜。"
      icon="mdi-source-branch"
    />
    <v-row v-if="projectsToDisplay && projectsToDisplay.length > 0" no-gutters>
      <v-col
        v-for="project in projectsToDisplay"
        :key="project.repo"
        cols="12"
        sm="6"
        md="4"
        class="d-flex align-stretch pa-2"
      >
        <v-card
          variant="outlined"
          color="primary"
          :title="project.title"
          :subtitle="project.repo"
          prepend-icon="mdi-github"
          class="d-flex flex-column flex-grow-1 project-card"
          hover
        >
          <v-card-text class="flex-grow-1">
            <p class="project-description mb-0">
              {{ project.description }}
            </p>
          </v-card-text>
          <v-divider />
          <v-card-actions class="justify-end pa-3">
            <v-btn
              variant="tonal"
              color="primary"
              :href="
                'https://github.com/' +
                (project.repo.includes('/')
                  ? project.repo
                  : 'deepin-community/' + project.repo)
              "
              target="_blank"
              rel="noopener noreferrer"
              append-icon="mdi-open-in-new"
              size="small"
            >
              访问项目
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-sheet rounded="lg" class="pa-6 text-center" color="surface-variant">
          <v-icon size="48" color="info" class="mb-3"
            >mdi-information-outline</v-icon
          >
          <h3 class="text-h6 mb-2">暂无项目</h3>
          <p class="text-body-1 text-medium-emphasis">
            目前还没有可供展示的项目。请稍后再来查看，或关注我们的社区动态。
          </p>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import projects_json from "@/assets/projects.json";
import type { Project } from "~/types/project";

const projectsToDisplay: Project[] = projects_json;

useSeoMeta({
  title: "项目列表",
  description: "",
});
definePageMeta({ title: "项目列表" });
</script>

<style scoped>
.main-content {
  max-width: 1400px;
}
</style>
