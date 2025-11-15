<script setup lang="ts">
import OButton from "@/components/base/button.vue";

defineOptions({ name: "PreviewStep" });

const props = defineProps<{
    //TODO: fix type 
  formData: any;
  nextStep: () => void;
  prevStep: () => void;
}>();
</script>

<template>
  <div class="space-y-4 mt-24">
    <h2 class="text-xl font-semibold">پیش‌نمایش ایونت</h2>

    <div class="border p-4 rounded space-y-2">
      <p><strong>عنوان:</strong> {{ props.formData.title }}</p>
      <p><strong>توضیح:</strong> {{ props.formData.description }}</p>
      <p><strong>تاریخ:</strong> {{ props.formData.startDate }} - {{ props.formData.endDate }}</p>
      <p><strong>محل:</strong> {{ props.formData.address }}</p>
      <p><strong>ظرفیت:</strong> {{ props.formData.capacity }}</p>
      <p><strong>دسته‌ها:</strong> {{ props.formData.categories.join(", ") }}</p>
      <p><strong>وسایل:</strong> {{ props.formData.tools.join(", ") }}</p>
      <p><strong>قوانین:</strong> {{ props.formData.rules.join(", ") }}</p>
    </div>

    <div class="flex justify-between">
      <OButton @click="props.prevStep" variant="outline">بازگشت</OButton>
      <OButton @click="props.nextStep">مرحله بعد</OButton>
    </div>
  </div>
</template>
