<script setup lang="ts">
defineOptions({ name: 'OInput' })

defineProps<{
  id?: string
  label?: string
  type?: string
  error?: string
}>()

const model = defineModel<string | number>()
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
      class="border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg px-3 py-2 outline-none transition text-gray-900 placeholder-gray-400"
    />

    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>
