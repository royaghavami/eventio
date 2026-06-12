<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
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

const route = useRoute();
const router = useRouter();

const selectedCategoryId = computed<number | null>(() => {
  const raw = route.query.categoryId;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
});

const { data: eventListings, isLoading: eventsLoading } = useQuery({
  queryKey: computed(() => ["event-listing", selectedCategoryId.value]),
  queryFn: () =>
    eventApi.getAll(
      selectedCategoryId.value
        ? { categoryId: selectedCategoryId.value }
        : undefined,
    ),
});

const { data: categories } = useQuery({
  queryKey: ["categories"],
  queryFn: () =>
    httpClient.get<Category[]>("/categories").then((r) => r.data),
});

const onSelectCategory = (categoryId: number | null) => {
  router.replace({
    path: route.path,
    query: categoryId ? { categoryId: String(categoryId) } : {},
  });
};
</script>

<template>
  <div>
    <div
      v-if="eventsLoading"
      class="flex items-center justify-center min-h-[50vh] text-[var(--color-muted)]"
    >
      <span class="animate-pulse">پیش پیش…</span>
    </div>
    <EventsTemplate
      v-else-if="eventListings"
      :events="eventListings"
      :categories="categories"
      :selected-category-id="selectedCategoryId"
      @select-category="onSelectCategory"
    />
  </div>
</template>
