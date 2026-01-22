<template>
  <v-container fluid class="pa-0">
    <v-sheet
      class="d-flex align-center justify-center text-center position-relative overflow-hidden"
      min-height="85vh"
      color="background"
    >
      <div class="bg-gradient position-absolute w-100 h-100"/>

      <v-container class="position-relative mx-6" style="z-index: 2" max-width="1300px">
        <v-avatar variant="elevated" size="160" class="mb-12 hidden-md-and-up"
          ><v-img src="@/assets/logo.svg"
        /></v-avatar>
        <v-row justify="center" align="center">
          <v-col cols="12" md="6" class="text-md-left text-center">
            <h1 class="text-h3 text-lg-h2 font-weight-black mb-3 text-primary">
              多架构支持，由
            </h1>
            <h1
              class="text-h3 text-lg-h2 font-weight-black mb-6 text-secondary"
            >
              deepin-ports
            </h1>
            <h1 class="text-h3 text-lg-h2 font-weight-black mb-6 text-primary">
              为您呈现
            </h1>
            <p class="text-h6 text-medium-emphasis font-weight-regular mb-8">
              全球知名的桌面 Linux
              发行版，现已拥抱多种最新最热架构，拓展无限可能
            </p>
            <div class="mt-8 justify-md-start justify-center">
              <v-btn-group variant="tonal" class="my-1 mr-2" divided>
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
                class="my-1 mr-1"
                to="/matrix"
                prepend-icon="mdi-table"
              >
                设备支持矩阵
              </v-btn>
              <br />
              <v-btn
                variant="text"
                class="my-1 mr-2"
                color="secondary"
                size="small"
                href="https://deepin.org/download"
                prepend-icon="mdi-open-in-new"
              >
                下载其它架构 / 通用 ISO 镜像
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
          <v-col cols="12" md="6" class="d-none d-md-flex justify-center">
            <v-img
              src="@/assets/logo.svg"
              max-width="400"
              class="logo-animate"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-sheet
      class="d-flex align-center justify-center pa-6"
      color="grey-lighten-4"
    >
      <v-container class="py-16">
        <v-row>
          <v-col cols="12" class="text-center mb-8">
            <h2 class="text-h4 font-weight-medium text-primary">
              深入 deepin-ports 的世界
            </h2>
            <p class="text-body-1 text-grey-darken-1 mt-3">
              我们致力于将 deepin
              桌面操作系统带到更多硬件平台，构建一个开放、多元的生态系统。
            </p>
          </v-col>
          <v-col
            v-for="link in indexlinks"
            :key="link.title"
            cols="12"
            sm="6"
            lg="3"
          >
            <v-card
              class="h-100 pa-2"
              hover
              border
              rounded="xl"
              variant="flat"
              color="surface"
            >
              <v-card-item>
                <v-avatar
                  color="primary"
                  variant="tonal"
                  rounded="lg"
                  class="mb-4"
                >
                  <v-icon>{{ link.icon }}</v-icon>
                </v-avatar>
                <v-card-title class="pt-0">{{ link.title }}</v-card-title>
                <v-card-subtitle class="opacity-80">{{
                  link.subtitle
                }}</v-card-subtitle>
              </v-card-item>
              <v-card-text class="text-body-2 text-medium-emphasis">
                {{ link.text }}
              </v-card-text>
              <v-card-actions>
                <v-btn
                  v-for="action in link.actions"
                  :key="action.text"
                  :to="action.type == 'internal' ? action.target : undefined"
                  :href="action.type == 'external' ? action.target : undefined"
                  variant="text"
                  color="primary"
                  block
                  :append-icon="
                    action.type == 'external'
                      ? 'mdi-open-in-new'
                      : 'mdi-arrow-right'
                  "
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

useSeoMeta({ title: "主页" });
definePageMeta({ title: "主页" });
</script>

<style scoped>
.bg-gradient {
  background:
    radial-gradient(
      circle at 10% 20%,
      rgba(0, 145, 201, 0.1) 0%,
      transparent 40%
    ),
    radial-gradient(
      circle at 90% 80%,
      rgba(92, 107, 192, 0.1) 0%,
      transparent 40%
    );
}
.logo-animate {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
