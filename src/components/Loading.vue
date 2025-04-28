<script setup lang="ts">
const { isLoading, loadingmessage } = defineProps<{
  isLoading: boolean;
  loadingmessage: string;
}>();
</script>
<template>
  <div v-if="isLoading" class="flex items-center absolute top-1/10 right-1/8">
    <div
      class="spinner border-4 border-gray-200 border-t-blue-500 rounded-full w-5 h-5 animate-spin"
    ></div>
    <span class="ml-2 text-gray-500 text-sm">{{ loadingmessage }}</span>
  </div>
</template>
