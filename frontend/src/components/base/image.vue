<script setup lang="ts">
import { defineProps, ref } from 'vue'

defineOptions({ name: 'OImage' })

const props = defineProps<{
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  class?: string
  fallbackSrc?: string
}>()


const imgSrc = ref(props.src)

const onError = () => {
  if (props.fallbackSrc) {
    imgSrc.value = props.fallbackSrc
  } else {
    imgSrc.value = ''
  }
}
</script>

<template>
  <img
    :src="imgSrc"
    :alt="props.alt || ''"
    :width="props.width"
    :height="props.height"
    :class="props.class"
    @error="onError"
  />
</template>
