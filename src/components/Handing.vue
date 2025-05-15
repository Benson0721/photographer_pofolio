<script setup lang="ts">
import { Typed } from "@duskmoon/vue3-typed-js";
import type { TypedOptions } from "@duskmoon/vue3-typed-js";

import { defineProps, defineModel, ref, watch, computed } from "vue";

const props = defineProps({
  title: String,
  content: String,
  HeadingStyle: String,
  ContentStyle: String,
});

const category = defineModel<string>("category");
const topic = defineModel<string>("topic");
const notes = defineModel<string>("notes");

const title = ref(props.title);
const content = ref(props.content);

watch(category, (newVal) => {
  if (newVal === "All") {
    category.value = "Portfolio";
  }
});

const TitleOptions = computed<TypedOptions>(() => ({
  strings: [title.value || topic.value || category.value || ""],
  loop: false,
  typeSpeed: 80,
  backSpeed: 25,
  backDelay: 1000,
  startDelay: 500,
  showCursor: false,
}));

const ContentOptions = computed<TypedOptions>(() => ({
  strings: [content.value || notes.value || ""],
  loop: false,
  typeSpeed: 100,
  backSpeed: 25,
  backDelay: 1000,
  startDelay: 1500,
  showCursor: false,
}));
</script>
<template>
  <div
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
  >
    <Typed :options="TitleOptions" :key="category || topic">
      <h1 class="typing" :class="props.HeadingStyle || ''"></h1>
    </Typed>
    <Typed :options="ContentOptions" :key="notes || content">
      <p class="typing" :class="props.ContentStyle || ''"></p>
    </Typed>
  </div>
</template>
<style scoped></style>
