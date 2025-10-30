<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import OImage from "@/components/base/image.vue";

defineOptions({ name: "OImageUploader" });

defineProps<{ files?: File[] }>();

const emit = defineEmits<{
  (event: "update:files", files: File[]): void;
}>();

const selectedFiles = ref<File[]>([]);

watch(selectedFiles, (newFiles) => {
  emit("update:files", newFiles);
});

const fileInput = ref<HTMLInputElement | null>(null);

const onFilesSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const filesArray: File[] = Array.from(target.files);
  selectedFiles.value = filesArray.slice(0, 3);
};

const removeFile = (index: number) => {
  selectedFiles.value = selectedFiles.value.filter((_, i) => i !== index);
};

const fileUrl = (file: File): string => {
  return (window as any).URL.createObjectURL(file);
};

const openFileDialog = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div class="space-y-2">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="onFilesSelected"
    />
    <div class="flex gap-2 flex-wrap">
      <div
        v-if="selectedFiles.length === 0"
        @click="openFileDialog"
        class="w-32 h-32 border-2 border-dashed border-gray-400 rounded flex items-center justify-center cursor-pointer text-gray-400 text-3xl font-bold"
      >
        +
      </div>
      <div
        v-for="(file, index) in selectedFiles"
        :key="file.name + file.lastModified"
        class="relative w-32 h-32 border rounded overflow-hidden"
      >
        <OImage
          :src="fileUrl(file)"
          alt="preview"
          class="w-full h-full object-cover"
        />
        <button
          type="button"
          @click="removeFile(index)"
          class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>
