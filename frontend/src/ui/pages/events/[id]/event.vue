<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getImageUrl, scrollToTop } from '@/utils/helper';
import OButton from '@/components/base/button.vue';
import OImage from '@/components/base/image.vue';
import type { Event } from '@/entity/event/event';
import ImagePreview from '@/ui/pages/events/[id]/components/image-preview.vue';
import ImageGallery from '@/ui/pages/events/[id]/components/gallery.vue';
import { useAuth } from '@/composables/auth/useAuth';
import { useReserveSpot } from '@/composables/reservations/useReserveSpot';

defineOptions({ name: 'EventDetailTemplate' });

const props = defineProps<{ eventDetail: Event }>();
defineEmits<{ delete: [] }>();

const route = useRoute();
const router = useRouter();
const { isAuthenticated } = useAuth();

scrollToTop();

const showPreview = ref<boolean>(false);
const previewImage = ref<string>('');

const eventId = computed(() => props.eventDetail.id);

const {
  stats,
  myReservation,
  canReserve,
  reserveLabel,
  reserve,
  cancel,
  isReserving,
  isCancelling,
} = useReserveSpot(eventId);

const displayStats = computed(
  () => stats.value ?? props.eventDetail.stats ?? null,
);

const openPreview = (url: string) => {
  previewImage.value = url;
  showPreview.value = true;
};

const closePreview = () => {
  showPreview.value = false;
  previewImage.value = '';
};

const onReserve = async () => {
  if (!isAuthenticated.value) {
    router.push({
      path: '/auth/login',
      query: { redirect: route.fullPath },
    });
    return;
  }
  await reserve();
};

const onCancel = async () => {
  if (myReservation.value?.id && myReservation.value.id > 0) {
    await cancel(myReservation.value.id);
  }
};

const categoryName = computed(
  () =>
    props.eventDetail.category?.name ??
    props.eventDetail.categories?.[0]?.name,
);
</script>

<template>
  <div class="space-y-8 pb-32 md:pb-24">
    <div class="relative h-80 w-full rounded-xl overflow-hidden">
      <OImage
        :src="getImageUrl(eventDetail.images?.[0]?.url || '')"
        fallback-src="/images/placeholder.svg"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
      <div class="absolute bottom-4 right-4 text-white">
        <h1 class="text-3xl font-bold">{{ eventDetail.title }}</h1>
        <p v-if="categoryName" class="text-sm opacity-80 mt-1">
          {{ categoryName }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section class="lg:col-span-8">
        <h2 class="font-bold text-xl mb-2">توضیحات ایونت</h2>
        <p class="text-gray-700 leading-7">
          {{ eventDetail.description }}
        </p>

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

        <section v-if="eventDetail.organizer" class="mt-10">
          <h2 class="font-bold text-xl mb-2">برگزارکننده</h2>
          <div class="text-gray-700 leading-7">
            <router-link
              v-if="eventDetail.organizerId"
              :to="`/organizers/${eventDetail.organizerId}`"
              class="font-bold text-indigo-600 hover:underline"
            >
              {{ eventDetail.organizer.name }}
            </router-link>
            <p v-else class="font-bold">{{ eventDetail.organizer.name }}</p>
            <p v-if="eventDetail.organizer.bio" class="text-sm mt-1">
              {{ eventDetail.organizer.bio }}
            </p>
            <p v-if="eventDetail.organizer.city" class="text-sm text-gray-500 mt-1">
              {{ eventDetail.organizer.city }}
            </p>
          </div>
        </section>

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

      <section
        class="lg:col-span-4 bg-white rounded-xl p-8 shadow flex flex-col gap-2 lg:sticky lg:top-24 h-fit"
      >
        <div>📅 شروع: {{ new Date(eventDetail.startDate).toLocaleDateString('fa-IR') }}</div>
        <div>📅 پایان: {{ new Date(eventDetail.endDate).toLocaleDateString('fa-IR') }}</div>
        <div v-if="eventDetail.city">🏙 {{ eventDetail.city }}</div>
        <div v-if="eventDetail.address">📍 {{ eventDetail.address }}</div>
        <div v-if="eventDetail.capacity">
          👥 ظرفیت: {{ eventDetail.capacity }}
        </div>
        <div v-if="displayStats" class="text-sm text-gray-600 space-y-1">
          <div>{{ displayStats.approvedCount }} نفر ثبت‌نام کرده</div>
          <div v-if="displayStats.remainingSpots > 0">
            {{ displayStats.remainingSpots }} جا باقی مانده
          </div>
          <div v-else class="text-amber-600">ظرفیت تکمیل — لیست انتظار فعال</div>
        </div>

        <OButton
          v-if="canReserve"
          class="mt-4 w-full"
          :disabled="isReserving"
          @click="onReserve"
        >
          {{ reserveLabel }}
        </OButton>
        <OButton
          v-else-if="myReservation && myReservation.status !== 'CANCELLED'"
          variant="outline"
          class="mt-4 w-full"
          :disabled="isCancelling"
          @click="onCancel"
        >
          لغو رزرو
        </OButton>
      </section>
    </div>

    <!-- Mobile sticky CTA -->
    <div
      class="fixed bottom-0 inset-x-0 p-4 bg-white border-t shadow-lg lg:hidden z-20 flex gap-2 items-center"
    >
      <div class="flex-1 text-sm">
        <span v-if="displayStats?.remainingSpots">
          {{ displayStats.remainingSpots }} جا مانده
        </span>
        <span v-else class="text-amber-600">لیست انتظار</span>
      </div>
      <OButton
        v-if="canReserve"
        :disabled="isReserving"
        @click="onReserve"
      >
        {{ reserveLabel }}
      </OButton>
      <OButton
        v-else
        variant="outline"
        :disabled="isCancelling"
        @click="onCancel"
      >
        لغو
      </OButton>
    </div>
  </div>
</template>
