<script setup lang="ts">
import { ref } from 'vue'
import OImage from '@/components/base/image.vue'

defineOptions({ name: 'ImageGallery' });

interface Image {
  id: string | number
  url: string
}

defineProps<{
  images: Image[]
  onImageClick?: (url: string) => void
}>()
</script>

<template>
  <div class="relative">
    <div class="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
      <div
        v-for="image in images"
        :key="image.id"
        class="relative w-40 h-40 shrink-0 rounded-lg overflow-hidden cursor-pointer group"
        @click="onImageClick?.(image.url)"
      >
        <OImage
          :src="image.url"
          fallback-src="/images/placeholder.svg"
          class="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          مشاهده
        </div>
      </div>
    </div>
  </div>
</template>
