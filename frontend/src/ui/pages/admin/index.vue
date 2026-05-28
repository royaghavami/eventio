<script setup lang="ts">
import { ref } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import OButton from "@/components/base/button.vue";
import { adminApi } from "@/infrastructure/http/admin.api";
import type { EventStatus } from "@/entity/event/event";
import { getImageUrl } from "@/utils/helper";

defineOptions({ name: "AdminModerationPage" });

const queryClient = useQueryClient();
const filter = ref<"PENDING_REVIEW" | "PUBLISHED" | "REJECTED">(
  "PENDING_REVIEW",
);

const { data: events, isLoading } = useQuery({
  queryKey: computed(() => ["admin", "events", filter.value]),
  queryFn: () => adminApi.listEvents(filter.value),
});

const invalidate = () => {
  queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
  queryClient.invalidateQueries({ queryKey: ["event-listing"] });
};

const approveMutation = useMutation({
  mutationFn: (id: number) => adminApi.approveEvent(id),
  onSuccess: invalidate,
});

const rejectMutation = useMutation({
  mutationFn: (id: number) => adminApi.rejectEvent(id),
  onSuccess: invalidate,
});

const statusLabel: Record<EventStatus, string> = {
  DRAFT: "پیش‌نویس",
  PENDING_REVIEW: "در انتظار تأیید",
  PUBLISHED: "منتشر شده",
  REJECTED: "رد شده",
  CANCELLED: "لغو شده",
};
</script>

<route lang="yaml">
meta:
  requiresAdmin: true
</route>

<template>
  <main class="max-w-4xl mx-auto py-28 px-4">
    <h1 class="text-2xl font-bold mb-2">پنل ادمین</h1>
    <p class="text-gray-600 text-sm mb-6">
      تأیید یا رد ایونت‌ها قبل از نمایش عمومی (وقتی
      <code class="text-xs bg-gray-100 px-1 rounded">EVENT_REQUIRE_ADMIN_APPROVAL=true</code>
      باشد).
    </p>

    <div class="flex gap-2 mb-6 flex-wrap">
      <OButton
        :variant="filter === 'PENDING_REVIEW' ? 'fill' : 'outline'"
        @click="filter = 'PENDING_REVIEW'"
      >
        در انتظار
      </OButton>
      <OButton
        :variant="filter === 'PUBLISHED' ? 'fill' : 'outline'"
        @click="filter = 'PUBLISHED'"
      >
        منتشر شده
      </OButton>
      <OButton
        :variant="filter === 'REJECTED' ? 'fill' : 'outline'"
        @click="filter = 'REJECTED'"
      >
        رد شده
      </OButton>
    </div>

    <div v-if="isLoading">در حال بارگذاری...</div>
  <div v-else-if="!events?.length" class="text-gray-500">
      ایونتی در این دسته نیست.
    </div>

    <ul v-else class="space-y-4">
      <li
        v-for="event in events"
        :key="event.id"
        class="bg-white rounded-xl shadow p-4 flex gap-4"
      >
        <img
          v-if="event.images?.[0]"
          :src="getImageUrl(event.images[0].url)"
          class="w-24 h-24 object-cover rounded-lg shrink-0"
          alt=""
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h2 class="font-bold text-lg">{{ event.title }}</h2>
            <span class="text-xs text-gray-500 shrink-0">
              {{ statusLabel[event.status!] }}
            </span>
          </div>
          <p class="text-sm text-gray-600 line-clamp-2 mt-1">
            {{ event.description }}
          </p>
          <p class="text-xs text-gray-500 mt-2">
            {{ event.city }} ·
            {{ event.organizer?.name ?? "—" }} ·
            ظرفیت {{ event.capacity }}
          </p>
          <div class="flex gap-2 mt-3 flex-wrap">
            <router-link
              :to="`/events/${event.id}`"
              class="text-sm text-indigo-600 hover:underline"
            >
              مشاهده
            </router-link>
            <OButton
              v-if="event.status !== 'PUBLISHED'"
              class="!py-1 !px-3 text-sm"
              :disabled="approveMutation.isPending.value"
              @click="approveMutation.mutate(event.id)"
            >
              تأیید
            </OButton>
            <OButton
              v-if="event.status !== 'REJECTED'"
              variant="outline"
              class="!py-1 !px-3 text-sm"
              :disabled="rejectMutation.isPending.value"
              @click="rejectMutation.mutate(event.id)"
            >
              رد
            </OButton>
          </div>
        </div>
      </li>
    </ul>
  </main>
</template>
