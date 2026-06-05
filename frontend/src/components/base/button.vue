<script setup lang="ts">
import { twMerge } from "@/utils/tailwind/tw";

defineOptions({
  name: "OButton",
});

const props = withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset";
    variant?: "fill" | "outline" | "ghost" | "gradient";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
  }>(),
  {
    type: "button",
    variant: "fill",
    size: "md",
    disabled: false,
  },
);

const sizeClass = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-2xl",
};

const variantClass = {
  fill: "bg-violet-600 text-white hover:bg-violet-500 shadow-sm shadow-violet-600/20",
  outline:
    "bg-white/80 text-violet-700 border border-violet-200 hover:bg-violet-50 hover:border-violet-300",
  ghost: "bg-transparent text-violet-700 hover:bg-violet-50",
  gradient:
    "text-white bg-linear-to-l from-violet-600 via-fuchsia-500 to-orange-400 hover:opacity-95 shadow-lg shadow-violet-500/25",
};
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="
      twMerge(
        'font-medium inline-flex items-center justify-center gap-2 transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer',
        sizeClass[size],
        variantClass[variant],
      )
    "
  >
    <slot />
  </button>
</template>
