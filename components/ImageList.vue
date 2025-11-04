<template>
  <v-card variant="outlined" color="primary">
    <v-card-actions>
      <v-checkbox
        v-model="show_deprecated"
        hide-details
        density="compact"
        label="显示过时镜像"
      />
      <v-checkbox
        v-model="show_customized"
        hide-details
        density="compact"
        label="显示定制镜像"
      />
    </v-card-actions>
    <v-data-table
      :key="Number(show_deprecated) + 2 * Number(show_customized)"
      :headers="headers"
      :items="items"
      :items-per-page="-1"
      :group-by="groupby"
      :sort-by="sortby"
      :loading="loading"
      hide-default-footer
    >
      <template #group-header="{ item, columns, toggleGroup, isGroupOpen }">
        <tr
          v-if="
            (!devicelist[props.arch][item.value]?.replacedby ||
              show_deprecated) &&
            (!devicelist[props.arch][item.value]?.modified || show_customized)
          "
        >
          <td :colspan="columns.length" @click="toggleGroup(item)">
            <v-icon
              :icon="isGroupOpen(item) ? '$expand' : '$next'"
              size="small"
              variant="text"
            />
            {{
              Object.keys(devicelist[props.arch]).includes(item.value)
                ? devicelist[props.arch][item.value].desc
                : item.value
            }}
            <v-chip size="small" color="primary" class="ml-2">
              {{ item.items.length }}
            </v-chip>
            <v-chip
              v-if="devicelist[props.arch][item.value]?.modified"
              size="small"
              class="ml-2"
              >厂商定制</v-chip
            >
            <v-chip
              v-if="devicelist[props.arch][item.value]?.replacedby"
              size="small"
              color="warning"
              class="ml-2"
            >
              过时
              <!-- <v-tooltip activator="parent" location="end"
                >被
                {{
                  Object.keys(devicelist[props.arch]).includes(
                    devicelist[props.arch][item.value].replacedby,
                  )
                    ? devicelist[props.arch][devicelist[item.value].replacedby]
                        .desc
                    : devicelist[props.arch][item.value]?.replacedby
                }}
                取代</v-tooltip
              > -->
            </v-chip>
            <v-chip
              v-if="
                installdocs &&
                installdocs
                  .map(({ path }) => path.replace(/^\/docs\/install\//, ''))
                  .includes(item.value)
              "
              :to="`/docs/install/${item.value}`"
              size="small"
              color="success"
              class="ml-2"
              prepend-icon="mdi-file-document-outline"
              @click.stop="{}"
            >
              安装指南
            </v-chip>
          </td>
        </tr>
      </template>
      <template #[`item.data-table-group`]="{ item }">
        <template v-for="tag in item.tags" :key="tag">
          <v-chip
            v-if="Object.keys(imagelabels.tags).includes(tag)"
            density="compact"
            class="mr-2"
            :color="imagelabels.tags[tag].color"
            >{{ imagelabels.tags[tag].title }}</v-chip
          >
          <v-chip v-else>{{ tag }}</v-chip>
        </template>
        <v-chip
          v-if="
            testdocs &&
            testdocs
              .map(({ path }) => path.replace(/^\/docs\/test\//, ''))
              .includes(item.link.split('/').at(-1) || item.link)
          "
          text="已有测试"
          class="mr-2"
          density="compact"
          color="secondary"
        />
      </template>
      <template #[`item.type`]="{ item }">
        <v-chip
          v-if="Object.keys(imagelabels.types).includes(item.type)"
          :color="imagelabels.types[item.type].color"
          density="compact"
        >
          {{ imagelabels.types[item.type].title }}
        </v-chip>
        <v-chip v-else>{{ item.type }}</v-chip>
      </template>
      <template #[`item.size`]="{ item }">
        {{ (Number(item.size) / 1024 / 1024 / 1024).toFixed(2) }} GB
      </template>
      <template #[`item.link`]="{ item }">
        <v-btn
          color="primary"
          variant="text"
          :href="item.link"
          target="_blank"
          rel="noopener noreferrer"
          prepend-icon="mdi-download"
          text="下载"
        />
        <v-btn
          v-if="
            testdocs &&
            testdocs
              .map(({ path }) => path.replace(/^\/docs\/test\//, ''))
              .includes(item.link.split('/').at(-1) || item.link)
          "
          :to="`/docs/test/${item.link.split('/').at(-1)}`"
          color="secondary"
          variant="text"
          class="ml-2"
          prepend-icon="mdi-chart-box-outline"
        >
          测试报告
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import imagelabels_r from "~/assets/image-labels.json";
import devicelist_r from "~/assets/devicelist.json";
import type { DeviceListFull } from "~/types/devicelist";
import type { SortItem } from "vuetify/lib/components/VDataTable/composables/sort.mjs";
import type { ImageInfo, ImageLabelList } from "~/types/image";

const devicelist: DeviceListFull = devicelist_r;
const imagelabels: ImageLabelList = imagelabels_r;

const testdocs = (
  await useAsyncData(
    "docs-test",
    async () => await queryCollection("testdocs").all(),
  )
).data;

const installdocs = (
  await useAsyncData(
    "docs-install",
    async () => await queryCollection("installdocs").all(),
  )
).data;

const headers = [
  { title: "镜像版本", value: "type" },
  { title: "镜像大小", value: "size" },
  { title: "发布日期", value: "date" },
  { title: "链接", value: "link", sortable: false },
];

const groupby: SortItem[] = [
  {
    key: "device",
    order: "asc",
  },
];

const sortby: Ref<SortItem[]> = ref([{ key: "date", order: "desc" }]);

const show_deprecated = ref(false);
const show_customized = ref(false);

const props = defineProps<{
  loading: boolean;
  items: ImageInfo[];
  arch: string;
}>();
</script>
