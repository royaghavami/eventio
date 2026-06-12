<script setup lang="ts">
import OButton from "@/components/base/button.vue";

defineOptions({ name: "CategoriesStep" });

const props = defineProps<{
  formData: { categoryId: number | null };
  categories: { id: number; name: string; icon: string }[];
  selectCategory: (categoryId: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}>();
</script>

<template>
  <div class="space-y-6 mt-18">
    <h2 class="text-xl font-semibold">دسته‌بندی ایونت</h2>

    <div v-if="!props.categories.length" class="text-sm text-[var(--color-muted)]">
      در حال بارگذاری دسته‌ها…
    </div>

    <div v-else class="flex flex-wrap gap-3">
      <button
        v-for="cat in props.categories"
        :key="cat.id"
        type="button"
        @click="props.selectCategory(cat.id)"
        :class="[
          'px-4 py-2 rounded border flex items-center gap-2',
          props.formData.categoryId === cat.id
            ? 'bg-indigo-400 text-white border-indigo-400'
            : 'bg-white text-gray-700 border-gray-300',
        ]"
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
