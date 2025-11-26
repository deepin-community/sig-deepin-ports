<template>
  <v-dialog v-model="dialog" max-width="600" scrollable>
    <template #activator="{ props }">
      <v-btn v-bind="props" icon variant="text" color="on-surface">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>
    <v-card rounded="lg">
      <v-card-title class="pa-0">
        <v-text-field
          v-model="searchQuery"
          placeholder="搜索文档、博客..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          variant="solo"
          flat
          autofocus
          clearable
          @update:model-value="performSearch"
        />
      </v-card-title>
      <v-divider/>
      <v-card-text class="pa-0" style="height: 400px">
        <v-list v-if="results.length > 0" lines="two">
          <v-list-item
            v-for="(item, i) in results"
            :key="i"
            :to="item.path"
            rounded="lg"
            class="ma-2"
            @click="dialog = false"
          >
            <template #prepend>
              <v-icon :icon="getIcon(item.collection)" color="primary"/>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.description || item.path }}</v-list-item-subtitle>
            <template #append>
               <v-chip class="ml-1" size="x-small" label>{{ getLabel(item.collection) }}</v-chip>
            </template>
          </v-list-item>
        </v-list>
        <div v-else-if="searchQuery" class="d-flex justify-center align-center h-100 text-grey">
          未找到相关内容
        </div>
        <div v-else class="d-flex justify-center align-center h-100 text-grey">
          输入关键词开始搜索
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const dialog = ref(false);
const searchQuery = ref('');
const results = ref<any[]>([]);

const collections = ['blogs', 'installdocs', 'testdocs'];

const performSearch = async (val: string) => {
  if (!val || val.length < 2) {
    results.value = [];
    return;
  }

  const promises = collections.map(col =>
    queryCollection(col)
      .where('title', 'LIKE', `%${val}%`)
      .select('title', 'path', 'description')
      .limit(5)
      .all()
      .then(items => items.map(i => ({ ...i, collection: col })))
  );

  const rawResults = await Promise.all(promises);
  results.value = rawResults.flat();
};

const getIcon = (col: string) => {
  if (col === 'blogs') return 'mdi-newspaper';
  if (col.includes('test')) return 'mdi-chart-box-outline';
  return 'mdi-file-document-outline';
};

const getLabel = (col: string) => {
    const map: Record<string, string> = {
        'blogs': '博客',
        'installdocs': '安装文档',
        'testdocs': '测试报告'
    }
    return map[col] || col;
}
</script>
