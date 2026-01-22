<template>
  <v-container class="my-6">
    <v-alert
      v-if="arch == 'riscv64'"
      title="RISC-V 架构目前仍在预览（Preview）阶段"
      text="请注意，RISC-V 架构的镜像仍在预览阶段，可能存在不稳定性和不完整性。"
      type="warning"
      variant="tonal"
      class="mb-4"
      rounded="lg"
    />
    <v-alert
      title="社区支持声明"
      type="info"
      variant="tonal"
      class="mb-4"
      rounded="lg"
    >
      deepin 镜像仅提供社区级别的基本技术支持，如需定制开发，请：
      <ul>
        <li>
          1. <a href="mailto:support@deepin.org">联系我们</a> 咨询 deepin
          的商务合作。
        </li>
        <li>
          2. 咨询我们的下游商业发行版「<a href="https://www.chinauos.com"
            >统信 UOS</a
          >」，客服热线 400-8588-488。
        </li>
      </ul>
    </v-alert>
    <v-alert
      title="默认密码"
      type="info"
      variant="tonal"
      class="mb-4"
      rounded="lg"
    >
      带安装器的桌面镜像(<code>liveimage-desktop</code>)默认不创建用户，请自行通过图形界面安装器创建。root
      用户的默认密码为 <code>deepin</code>。
    </v-alert>
    <ImageList :loading="loading" :items="items" :arch="arch" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ImageInfo } from "~/types/image";
import { fetchimglist } from "~/utils/fetch";
const { params } = useRoute();

const arch = typeof params.arch != "string" ? params.arch[0] : params.arch;

const items: Ref<ImageInfo[]> = ref([]);

const loading = ref(true);

const fetchImages = async () => {
  items.value = await fetchimglist(arch);
  loading.value = false;
};

fetchImages();

useSeoMeta({
  title: `镜像列表`,
  description: "",
});
definePageMeta({ title: `镜像列表` });
</script>
