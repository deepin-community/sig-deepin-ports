<template>
  <v-container fluid class="pa-0">
    <v-container
      class="d-flex align-center justify-center text-center pa-6 mb-12"
    >
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-avatar variant="elevated" size="160" class="mb-6"
            ><v-img src="@/assets/logo.svg"
          /></v-avatar>
          <h1
            class="text-h3 text-sm-h2 font-weight-bold mb-4 text-primary"
            style="line-height: 1.2"
          >
            多架构支持，由 deepin-ports 为您呈现
          </h1>
          <p class="text-h6 text-sm-h5 text-grey-darken-2 font-weight-regular">
            全球知名的桌面 Linux 发行版，现已拥抱最新最热的 RISC-V
            架构，拓展无限可能。
          </p>
          <div class="mt-8">
            <v-btn-group variant="tonal" class="my-1 mx-2" divided>
              <v-btn
                color="primary"
                size="large"
                to="/images/arm64"
                prepend-icon="mdi-download-outline"
              >
                ARM 镜像
              </v-btn>
              <v-btn
                color="primary"
                size="large"
                to="/images/riscv64"
                prepend-icon="mdi-download-outline"
              >
                RISC-V 镜像
              </v-btn>
            </v-btn-group>
            <v-btn
              variant="tonal"
              color="secondary"
              size="large"
              class="my-1 mx-2"
              to="/matrix"
              prepend-icon="mdi-table"
            >
              设备支持矩阵
            </v-btn>
            <br />
            <v-btn
              variant="text"
              class="my-1 mx-2"
              color="secondary"
              size="small"
              href="https://deepin.org/download"
              prepend-icon="mdi-open-in-new"
            >
              下载其它架构镜像
            </v-btn>
            <v-btn
              variant="text"
              color="secondary"
              size="small"
              class="my-1 mx-2"
              href="https://deepin.org"
              prepend-icon="mdi-open-in-new"
            >
              deepin 主页
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-sheet
      class="d-flex align-center justify-center pa-6"
      color="grey-lighten-4"
    >
      <v-container class="py-12">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8" class="text-center mb-10">
            <h2 class="text-h4 font-weight-medium text-primary">
              深入 deepin-ports 的世界
            </h2>
            <p class="text-body-1 text-grey-darken-1 mt-3">
              我们致力于将 deepin
              桌面操作系统带到更多硬件平台，构建一个开放、多元的生态系统。
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="indexlink in indexlinks"
            :key="indexlink.title"
            cols="12"
            sm="6"
            lg="3"
          >
            <v-card
              variant="tonal"
              color="primary"
              class="fill-height d-flex flex-column"
              hover
            >
              <v-card-item class="pb-0">
                <template #prepend>
                  <v-avatar color="primary" rounded="lg" class="mr-4">
                    <v-icon size="x-large">{{ indexlink.icon }}</v-icon>
                  </v-avatar>
                </template>
                <v-card-title class="text-h5 font-weight-bold">{{
                  indexlink.title
                }}</v-card-title>
                <v-card-subtitle class="text-body-1">{{
                  indexlink.subtitle
                }}</v-card-subtitle>
              </v-card-item>
              <v-card-text class="flex-grow-1">
                <p class="mb-4">
                  {{ indexlink.text }}
                </p>
              </v-card-text>
              <v-card-actions
                v-for="action in indexlink.actions"
                :key="action.text"
              >
                <v-btn
                  v-if="action.type == 'internal' || action.type == 'external'"
                  color="primary"
                  variant="text"
                  :to="action.type == 'internal' ? action.target : null"
                  :href="action.type == 'external' ? action.target : null"
                  :append-icon="
                    action.type == 'external' ? 'mdi-open-in-new' : null
                  "
                  block
                >
                  {{ action.text }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
    <v-container class="py-12">
      <v-row align="center" justify="center">
        <v-col cols="12" md="8" class="text-center my-12">
          <v-icon color="primary" size="64" class="mb-4">mdi-github</v-icon>
          <h2 class="text-h4 font-weight-medium mb-3 text-primary">
            为 deepin-ports 做出您的贡献
          </h2>
          <p class="text-body-1 text-grey-darken-2 mb-8">
            deepin-ports
            是一个由充满热情的开发者、爱好者和贡献者组成的社区。我们欢迎您加入，一同为多架构的
            deepin 生态添砖加瓦。无论您的经验如何，总有您能发光发热的地方。
          </p>
          <v-btn
            size="large"
            color="primary"
            class="mx-2 mb-2"
            variant="outlined"
            href="https://github.com/deepin-community/sig"
            target="_blank"
            rel="noopener noreferrer"
            prepend-icon="mdi-github"
          >
            申请加入 SIG
          </v-btn>
          <v-btn
            size="large"
            color="secondary"
            variant="outlined"
            class="mx-2 mb-2"
            href="https://t.me/+gayVJlNnqXNlYzM1"
            prepend-icon="mdi-chat-outline"
          >
            Telegram 讨论群
          </v-btn>
          <v-btn
            size="large"
            color="secondary"
            variant="outlined"
            class="mx-2 mb-2"
            href="https://matrix.to/#/#deepin-ports:matrix.org"
            prepend-icon="mdi-matrix"
          >
            Matrix 讨论群
          </v-btn>
          <v-divider class="my-8" />
          <h5 class="text-h5 mb-1 text-primary">友情链接</h5>
          <p class="mb-3 text-body-1 text-grey-darken-2">
            向您介绍 deepin-ports SIG 的伙伴们
          </p>
          <v-btn
            v-for="coopcommunitie in coopcommunities"
            :key="coopcommunitie.title"
            class="mx-2"
            color="secondary"
            variant="outlined"
            :text="coopcommunitie.title"
            :href="coopcommunitie.link"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import indexlinks from "~/assets/indexlinks.json";
import coopcommunities from "~/assets/coop-communities.json";

useSeoMeta({
  title: "主页",
});
definePageMeta({ title: "主页" });
</script>
