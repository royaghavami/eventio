<script setup lang="ts">
import OInput from "@/components/base/input.vue";
import OButton from "@/components/base/button.vue";

defineOptions({ name: "GeneralInfoStep" });

const props = defineProps<{
  //TODO: fix type 
  formData: any;
  nextStep: () => void;
  prevStep: () => void;
}>();
</script>

<template>
  <div class="space-y-4 mt-16">
    <OInput v-model="props.formData.title" label="عنوان ایونت" placeholder="مثلاً: دورهمی نقاشی عصر جمعه" />
    <OInput v-model="props.formData.description" label="توضیح کوتاه" placeholder="یک یا دو پاراگراف احساسی..." />
    <OInput v-model="props.formData.startDate" type="datetime-local" label="تاریخ و ساعت شروع" />
    <OInput v-model="props.formData.endDate" type="datetime-local" label="تاریخ و ساعت پایان" />
    <OInput v-model="props.formData.capacity" type="number" label="ظرفیت" />
    <OInput v-model="props.formData.address" label="محل برگزاری" placeholder="مثلاً: تهران، خیابان گاندی جنوبی..." />

    <div class="flex justify-between">
      <OButton @click="props.prevStep" variant="outline">بازگشت</OButton>
      <OButton @click="props.nextStep">مرحله بعد</OButton>
    </div>
  </div>
</template>
