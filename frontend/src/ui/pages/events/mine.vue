<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { useRouter } from "vue-router";
import OButton from "@/components/base/button.vue";
import OCard from "@/components/base/card.vue";
import { eventApi } from "@/infrastructure/http/event.api";
import { useRequireOrganizer } from "@/composables/auth/useRequireOrganizer";
import { getImageUrl } from "@/utils/helper";
import type { EventStatus } from "@/entity/event/event";

defineOptions({ name: "MyEventsPage" });

useRequireOrganizer();

const router = useRouter();

const { data: events, isLoading } = useQuery({
  queryKey: ["events", "mine"],
  queryFn: () => eventApi.getMine(),
});

const statusLabel: Partial<Record<EventStatus, string>> = {
  DRAFT: "پیش‌نویس",
  PENDING_REVIEW: "در انتظار تأیید",
  PUBLISHED: "منتشر شده",
  REJECTED: "رد شده",
  CANCELLED: "لغو شده",
};

const statusClass: Partial<Record<EventStatus, string>> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING_REVIEW: "bg-amber-100 text-amber-800",
  PUBLISHED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

const sortedEvents = computed(() => {
  if (!events.value?.length) return [];
  return [...events.value].sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
});

const onCardClick = (eventId: number) => {
  router.push(`/events/${eventId}`);
};
</script>

<route lang="yaml">
meta:
  requiresOrganizer: true
</route>

<template>
  <main class="max-w-6xl mx-auto px-4 md:px-6 py-28 pb-16">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
    >
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-[var(--color-ink)]">
          ایونت‌های من
        </h1>
        <p class="text-sm text-[var(--color-muted)] mt-1">
          همه ایونت‌هایی که گذاشتی — منتشر شده، در انتظار، یا پیش‌نویس
        </p>
      </div>
      <router-link to="/events/create">
        <OButton variant="gradient">ایونت جدید بذار</OButton>
      </router-link>
    </div>

    <div
      v-if="isLoading"
      class="flex items-center justify-center min-h-[40vh] text-[var(--color-muted)]"
    >
      <span class="animate-pulse">پیش پیش…</span>
    </div>

    <div
      v-else-if="!sortedEvents.length"
      class="glass rounded-3xl p-12 text-center border border-dashed border-violet-200"
    >
      <span class="text-5xl">✨</span>
      <p class="mt-4 text-[var(--color-muted)]">
        هنوز ایونتی نذاشتی — اولین پیش پیش رو بساز
      </p>
      <router-link to="/events/create" class="inline-block mt-6">
        <OButton variant="gradient">ایونت بذار</OButton>
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="e in sortedEvents" :key="e.id" class="relative">
        <span
          v-if="e.status"
          :class="[
            'absolute top-3 right-3 z-10 text-xs font-semibold px-2.5 py-1 rounded-full',
            statusClass[e.status] ?? 'bg-white/90 text-violet-800',
          ]"
        >
          {{ statusLabel[e.status] ?? e.status }}
        </span>
        <OCard
          :title="e.title"
          :city="e.city"
          :capacity="e.capacity"
          :remaining="e.stats?.remainingSpots"
          :description="e.description"
          :image-src="getImageUrl(e.images?.[0]?.url || '')"
          :image-alt="e.title"
          :clickable="true"
          @click="() => onCardClick(e.id)"
        />
      </div>
    </div>
  </main>
</template>
