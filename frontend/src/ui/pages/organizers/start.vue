<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import OButton from "@/components/base/button.vue";
import OInput from "@/components/base/input.vue";
import { useBecomeOrganizer } from "@/composables/organizer/useBecomeOrganizer";
import { useAuth } from "@/composables/auth/useAuth";

defineOptions({ name: "OrganizerStartPage" });

const router = useRouter();
const { isAuthenticated } = useAuth();
const { become, isPending, hasOrganizerProfile } = useBecomeOrganizer();

const displayName = ref("");
const error = ref("");

const steps = [
  { emoji: "🎯", title: "اسم و شهر", desc: "پروفایل ساده — بدون فرم‌های طولانی" },
  { emoji: "📸", title: "جزئیات ایونت", desc: "عکس، تاریخ، ظرفیت" },
  { emoji: "🚀", title: "منتشر کن", desc: "بلیت رایگان — رزرو آنلاین" },
];

watch(
  hasOrganizerProfile,
  (has) => {
    if (has) router.replace("/events/create");
  },
  { immediate: true },
);

const onSubmit = async () => {
  error.value = "";
  if (!displayName.value.trim()) {
    error.value = "یه اسم برای برندت بنویس";
    return;
  }
  try {
    await become(displayName.value.trim());
  } catch {
    error.value = "مشکلی پیش اومد. دوباره امتحان کن.";
  }
};
</script>

<template>
  <main class="min-h-[80vh] pt-28 pb-16 px-4">
    <div class="max-w-4xl mx-auto">
      <router-link
        to="/events"
        class="text-sm text-violet-600 hover:underline mb-6 inline-block"
      >
        ← برگشت به ایونت‌ها
      </router-link>

      <div class="text-center mb-12">
        <span class="text-4xl mb-4 block">🎪</span>
        <h1 class="text-3xl md:text-4xl font-bold text-gradient mb-3">
          وقتشه ایونت بسازی
        </h1>
        <p class="text-[var(--color-muted)] max-w-md mx-auto leading-relaxed">
          هزاران نفر دنبال تجربه‌های تازه‌ان — نه یه کافه دیگه. تو می‌تونی
          همون تجربه‌ای باشی که همه دنبالش می‌گردن.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-4 mb-12">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="glass rounded-2xl p-5 border border-violet-100/80 text-center"
        >
          <span class="text-2xl">{{ step.emoji }}</span>
          <p class="font-semibold mt-2 text-[var(--color-ink)]">{{ step.title }}</p>
          <p class="text-sm text-[var(--color-muted)] mt-1">{{ step.desc }}</p>
        </div>
      </div>

      <div
        v-if="!isAuthenticated"
        class="glass max-w-md mx-auto rounded-2xl p-8 text-center border border-violet-100"
      >
        <p class="mb-4 text-[var(--color-muted)]">اول وارد حسابت شو</p>
        <router-link to="/auth/register?role=organizer&redirect=/organizers/start">
          <OButton variant="gradient" size="lg">ثبت‌نام برگزارکننده</OButton>
        </router-link>
      </div>

      <form
        v-else
        class="glass max-w-md mx-auto rounded-2xl p-8 border border-violet-100 shadow-lg shadow-violet-200/30"
        @submit.prevent="onSubmit"
      >
        <h2 class="font-bold text-lg mb-1">اسم برگزارکننده‌ات چیه؟</h2>
        <p class="text-sm text-[var(--color-muted)] mb-5">
          مثلاً «استودیو رنگ» یا «کلاب دویدن پارک»
        </p>
        <OInput
          id="org-name"
          v-model="displayName"
          label="نام نمایشی"
          placeholder="اسم تیم یا برندت"
          required
        />
        <p v-if="error" class="text-sm text-red-500 mt-2">{{ error }}</p>
        <OButton
          type="submit"
          variant="gradient"
          size="lg"
          class="w-full mt-6"
          :disabled="isPending.value"
        >
          بزن بریم — ساخت اولین ایونت
        </OButton>
      </form>
    </div>
  </main>
</template>
