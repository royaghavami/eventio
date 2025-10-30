<script setup lang="ts">
import OImage from "@/components/base/image.vue";

const props = defineProps<{
  title: string;
  subtitle?: string;
  extra?: string;
  clickable?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  imageFallback?: string;
}>();

const emit = defineEmits<{
  (event: "click"): void;
}>();

const handleClick = () => {
  if (props.clickable) emit("click");
};
</script>

<template>
  <div
    @click="handleClick"
    :class="[
      'border rounded-lg p-4 shadow hover:shadow-lg hover:border-blue-500 hover:text-blue-500 transition cursor-pointer',
      !clickable && 'cursor-default hover:shadow-none',
    ]"
  >
    <OImage
      v-if="imageSrc"
      :src="imageSrc"
      :alt="imageAlt || title"
      :fallback-src="imageFallback || '/images/placeholder.svg'"
      class="w-full h-40 object-cover rounded mb-4"
    />

    <h2 class="font-semibold text-lg">{{ title }}</h2>
    <p v-if="subtitle" class="text-gray-500">{{ subtitle }}</p>
    <div v-if="extra" class="mt-2 text-right text-sm">{{ extra }}</div>
  </div>
</template>
