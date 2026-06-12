<script setup lang="ts">
import { twMerge } from '@/utils/tailwind/tw';
import OButton from "@/components/base/button.vue";
import { useAuth } from "@/composables/auth/useAuth";
import { useBecomeOrganizer } from "@/composables/organizer/useBecomeOrganizer";

defineOptions({
  name: "Header",
});

const props = defineProps<{
  position: string;
}>();

const { isAuthenticated, user, hasOrganizerProfile, isAdmin, logout } = useAuth();
const { goToStart } = useBecomeOrganizer();

const styles = twMerge(
  'top-0 inset-x-0 z-50 transition-all duration-300',
  props.position === 'fixed'
    ? 'fixed glass border-b border-violet-100/60 py-3'
    : 'sticky py-4',
);
</script>

<template>
  <header :class="styles">
    <div class="max-w-6xl mx-auto flex justify-between items-center px-2 md:px-4">
      <div class="flex items-center gap-6 md:gap-10">
        <router-link to="/events" class="flex items-center gap-2 shrink-0">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center">
            <img
              src="/logo-v1.png"
              alt=""
              class="h-12 w-12 object-contain scale-[3]"
              width="48"
              height="48"
            />
          </div>
          <span
            class="text-2xl font-bold bg-linear-to-l from-violet-600 to-fuchsia-500 bg-clip-text text-transparent"
          >
            پیش پیش
          </span>
        </router-link>
        <nav class="hidden sm:flex gap-5 text-sm">
          <router-link
            v-if="hasOrganizerProfile"
            to="/events/create"
            class="text-[var(--color-muted)] hover:text-violet-600 font-medium transition-colors"
          >
            ایونت‌های من
          </router-link>
          <router-link
            v-if="hasOrganizerProfile"
            to="/organizers/me/edit"
            class="text-[var(--color-muted)] hover:text-violet-600 font-medium transition-colors"
          >
            پروفایل
          </router-link>
          <router-link
            v-if="isAdmin"
            to="/admin"
            class="text-[var(--color-muted)] hover:text-violet-600 font-medium transition-colors"
          >
            ادمین
          </router-link>
        </nav>
      </div>

      <div class="flex items-center gap-2 md:gap-3">
        <OButton
          v-if="!hasOrganizerProfile"
          variant="gradient"
          size="sm"
          class="hidden sm:inline-flex"
          @click="goToStart"
        >
          <span class="hidden md:inline">لحظه بساز</span>
          <span class="md:hidden">+ ایونت</span>
        </OButton>

        <template v-if="isAuthenticated">
          <span class="text-xs text-[var(--color-muted)] hidden lg:inline max-w-[140px] truncate">
            {{ user?.email }}
          </span>
          <OButton variant="ghost" size="sm" @click="logout">خروج</OButton>
        </template>
        <template v-else>
          <router-link to="/auth/login">
            <OButton variant="ghost" size="sm">ورود</OButton>
          </router-link>
          <router-link to="/auth/register">
            <OButton variant="fill" size="sm">ثبت‌نام</OButton>
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>
