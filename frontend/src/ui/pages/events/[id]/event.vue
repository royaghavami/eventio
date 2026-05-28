<script setup lang="ts">
import { getImageUrl, scrollToTop } from '@/utils/helper';
import OButton from '@/components/base/button.vue';
import OImage from '@/components/base/image.vue';
import type { Event } from '@/entity/event/event';
import ImagePreview from '@/ui/pages/events/[id]/components/image-preview.vue';
import ImageGallery from '@/ui/pages/events/[id]/components/gallery.vue'

defineOptions({ name: 'EventDetailTemplate' });

const props = defineProps<{ eventDetail: Event }>();
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

const eventDetail = {
  ...props.eventDetail,
  rules: ["بدون دخانیات", "حضور به‌موقع الزامی است"],
  tools: ["کاغذ", "مداد", "لپ‌تاپ"],
  prices: [
    { title: "بلیت عادی", description: "ورود + نوشیدنی", price: 120000 },
    { title: "VIP", description: "صندلی ردیف اول + پذیرایی", price: 250000 },
  ],
  contact: {
    phone: "09121232334",
    email: "test@gmail.com",
    telegram: "@eventio",
    instagram: "eventio.ir",
  },
  organizer: {
    name: "Eventio Group",
    bio: "برگزارکننده رویدادهای آموزشی و هنری",
  },
  lat: 35.72,
  lng: 51.42,
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
        <p v-if="eventDetail.categories?.length" class="text-sm opacity-80 mt-1">
          {{ eventDetail?.categories[0]?.name }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <section class="col-span-8">
        <!-- DESCRIPTION -->
        <h2 class="font-bold text-xl mb-2">توضیحات ایونت</h2>
        <p class="text-gray-700 leading-7">
          {{ eventDetail.description }}
        </p>

        <!-- RULES -->
        <section v-if="eventDetail.rules?.length" class="mt-10">
          <h2 class="font-bold text-xl mb-2">قوانین ایونت</h2>
          <ul class="list-disc pr-6 space-y-1 text-gray-700">
            <li v-for="(r, i) in eventDetail.rules" :key="i">{{ r }}</li>
          </ul>
        </section>

        <!-- NEW — TOOLS -->
        <section v-if="eventDetail.tools?.length" class="mt-10">
          <h2 class="font-bold text-xl mb-2">اقلام / ابزار مورد نیاز</h2>
          <ul class="list-disc pr-6 space-y-1 text-gray-700">
            <li v-for="(t, i) in eventDetail.tools" :key="i">{{ t }}</li>
          </ul>
        </section>
        <section class="mt-10" v-if="eventDetail.images?.length">
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
        <!-- NEW — PRICES -->
        <section v-if="eventDetail.prices?.length" class="mt-10">
          <h2 class="font-bold text-xl mb-4">بسته‌های شرکت در ایونت</h2>
          <div class="flex">
            <div
              v-for="(p, i) in eventDetail.prices"
              :key="i"
              class="border text-base items-center rounded-xl p-4 ml-2 flex gap-1"
            >
              <div class="font-bold text-lg">{{ p.title }}</div>
              <div v-if="p.description" class="text-gray-600 text-sm">
                {{ p.description }}
              </div>
              <div class="text-indigo-700 font-bold mt-1">
                {{ p.price.toLocaleString() }} تومان
              </div>
            </div>
          </div>
        </section>

        <!-- NEW — ORGANIZER INFO -->
        <section v-if="eventDetail.organizer" class="mt-10">
          <h2 class="font-bold text-xl mb-2">برگزارکننده</h2>
          <div class="text-gray-700 leading-7">
            <p class="font-bold">{{ eventDetail.organizer.name }}</p>
            <p v-if="eventDetail.organizer.bio" class="text-sm mt-1">
              {{ eventDetail.organizer.bio }}
            </p>
          </div>
        </section>

        <!-- NEW — CONTACT -->
        <section v-if="eventDetail.contact" class="mt-10">
          <h2 class="font-bold text-xl mb-2">اطلاعات تماس</h2>
          <div class="space-y-1 text-gray-700 text-sm">
            <div v-if="eventDetail.contact.phone">📞 {{ eventDetail.contact.phone }}</div>
            <div v-if="eventDetail.contact.email">📧 {{ eventDetail.contact.email }}</div>
            <div v-if="eventDetail.contact.telegram">💬 {{ eventDetail.contact.telegram }}</div>
            <div v-if="eventDetail.contact.instagram">📸 {{ eventDetail.contact.instagram }}</div>
          </div>
        </section>

        <!-- NEW — MAP -->
        <section v-if="eventDetail.lat && eventDetail.lng" class="mt-10">
          <h2 class="font-bold text-xl mb-3">موقعیت مکانی</h2>
          <div class="rounded-xl overflow-hidden h-64">
            <iframe
              class="w-full h-full"
              :src="`https://maps.google.com/maps?q=${eventDetail.lat},${eventDetail.lng}&z=15&output=embed`"
            />
          </div>
        </section>
      </section>

      <!-- RIGHT SIDEBAR (unchanged) -->
      <section class="col-span-4 bg-white rounded-xl p-8 shadow flex flex-col gap-2 sticky top-4 h-fit">
        <div>📅 تاریخ شروع: {{ new Date(eventDetail.startDate).toLocaleDateString('fa-IR') }}</div>
        <div>📅 تاریخ پایان: {{ new Date(eventDetail.endDate).toLocaleDateString('fa-IR') }}</div>

        <div v-if="eventDetail.address">📍 {{ eventDetail.address }}</div>
        <div v-if="eventDetail.capacity">👥 ظرفیت: {{ eventDetail.capacity }}</div>

        <div v-if="eventDetail.sessions?.length" class="mt-2">
          <h3 class="font-bold mb-1">سشن‌ها</h3>
          <ul class="text-sm space-y-1">
            <li v-for="(s, i) in eventDetail.sessions" :key="i">
              {{ new Date(s.date).toLocaleDateString('fa-IR') }} – {{ s.startTime }} تا {{ s.endTime }}
            </li>
          </ul>
        </div>

        <OButton class="mt-4 w-full">شرکت در ایونت</OButton>
      </section>
    </div>

    <OButton class="w-full" @click="$emit('delete')"> حذف ایونت </OButton>
  </div>
</template>

