<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import OButton from "@/components/base/button.vue";
import OInput from "@/components/base/input.vue";
import { organizerApi } from "@/infrastructure/http/organizer.api";
import { useRequireOrganizer } from "@/composables/auth/useRequireOrganizer";
import { useAuth } from "@/composables/auth/useAuth";

defineOptions({ name: "OrganizerEditPage" });

useRequireOrganizer();

const { hasOrganizerProfile } = useAuth();

const { data: profile, isLoading } = useQuery({
  queryKey: ["organizer", "me"],
  queryFn: () => organizerApi.getMine(),
  enabled: hasOrganizerProfile,
});

const name = ref("");
const bio = ref("");
const city = ref("");
const instagram = ref("");
const telegram = ref("");
const website = ref("");
const saved = ref(false);

watchEffect(() => {
  if (!profile.value) return;
  name.value = profile.value.name;
  bio.value = profile.value.bio ?? "";
  city.value = profile.value.city ?? "";
  instagram.value = profile.value.instagram ?? "";
  telegram.value = profile.value.telegram ?? "";
  website.value = profile.value.website ?? "";
});

const { mutate, isPending } = useMutation({
  mutationFn: () =>
    organizerApi.updateMine({
      name: name.value,
      bio: bio.value,
      city: city.value,
      instagram: instagram.value,
      telegram: telegram.value,
      website: website.value,
    }),
  onSuccess: () => {
    saved.value = true;
    setTimeout(() => (saved.value = false), 2000);
  },
});
</script>

<route lang="yaml">
meta:
  requiresOrganizer: true
</route>

<template>
  <main class="max-w-xl mx-auto py-28 px-4 space-y-4">
    <h1 class="text-2xl font-bold">ویرایش پروفایل برگزارکننده</h1>

    <div v-if="isLoading">در حال بارگذاری...</div>

    <template v-else>
      <OInput id="name" v-model="name" label="نام" />
      <OInput id="city" v-model="city" label="شهر" />
      <div class="flex flex-col gap-1">
        <label for="bio" class="text-sm font-medium text-gray-700">بیو</label>
        <textarea
          id="bio"
          v-model="bio"
          rows="4"
          class="border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <OInput id="instagram" v-model="instagram" label="اینستاگرام" />
      <OInput id="telegram" v-model="telegram" label="تلگرام" />
      <OInput id="website" v-model="website" label="وب‌سایت" />

      <OButton :disabled="isPending" @click="mutate()">ذخیره</OButton>
      <p v-if="saved" class="text-green-600 text-sm">ذخیره شد</p>
    </template>
  </main>
</template>
