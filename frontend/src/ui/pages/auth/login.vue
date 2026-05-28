<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import OButton from "@/components/base/button.vue";
import OInput from "@/components/base/input.vue";
import { useAuth } from "@/composables/auth/useAuth";

defineOptions({ name: "LoginPage" });

const route = useRoute();
const router = useRouter();
const { loginMutation } = useAuth();

const email = ref("");
const password = ref("");
const error = ref("");

const onSubmit = async () => {
  error.value = "";
  try {
    await loginMutation.mutateAsync({
      email: email.value,
      password: password.value,
    });
    const redirect = (route.query.redirect as string) || "/events";
    router.push(redirect);
  } catch {
    error.value = "ایمیل یا رمز عبور اشتباه است";
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
      <h1 class="text-2xl font-bold text-center">ورود به ایونتیو</h1>

      <OInput id="email" v-model="email" label="ایمیل" type="email" required />
      <OInput
        id="password"
        v-model="password"
        label="رمز عبور"
        type="password"
        required
      />

      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

      <OButton type="submit" class="w-full" :disabled="loginMutation.isPending.value">
        ورود
      </OButton>

      <p class="text-center text-sm text-gray-600">
        حساب ندارید؟
        <router-link to="/auth/register" class="text-indigo-600">ثبت‌نام</router-link>
      </p>
    </form>
  </main>
</template>
