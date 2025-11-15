<script setup lang="ts">
import { getImageUrl, scrollToTop } from '@/utils/helper';
import OButton from '@/components/base/button.vue';
import OImage from '@/components/base/image.vue';
import type { Event } from '@/entity/event/event';
import ImagePreview from '@/ui/pages/events/[id]/components/image-preview.vue';
import ImageGallery from '@/ui/pages/events/[id]/components/gallery.vue'

defineOptions({ name: 'EventDetailTemplate' });

defineProps<{ eventDetail: Event }>();
scrollToTop()

const showPreview = ref<boolean>(false)
const previewImage = ref<string>('')

const openPreview = (url: string) => {
  previewImage.value = url
  showPreview.value = true
}

const closePreview = () => {
  showPreview.value = false
  previewImage.value = ''
}
</script>

<template>
  <div class="space-y-8 pb-24">
    <div class="relative h-80 w-full rounded-xl overflow-hidden">
      <OImage
        :src="getImageUrl(eventDetail.images?.[0]?.url || '')"
        fallback-src="/images/placeholder.svg"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
      <div class="absolute bottom-4 right-4 text-white">
        <h1 class="text-3xl font-bold">{{ eventDetail.title }}</h1>
        <!-- TODO: Category name -->
        <p v-if="eventDetail.categories?.length" class="text-sm opacity-80 mt-1">
          {{ eventDetail?.categories[0]?.name }}
        </p>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-8">
      <section class="col-span-8">
        <h2 class="font-bold text-xl mb-2">توضیحات ایونت</h2>
        <p class="text-gray-700 leading-7">
          {{ eventDetail.description }}
        </p>
      </section>
      <section  class="col-span-4 bg-white rounded-xl p-8 shadow flex flex-col gap-2 sticky top-4 h-fit">
        <!-- TODO: fix Date converter-->
        <div>📅 تاریخ شروع: {{ new Date(eventDetail.startDate).toLocaleDateString('fa-IR') }}</div>
        <div>📅 تاریخ پایان: {{ new Date(eventDetail.endDate).toLocaleDateString('fa-IR') }}</div>

        <div v-if="eventDetail.address">📍 {{ eventDetail.address }}</div>
        <div v-if="eventDetail.capacity">👥 ظرفیت: {{ eventDetail.capacity }}</div>

        <div v-if="eventDetail.sessions?.length" class="mt-2">
          <h3 class="font-bold mb-1">سشن‌ها</h3>
          <ul class="text-sm space-y-1">
            <li v-for="(s, i) in eventDetail.sessions" :key="i">
              {{ new Date(s.date).toLocaleDateString('fa-IR') }} – {{ s.startTime }} تا
              {{ s.endTime }}
            </li>
          </ul>
        </div>
        <OButton class="mt-4 w-full">  شرکت در ایونت </OButton>
      </section>
    </div>
    <section v-if="eventDetail.images?.length">
      <h2 class="font-bold text-xl mb-4">گالری تصاویر</h2>
      <ImageGallery
        :images="eventDetail.images.map(i => ({ id: i.id, url: getImageUrl(i.url) }))"
        :onImageClick="openPreview"
      />
    </section>
    <ImagePreview 
      v-if="previewImage"
      v-model:show="showPreview"
      :image="previewImage"
      @close="closePreview"
    />
    <OButton class="w-full" @click="$emit('delete')"> حذف ایونت </OButton>
  </div>
</template>
