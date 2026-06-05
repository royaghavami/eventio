<script setup lang="ts">
defineOptions({ name: "OInput" });

defineProps<{
  id?: string;
  label?: string;
  type?: string;
  error?: string;
}>();

const model = defineModel<string | number>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <input
      :id="id"
      v-bind="$attrs"
      :type="type || 'text'"
      v-model="model"
      class="border border-violet-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 rounded-xl px-3 py-2.5 outline-none transition text-[var(--color-ink)] placeholder-[var(--color-muted)] bg-white/80"
    />

    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>
