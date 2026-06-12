<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { organizerApi } from "@/infrastructure/http/organizer.api";

defineOptions({ name: "OrganizerPublicProfile" });

const route = useRoute();
const id = Number(route.params.id);

const { data: profile, isLoading } = useQuery({
  queryKey: ["organizer", id],
  queryFn: () => organizerApi.getPublic(id),
});
</script>

<template>
  <main class="max-w-2xl mx-auto py-28 px-4">
    <div v-if="isLoading">در حال بارگذاری...</div>
    <template v-else-if="profile">
      <h1 class="text-3xl font-bold">{{ profile.name }}</h1>
      <p v-if="profile.city" class="text-gray-500 mt-1">{{ profile.city }}</p>
      <p v-if="profile.bio" class="mt-4 text-gray-700 leading-7">{{ profile.bio }}</p>
      <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div class="bg-white rounded-lg p-4 shadow">
          <div class="font-bold text-lg">{{ profile.eventsCount }}</div>
          <div class="text-gray-500">ایونت</div>
        </div>
        <div class="bg-white rounded-lg p-4 shadow">
          <div class="font-bold text-lg">{{ profile.totalParticipants }}</div>
          <div class="text-gray-500">جاهایی که با هم بودید</div>
        </div>
      </div>
      <div v-if="profile.instagram || profile.telegram" class="mt-6 space-y-1 text-sm">
        <div v-if="profile.instagram">📸 {{ profile.instagram }}</div>
        <div v-if="profile.telegram">💬 {{ profile.telegram }}</div>
      </div>
    </template>
  </main>
</template>
