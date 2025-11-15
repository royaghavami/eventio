<script setup lang="ts">
defineOptions({
  name: 'TransitionSlide'
})

const props = defineProps<{
  slide: number
}>()

const isReversed = ref<boolean>(false)

const animation = computed(() => {
  if (isReversed.value) {
    return {
      enter: 'translate-x-full opacity-0',
      leave: '-translate-x-full opacity-0 absolute top-0 inset-x-0'
    }
  }
  return {
    enter: '-translate-x-full opacity-0',
    leave: 'translate-x-full opacity-0 absolute top-0 inset-x-0'
  }
})

watch(
  () => props.slide,
  (newVal, oldVal) => {
    isReversed.value = newVal < oldVal
  }
)
</script>

<template>
  <div
    data-transition-container
    class="relative"
  >
    <Transition
      :enter-from-class="animation.enter"
      :leave-to-class="animation.leave"
      enter-active-class="transform-gpu transition-[transform,opacity] duration-400"
      leave-active-class="transform-gpu transition-[transform,opacity] duration-400"
    >
      <slot />
    </Transition>
  </div>
</template>
