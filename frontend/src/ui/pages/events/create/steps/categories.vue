<script setup lang="ts">
import OButton from "@/components/base/button.vue";

defineOptions({ name: "CategoriesStep" });

const props = defineProps<{
   //TODO: fix type 
  formData: any;
  categories: { name: string; icon: string }[];
  toggleArray: (arr: string[], v: string) => void;
  nextStep: () => void;
  prevStep: () => void;
}>();
</script>

<template>
  <div class="space-y-6 mt-18">
    <h2 class="text-xl font-semibold">دسته‌بندی ایونت</h2>

    <div class="flex flex-wrap gap-3">
      <button
        v-for="cat in props.categories" :key="cat.name"
        type="button"
        @click="props.toggleArray(props.formData.categories, cat.name)"
        :class="['px-4 py-2 rounded border flex items-center gap-2',
                 props.formData.categories.includes(cat.name)
                 ? 'bg-indigo-400 text-white'
                 : 'bg-white text-gray-700 border-gray-300']"
      >
        <span>{{ cat.icon }}</span> {{ cat.name }}
      </button>
    </div>

    <div class="flex justify-between">
      <OButton @click="props.prevStep" variant="outline">بازگشت</OButton>
      <OButton @click="props.nextStep">مرحله بعد</OButton>
    </div>
  </div>
</template>
