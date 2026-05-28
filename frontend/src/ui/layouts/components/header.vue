<script setup lang="ts">
import { twMerge } from '@/utils/tailwind/tw';
import OButton from "@/components/base/button.vue";
import { useAuth } from "@/composables/auth/useAuth";

defineOptions({
  name: "Header",
});

const props = defineProps<{
  position: string;
}>();

const { isAuthenticated, user, hasOrganizerProfile, isAdmin, logout } = useAuth();

const styles = twMerge(
  'top-0 inset-x-0 py-16 z-10 bg-white shadow-md py-4',
  props.position === 'fixed' ? 'fixed' : 'sticky bg-theme-primary'
)
</script>

<template>
    <header :class="[styles]">
      <div class="mx-auto flex justify-between px-4">
        <div class="flex items-center justify-center px-4">
          <router-link to="/events" class="text-2xl font-bold text-indigo-600 ml-8">
            ایونتیو
          </router-link>
          <nav class="flex gap-4">
            <router-link
              to="/events"
              class="text-gray-700 hover:text-indigo-500 font-medium"
            >
              ایونت‌ها
            </router-link>
            <router-link
              v-if="hasOrganizerProfile"
              to="/events/create"
              class="text-gray-700 hover:text-indigo-500 font-medium"
            >
              اضافه کردن
            </router-link>
            <router-link
              v-if="hasOrganizerProfile"
              to="/organizers/me/edit"
              class="text-gray-700 hover:text-indigo-500 font-medium"
            >
              پروفایل
            </router-link>
            <router-link
              v-if="isAdmin"
              to="/admin"
              class="text-gray-700 hover:text-indigo-500 font-medium"
            >
              ادمین
            </router-link>
          </nav>
        </div>
        <div class="flex gap-4 items-center">
          <template v-if="isAuthenticated">
            <span class="text-sm text-gray-600 hidden sm:inline">{{ user?.email }}</span>
            <OButton variant="outline" @click="logout">خروج</OButton>
          </template>
          <template v-else>
            <router-link to="/auth/login">
              <OButton variant="outline">ورود</OButton>
            </router-link>
            <router-link to="/auth/register">
              <OButton>ثبت‌نام</OButton>
            </router-link>
          </template>
        </div>
      </div>
    </header>
</template>
