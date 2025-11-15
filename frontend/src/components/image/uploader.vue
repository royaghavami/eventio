<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import OImage from "@/components/base/image.vue";

defineOptions({ name: "OImageUploader" });

defineProps<{ file?: File | null }>();

const emit = defineEmits<{
  (event: "update:file", file: File | null): void;
}>();

const selectedFile = ref<File | null>(null);

// Sync prop with internal state
watch(
  () => selectedFile.value,
  (newFile) => emit("update:file", newFile)
);

const fileInput = ref<HTMLInputElement | null>(null);

const openFileDialog = () => fileInput.value?.click();

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] ?? null;
  selectedFile.value = file;
};

const removeFile = () => (selectedFile.value = null);

const fileUrl = (file: File | null) => (file ? URL.createObjectURL(file) : "");
</script>

<template>
  <div class="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center cursor-pointer">
    <input
      type="file"
      accept="image/*"
      class="hidden"
      ref="fileInput"
      @change="onFileSelected"
    />

    <div v-if="selectedFile" class="w-full h-full relative">
      <OImage :src="fileUrl(selectedFile)" class="w-full h-full object-cover" />
      <button
        type="button"
        @click.stop="removeFile"
        class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
      >
        ×
      </button>
    </div>

    <div
      v-else
      @click="openFileDialog"
      class="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-bold border-2 border-dashed rounded-lg"
    >
      +
    </div>
  </div>
</template>
