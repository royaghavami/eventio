<script setup lang="ts">
defineOptions({
  name: "OButton",
});

const props = defineProps<{
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}>();

const { type = "button", disabled = false } = props;
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
  >
    <slot />
  </button>
</template>
