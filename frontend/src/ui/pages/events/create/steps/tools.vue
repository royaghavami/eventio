<script setup lang="ts">
import OButton from "@/components/base/button.vue";

defineOptions({ name: "ToolsStep" });

const props = defineProps<{
    //TODO: fix type 
  formData: any;
  toolsList: string[];
  nextStep: () => void;
  prevStep: () => void;
}>();
</script>

<template>
  <div class="space-y-4 mt-12">
    <h2 class="text-xl font-semibold">وسایل و نیازمندی‌ها</h2>

    <div v-for="tool in props.toolsList" :key="tool">
      <label class="flex items-center gap-2">
        <input type="checkbox" :value="tool" v-model="props.formData.tools" />
        {{ tool }}
      </label>
    </div>

    <div class="flex justify-between">
      <OButton @click="props.prevStep" variant="outline">بازگشت</OButton>
      <OButton @click="props.nextStep">مرحله بعد</OButton>
    </div>
  </div>
</template>
