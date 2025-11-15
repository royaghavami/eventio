<script setup lang="ts">
import OImage from "@/components/base/image.vue";

const props = defineProps<{
  title: string;
  capacity?: string;
  description?: string;
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
      'border rounded-lg p-4 shadow hover:shadow-lg hover:border-indigo-700 hover:text-indigo-700 transition cursor-pointer group',
      !clickable && 'cursor-default hover:shadow-none',
    ]"
  >
    <div class="relative w-full h-50 mb-4 rounded overflow-hidden" v-if="imageSrc">
      <OImage
        :src="imageSrc"
        :alt="imageAlt || title"
        :fallback-src="imageFallback || '/images/placeholder.svg'"
        class="w-full h-full object-cover block"
      />
      <div
        class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
      ></div>
    </div>
    <div class="flex justify-between">
      <h2 class="font-semibold text-lg">{{ title }}</h2>
      <p v-if="capacity" class="text-gray-500 text-sm">ظرفیت {{ capacity }}</p>
    </div>
    <div v-if="description" class="mt-2 text-right text-sm line-clamp-3">{{ description }}</div>
  </div>
</template>
