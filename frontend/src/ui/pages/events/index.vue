<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { eventApi } from "@/infrastructure/http/event.api";
import { httpClient } from "@/infrastructure/http/httpClient";
import EventsTemplate from '@/ui/pages/events/events.vue';

defineOptions({ name: "Events" });

interface Category {
  id: number;
  slug: string;
  name: string;
}

const { data: eventListings, isLoading: eventsLoading } = useQuery({
  queryKey: ["event-listing"],
  queryFn: () => eventApi.getAll(),
});

const { data: categories } = useQuery({
  queryKey: ["categories"],
  queryFn: () =>
    httpClient.get<Category[]>("/categories").then((r) => r.data),
});
</script>

<template>
  <div>
    <div
      v-if="eventsLoading"
      class="flex items-center justify-center min-h-[50vh] text-[var(--color-muted)]"
    >
      <span class="animate-pulse">در حال بارگذاری ماجراجویی‌ها...</span>
    </div>
    <EventsTemplate
      v-else-if="eventListings"
      :events="eventListings"
      :categories="categories"
    />
  </div>
</template>
