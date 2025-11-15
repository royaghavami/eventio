<template>
  <img
    v-if="iconSrc"
    :src="iconSrc"
    :alt="props.name"
    :width="props.width"
    :height="props.height"
    :class="props.class"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import type { Icon } from './icon';

const props = defineProps<{
  name: Icon;
  width?: string | number;
  height?: string | number;
  class?: string;
  fallbackSrc?: string;
}>();

const iconSrc = ref(getIconPath(props.name));

function getIconPath(name: Icon): string {
  return `/src/components/base/icon/svgs/${name}.svg`;
}

function onError() {
  if (props.fallbackSrc) {
    iconSrc.value = props.fallbackSrc;
  } else {
    iconSrc.value = '';
  }
}
</script>
