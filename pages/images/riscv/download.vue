<template>
  <v-container class="my-6">
    <v-alert
      title="RISC-V 架构目前仍在预览（Preview）阶段"
      text="请注意，RISC-V 架构的镜像仍在预览阶段，可能存在不稳定性和不完整性。"
      type="warning"
      variant="tonal"
      class="mb-4"
    ></v-alert>
    <v-card>
      <v-card-actions>
        <v-checkbox
          hide-details
          density="compact"
          v-model="show_deprecated"
          label="显示过时镜像"
        />
        <v-checkbox
          hide-details
          density="compact"
          v-model="show_customized"
          label="显示定制镜像"
        />
      </v-card-actions>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="30"
        :group-by="groupby"
        :sort-by="sortby"
        :loading="loading"
        :key="show_deprecated + 2 * show_customized"
      >
        <template
          v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }"
        >
          <tr
            v-if="
              (!devicelist[item.value]?.replacedby || show_deprecated) &&
              (!devicelist[item.value]?.modified || show_customized)
            "
          >
            <td :colspan="columns.length" @click="toggleGroup(item)">
              <v-icon
                :icon="isGroupOpen(item) ? '$expand' : '$next'"
                size="small"
                variant="text"
              ></v-icon>
              {{
                Object.keys(devicelist).includes(item.value)
                  ? devicelist[item.value].desc
                  : item.value
              }}
              <v-chip size="small" color="primary" class="ml-2">
                {{ item.items.length }}
              </v-chip>
              <v-chip
                v-if="devicelist[item.value]?.modified"
                size="small"
                class="ml-2"
                >厂商定制</v-chip
              >
              <v-chip
                size="small"
                color="warning"
                class="ml-2"
                v-if="devicelist[item.value]?.replacedby"
              >
                过时
                <v-tooltip activator="parent" location="end"
                  >被
                  {{
                    Object.keys(devicelist).includes(
                      devicelist[item.value]?.replacedby
                    )
                      ? devicelist[devicelist[item.value]?.replacedby].desc
                      : devicelist[item.value]?.replacedby
                  }}
                  取代</v-tooltip
                >
              </v-chip>
            </td>
          </tr>
        </template>
        <template #item.data-table-group="{ item }">
          <template v-for="tag in item.tags" :key="tag">
            <v-chip
              v-if="Object.keys(imagelabels).includes(tag)"
              :color="imagelabels[tag].color"
              >{{ imagelabels[tag].title }}</v-chip
            >
            <v-chip v-else>{{ tag }}</v-chip>
          </template>
        </template>
        <template #item.size="{ item }">
          {{ (item.size / 1024 / 1024 / 1024).toFixed(2) }} GB
        </template>
        <template #item.link="{ item }">
          <v-btn
            color="primary"
            variant="text"
            :href="item.link"
            target="_blank"
            rel="noopener noreferrer"
            prepend-icon="mdi-download"
            text="下载"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import imagelabels from "~/assets/image-labels.json";
import devicelist from "~/assets/devicelist.json";
import { ref } from "vue";

const headers = [
  { title: "镜像版本", value: "type" },
  { title: "镜像大小", value: "size" },
  { title: "发布日期", value: "date" },
  { title: "链接", value: "link", sortable: false },
];

const groupby = [
  {
    key: "device",
    order: "asc",
  },
];

const sortby = ref([{ key: "date", order: "desc" }]);

const items = ref([]);

const loading = ref(true);

const show_deprecated = ref(false);
const show_customized = ref(false);

const dataurl =
  "https://deepin-community.github.io/sig-deepin-ports-images/images.json";

const fetchImages = async () => {
  const response = await fetch(dataurl);
  const data = await response.json();
  items.value = data;
  loading.value = false;
};

fetchImages();

useSeoMeta({
  title: "RISC-V 镜像下载",
  description: "",
});
definePageMeta({ title: "RISC-V 镜像下载" });
</script>
