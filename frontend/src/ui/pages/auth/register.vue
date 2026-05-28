<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import OButton from "@/components/base/button.vue";
import OInput from "@/components/base/input.vue";
import { useAuth } from "@/composables/auth/useAuth";

defineOptions({ name: "RegisterPage" });

const route = useRoute();
const router = useRouter();
const { registerMutation } = useAuth();

const email = ref("");
const password = ref("");
const name = ref("");
const error = ref("");

const isOrganizer = computed(
  () => route.query.role === "organizer",
);

const onSubmit = async () => {
  error.value = "";
  try {
    await registerMutation.mutateAsync({
      email: email.value,
      password: password.value,
      role: isOrganizer.value ? "ORGANIZER" : "ATTENDEE",
      name: isOrganizer.value ? name.value : undefined,
    });
    const redirect = (route.query.redirect as string) || "/events";
    router.push(redirect);
  } catch {
    error.value = "ثبت‌نام انجام نشد. شاید این ایمیل قبلاً استفاده شده باشد.";
  }
};
</script>

<route lang="yaml">
meta:
  layout: false
</route>

<template>
  <main class="min-h-screen flex items-center justify-center px-4 py-24">
    <form
      class="w-full max-w-md bg-white rounded-2xl shadow p-8 space-y-4"
      @submit.prevent="onSubmit"
    >
      <h1 class="text-2xl font-bold text-center">
        {{ isOrganizer ? "ثبت‌نام برگزارکننده" : "ثبت‌نام در ایونتیو" }}
      </h1>

      <OInput id="email" v-model="email" label="ایمیل" type="email" required />
      <OInput
        id="password"
        v-model="password"
        label="رمز عبور (حداقل ۸ کاراکتر)"
        type="password"
        required
        minlength="8"
      />
      <OInput
        v-if="isOrganizer"
        id="name"
        v-model="name"
        label="نام برگزارکننده"
        required
      />

      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

      <OButton
        type="submit"
        class="w-full"
        :disabled="registerMutation.isPending.value"
      >
        ثبت‌نام
      </OButton>

      <p class="text-center text-sm text-gray-600">
        قبلاً ثبت‌نام کرده‌اید؟
        <router-link to="/auth/login" class="text-indigo-600">ورود</router-link>
      </p>

      <p v-if="!isOrganizer" class="text-center text-sm">
        <router-link to="/auth/register?role=organizer" class="text-indigo-600">
          می‌خواهم ایونت برگزار کنم
        </router-link>
      </p>
    </form>
  </main>
</template>
