<script setup lang="ts">
import { getImageUrl } from "@/utils/helper";
import OCard from "@/components/base/card.vue";
import { useRouter } from "vue-router";
import type { Event } from "@/entity/event/event";

defineOptions({ name: "EventsTemplate" });

defineProps<{
  events: Event[];
}>();

const router = useRouter();

const onCardClick = (eventId: string) => {
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
    <section class="inset-0 flex flex-col items-center justify-center mt-16">
      <!-- //TODO: should fix the child: problem -->
      <h2 class="text-3xl mb-12">دسته‌بندی ها</h2>
      <div class="flex gap-4 justify-between">
        <div class="text-indigo-600 px-4 py-2 rounded border border-indigo-600">
          هنر و خلاقیت
        </div>
        <div class="text-indigo-600 px-4 py-2 rounded border border-indigo-600">
          غذا و آشپزی
        </div>
        <div class="text-indigo-600 px-4 py-2 rounded border border-indigo-600">
          سلامت و فعالیت
        </div>
        <div class="text-indigo-600 px-4 py-2 rounded border border-indigo-600">
          فرهنگ و گالری‌ها
        </div>
        <div class="text-indigo-600 px-4 py-2 rounded border border-indigo-600">
          جشن‌ها و مناسبت‌ها
        </div>
        <div class="text-indigo-600 px-4 py-2 rounded border border-indigo-600">
          جشن‌ها و مناسبت‌ها
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