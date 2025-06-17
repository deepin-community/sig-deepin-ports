<template>
    <v-container class="my-6">
        <v-alert
            title="RISC-V 架构目前仍在预览（Preview）阶段"
            text="请注意，RISC-V 架构的镜像仍在预览阶段，可能存在不稳定性和不完整性。"
            type="warning"
            variant="tonal"
            class="mb-4"
        />
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
                :key="show_deprecated + 2 * show_customized"
                :headers="headers"
                :items="items"
                :items-per-page="-1"
                :group-by="groupby"
                :sort-by="sortby"
                :loading="loading"
                hide-default-footer
            >
                <template
                    #group-header="{ item, columns, toggleGroup, isGroupOpen }"
                >
                    <tr
                        v-if="
                            (!devicelist[item.value]?.replacedby ||
                                show_deprecated) &&
                            (!devicelist[item.value]?.modified ||
                                show_customized)
                        "
                    >
                        <td
                            :colspan="columns.length"
                            @click="toggleGroup(item)"
                        >
                            <v-icon
                                :icon="isGroupOpen(item) ? '$expand' : '$next'"
                                size="small"
                                variant="text"
                            />
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
                                v-if="devicelist[item.value]?.replacedby"
                                size="small"
                                color="warning"
                                class="ml-2"
                            >
                                过时
                                <v-tooltip activator="parent" location="end"
                                    >被
                                    {{
                                        Object.keys(devicelist).includes(
                                            devicelist[item.value]?.replacedby,
                                        )
                                            ? devicelist[
                                                  devicelist[item.value]
                                                      ?.replacedby
                                              ].desc
                                            : devicelist[item.value]?.replacedby
                                    }}
                                    取代</v-tooltip
                                >
                            </v-chip>
                            <v-chip
                                v-if="
                                    installdocs
                                        .map(({ _path }) =>
                                            _path.replace(
                                                /^\/docs\/install\//,
                                                '',
                                            ),
                                        )
                                        .includes(item.value)
                                "
                                :to="`/docs/install/${item.value}`"
                                size="small"
                                color="success"
                                class="ml-2"
                                prepend-icon="mdi-file-document-outline"
                            >
                                查看文档
                            </v-chip>
                        </td>
                    </tr>
                </template>
                <template #item.data-table-group="{ item }">
                    <template v-for="tag in item.tags" :key="tag">
                        <v-chip
                            v-if="Object.keys(imagelabels.tags).includes(tag)"
                            density="compact"
                            :color="imagelabels.tags[tag].color"
                            >{{ imagelabels.tags[tag].title }}</v-chip
                        >
                        <v-chip v-else>{{ tag }}</v-chip>
                    </template>
                </template>
                <template #item.type="{ item }">
                    <v-chip
                        v-if="
                            Object.keys(imagelabels.types).includes(item.type)
                        "
                        :color="imagelabels.types[item.type].color"
                        density="compact"
                    >
                        {{ imagelabels.types[item.type].title }}
                    </v-chip>
                    <v-chip v-else>{{ item.type }}</v-chip>
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
                    />
                    <v-btn
                        v-if="
                            testdocs
                                .map(({ _path }) =>
                                    _path.replace(/^\/docs\/test\//, ''),
                                )
                                .includes(item.link.split('/').at(-1))
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
    </v-container>
</template>

<script setup lang="ts">
import imagelabels from "~/assets/image-labels.json";
import devicelist from "~/assets/devicelist.json";
import { ref } from "vue";

const testdocs = (
    await useAsyncData("docs-test", async () =>
        await queryContent("docs", "test").sort({ _id: -1 }).find(),
    )
).data;

const installdocs = (
    await useAsyncData("docs-install",async () =>
        await queryContent("docs", "install").sort({ _id: -1 }).find(),
    )
).data;

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
const latestitem = reactive({});

const loading = ref(true);

const show_deprecated = ref(false);
const show_customized = ref(false);

const dataurl =
    "https://deepin-community.github.io/sig-deepin-ports-images/images.json";

const fetchImages = async () => {
    const response = await fetch(dataurl);
    let data = await response.json();

    for (const i of data) {
        if (Object.keys(latestitem).includes(i.device)) {
            if (i.date > latestitem[i.device].date) latestitem[i.device] = i;
        } else latestitem[i.device] = i;
    }
    data = data.map((i) => {
        if (latestitem[i.device].date == i.date) i["tags"] = ["latest"];
        return i;
    });

    items.value = data;
    loading.value = false;
};

fetchImages();

useSeoMeta({
    title: "镜像列表",
    description: "",
});
definePageMeta({ title: "镜像列表" });
</script>
