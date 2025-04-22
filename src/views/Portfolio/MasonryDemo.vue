<script setup lang="ts">
const items = [
  {
    title: "First",
    description: "The first item.",
  },
  {
    title: "Second",
    description: "The second item.",
  },
];
</script>

<template>
  <masonry-wall :items="items" :ssr-columns="1" :column-width="300" :gap="16">
    <template #default="{ item, index }">
      <div :style="{ height: `${(index + 1) * 100}px` }">
        <h1>{{ item.title }}</h1>
        <span>{{ item.description }}</span>
      </div>
    </template>
  </masonry-wall>
</template>
