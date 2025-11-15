<script setup lang="ts">
defineOptions({
  name: "OButton",
});

withDefaults(
  defineProps<{
  type?: "button" | "submit" | "reset";
  variant?: "fill" | "outline"
  disabled?: boolean;
  }>(),
  {
    type: 'button',
    variant: 'fill',
    disabled: false
  }
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['px-4 py-2  rounded disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed transition', 
    variant === 'fill' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white text-indigo-600 border border-b-indigo-600']"
  >
    <slot />
  </button>
</template>
