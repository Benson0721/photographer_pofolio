<script setup lang="ts">
import { Typed } from "@duskmoon/vue3-typed-js";
import type { TypedOptions } from "@duskmoon/vue3-typed-js";

import { defineProps, ref } from "vue";

const props = defineProps({
  title: String,
  content: String,
  HeadingStyle: String,
  ContentStyle: String,
});

const title = ref(props.title);
const content = ref(props.content);

const TitleOptions: TypedOptions = {
  strings: [title.value || ""],
  loop: false,
  typeSpeed: 80,
  backSpeed: 25,
  backDelay: 1000,
  startDelay: 500,
  showCursor: false,
};

const ContentOptions: TypedOptions = {
  strings: [content.value || ""],
  loop: false,
  typeSpeed: 100,
  backSpeed: 25,
  backDelay: 1000,
  startDelay: 1500,
  showCursor: false,
};
</script>
<template>
  <Typed :options="TitleOptions">
    <h1 class="typing" :class="props.HeadingStyle || ''"></h1>
  </Typed>
  <Typed :options="ContentOptions">
    <p class="typing" :class="props.ContentStyle || ''"></p>
  </Typed>
</template>
<style scoped></style>
