<script setup lang="ts">
import { getImageUrl } from '@/utils/helper';
import OCard from '@/components/base/card.vue';
import { useRouter } from 'vue-router';
import type { Event } from '@/entity/event/event';

defineOptions({ name: 'EventsTemplate' });

defineProps<{
  events: Event[];
}>();

const router = useRouter();

const onCardClick = (eventId: number) => {
  router.push(`/events/${eventId}`);
};
</script>

<template>
  <section class="relative md:pb-[48%] inset-x-0">
    <picture class="block absolute inset-0 size-full">
      <img
        alt="ایونتیو"
        src="/images/hero-landing.jpeg"
        class="block size-full object-cover"
        fetchpriority="high"
      />
    </picture>
    <div class="absolute inset-0 bg-gray-600/60"></div>
    <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
      <h1 class="text-5xl mb-2">هر لحظه، یه ماجراجویی جدید</h1>
      <p>به ایونتیو خوش آمدید!</p>
    </div>
  </section>
  <section class="mt-24 flex flex-col items-center">
    <h2 class="text-3xl mb-12 font-semibold">دسته‌بندی‌ها</h2>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-5xl">
      <div
        class="group cursor-pointer px-5 py-3 text-center rounded-2xl border border-indigo-600 text-indigo-600 transition-all duration-200 hover:bg-indigo-600 hover:text-white hover:scale-105 hover:shadow-md"
      >
        هنر و خلاقیت
      </div>

      <div
        class="group cursor-pointer px-5 py-3 text-center rounded-2xl border border-indigo-600 text-indigo-600 transition-all duration-200 hover:bg-indigo-600 hover:text-white hover:scale-105 hover:shadow-md"
      >
        غذا و آشپزی
      </div>

      <div
        class="group cursor-pointer px-5 py-3 text-center rounded-2xl border border-indigo-600 text-indigo-600 transition-all duration-200 hover:bg-indigo-600 hover:text-white hover:scale-105 hover:shadow-md"
      >
        سلامت و فعالیت
      </div>

      <div
        class="group cursor-pointer px-5 py-3 text-center rounded-2xl border border-indigo-600 text-indigo-600 transition-all duration-200 hover:bg-indigo-600 hover:text-white hover:scale-105 hover:shadow-md"
      >
        فرهنگ و گالری‌ها
      </div>

      <div
        class="group cursor-pointer px-5 py-3 text-center rounded-2xl border border-indigo-600 text-indigo-600 transition-all duration-200 hover:bg-indigo-600 hover:text-white hover:scale-105 hover:shadow-md"
      >
        جشن‌ها و مناسبت‌ها
      </div>

      <div
        class="group cursor-pointer px-5 py-3 text-center rounded-2xl border border-indigo-600 text-indigo-600 transition-all duration-200 hover:bg-indigo-600 hover:text-white hover:scale-105 hover:shadow-md"
      >
        طبیعت و سفر
      </div>
    </div>
  </section>

  <section class="inset-0 flex flex-col items-center justify-center my-24">
    <h2 class="text-3xl mb-12">ایونت‌های پرطرفدار</h2>
    <div class="mx-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <OCard
        v-for="e in events"
        :key="e.id"
        :title="e.title"
        :capacity="e.capacity?.toString()"
        :description="e.description"
        :image-src="getImageUrl(e.images?.[0]?.url || '')"
        :image-alt="e.title"
        :clickable="true"
        @click="() => onCardClick(e.id)"
      />
    </div>
  </section>
</template>
