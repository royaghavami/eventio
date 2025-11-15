<script setup lang="ts">
import OInput from "@/components/base/input.vue";
import OButton from "@/components/base/button.vue";

defineOptions({ name: "SessionsStep" });

const props = defineProps<{
    //TODO: fix type 
  formData: any;
  addSession: () => void;
  removeSession: (i: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}>();
</script>

<template>
  <div class="space-y-4 mt-16">
    <h2 class="text-xl font-semibold">برنامه / خط زمان ایونت</h2>

    <div v-for="(s, i) in props.formData.sessions" :key="i" class="border p-3 rounded space-y-2">
      <OInput v-model="s.time" type="time" label="ساعت" />
      <OInput v-model="s.title" label="عنوان مرحله" />
      <OInput v-model="s.description" label="توضیح کوتاه" />
      <button type="button" class="text-red-500" @click="props.removeSession(i)">حذف مرحله</button>
    </div>

    <OButton @click="props.addSession">افزودن مرحله</OButton>

    <div class="flex justify-between">
      <OButton @click="props.prevStep" variant="outline">بازگشت</OButton>
      <OButton @click="props.nextStep">مرحله بعد</OButton>
    </div>
  </div>
</template>
