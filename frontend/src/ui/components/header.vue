<script setup lang="ts">
import { twMerge } from '@/utils/tailwind/tw';
import OButton from "@/components/base/button.vue"

defineOptions({
  name: "Header",
});

const props = defineProps<{
  position: string;
}>();

const styles = twMerge(
  'top-0 inset-x-0 py-16 z-10 bg-white shadow-md py-4',
  props.position === 'fixed' ? 'fixed' : 'sticky bg-theme-primary'
)
</script>

<template>
    <header :class="[styles]">
      <div class="mx-auto flex justify-between px-4">
        <div class="flex items-center justify-center px-4">
          <h1 class="text-2xl font-bold text-indigo-600 ml-8">ایونتیو</h1>
          <nav class="flex gap-4">
            <router-link
              to="/events"
              class="text-gray-700 hover:text-indigo-500 font-medium"
            >
              ایونت‌های من
            </router-link>
            <router-link
              to="/events/create"
              class="text-gray-700 hover:text-indigo-500 font-medium"
            >
              اضافه کردن
            </router-link>
          </nav>
        </div>
        <div class="flex gap-4">
          <OButton variant="outline">
            ورود
          </OButton>
          <OButton>
            ثبت‌نام
          </OButton>
        </div>
      </div>
    </header>
</template>