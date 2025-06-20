<template>
    <v-container class="main-content">
        <title-card
            title="deepin-ports 设备支持矩阵"
            subtitle="所有已支持的设备列表"
            text="包含所有已支持的设备的详细信息的列表，方便查找。"
            icon="mdi-table"
        />

        <template v-for="core in matrix_items" :key="core.core">
            <v-card
                class="my-2"
                :title="core.core + ' 系列'"
                variant="outlined"
                color="secondary"
            >
                <v-card-text>
                    <v-row>
                        <template v-for="soc in core.socs" :key="soc.soc">
                            <v-col cols="12" md="6" lg="4">
                                <v-card
                                    class="my-0"
                                    variant="tonal"
                                    :color="soc.deprecated ? 'grey' : 'primary'"
                                >
                                    <v-card-title>
                                        <v-icon start icon="mdi-memory" />
                                        {{ soc.soc }}
                                        <v-chip
                                            v-if="soc.n_cores"
                                            :text="soc.n_cores + ' 核'"
                                            class="ml-2"
                                            size="small"
                                        />
                                        <v-chip
                                            v-if="soc.deprecated"
                                            text="已过时"
                                            size="small"
                                            class="ml-2"
                                        />
                                        <v-chip
                                            v-if="
                                                soc.kernels &&
                                                (soc.kernels.includes('hwe') ||
                                                    soc.kernels.includes(
                                                        'rolling',
                                                    ))
                                            "
                                            text="主线内核"
                                            size="small"
                                            color="secondary"
                                            class="ml-2"
                                        />
                                    </v-card-title>
                                    <v-card-text>
                                        <v-list class="mt-2" density="compact">
                                            <v-list-item
                                                v-if="soc.kernels"
                                                variant="flat"
                                                color="secondary"
                                                prepend-icon="mdi-penguin"
                                            >
                                                <v-list-item-title>
                                                    内核：
                                                    <v-chip
                                                        v-for="kernel in soc.kernels"
                                                        :key="kernel"
                                                        size="small"
                                                        class="ml-2"
                                                        :text="kernel"
                                                    />
                                                </v-list-item-title>
                                            </v-list-item>
                                            <v-list-item
                                                v-if="soc.boot"
                                                :title="
                                                    '支持启动方式: ' + soc.boot
                                                "
                                                variant="flat"
                                                color="secondary"
                                                prepend-icon="mdi-restart"
                                            />
                                            <v-list-item
                                                v-if="soc.gpu"
                                                :title="'内置 GPU: ' + soc.gpu"
                                                variant="flat"
                                                color="secondary"
                                                prepend-icon="mdi-expansion-card"
                                            />
                                            <v-list-item
                                                v-if="soc.extra"
                                                :title="
                                                    '附加仓库: ' + soc.extra
                                                "
                                                variant="flat"
                                                color="secondary"
                                                prepend-icon="mdi-archive-plus"
                                            />
                                            <v-divider class="my-1" />
                                            <v-list-group value="支持设备列表">
                                                <template
                                                    #activator="{ props }"
                                                >
                                                    <v-list-item v-bind="props">
                                                        <v-list-item-title>
                                                            支持设备列表
                                                            <v-chip
                                                                class="ml-2"
                                                                size="x-small"
                                                                :text="
                                                                    soc.devices.length.toString()
                                                                "
                                                            />
                                                        </v-list-item-title>
                                                    </v-list-item>
                                                </template>
                                                <v-list-item
                                                    v-for="device in soc.devices"
                                                    :key="device.device"
                                                    :value="device"
                                                    color="primary"
                                                    :active="false"
                                                >
                                                    <v-list-item-title>
                                                        {{ device.device }}
                                                        <v-chip
                                                            v-if="
                                                                device.standalone
                                                            "
                                                            class="ml-2"
                                                            size="small"
                                                            text="独立镜像"
                                                        />
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list-group>
                                        </v-list>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </template>
                    </v-row>
                </v-card-text>
            </v-card>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import matrix_items from "@/assets/matrix.json";

useSeoMeta({
    title: "设备支持矩阵",
    description: "",
});
definePageMeta({ title: "设备支持矩阵" });
</script>

<style scoped>
.main-content {
    max-width: 1400px;
}
</style>
