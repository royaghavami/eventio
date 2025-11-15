<script setup lang="ts">
const show = defineModel<boolean>('show', { required: true })
const props = defineProps<{ image: string }>()

const close = () => {
  show.value = false
  emit('close')
}

const emit = defineEmits(['close'])
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    @click="close"
  >
    <img
      :src="props.image"
      class="max-w-[90%] max-h-[90%] rounded-xl shadow-lg"
      @click.stop
    />

    <button
      class="absolute top-6 right-6 text-white text-3xl"
      @click="close"
    >
      ✕
    </button>
  </div>
</template>
