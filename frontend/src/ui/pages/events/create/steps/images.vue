<script setup lang="ts">
import OButton from "@/components/base/button.vue";
import ImageUploader from "@/components/image/uploader.vue";

defineOptions({ name: "ImagesStep" });

const props = defineProps<{
    //TODO: fix type 
  formData: any;
  nextStep: () => void;
  prevStep: () => void;
}>();
</script>

<template>
  <div class="space-y-4 mt-24">
    <h2 class="text-xl font-semibold">کاور ایونت</h2>

    <div class="flex items-center gap-2 overflow-x-auto py-2">
      <ImageUploader v-for="(file, index) in props.formData.images" :key="index" v-model:file="props.formData.images[index]" />
      <button type="button" @click="props.formData.images.push(null)" class="p-2 border rounded">
        اضافه کردن تصویر +
      </button>
    </div>

    <div class="flex justify-between">
      <OButton @click="props.prevStep" variant="outline">بازگشت</OButton>
      <OButton @click="props.nextStep">مرحله بعد</OButton>
    </div>
  </div>
</template>
