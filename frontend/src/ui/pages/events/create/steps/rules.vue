<script setup lang="ts">
import OButton from "@/components/base/button.vue";

defineOptions({ name: "RulesStep" });

const props = defineProps<{
    //TODO: fix type 
  formData: any;
  rulesList: string[];
  nextStep: () => void;
  prevStep: () => void;
}>();
</script>

<template>
  <div class="space-y-4 mt-24">
    <h2 class="text-xl font-semibold">قوانین و نکات مهم</h2>

    <div v-for="rule in props.rulesList" :key="rule">
      <label class="flex items-center gap-2">
        <input type="checkbox" :value="rule" v-model="props.formData.rules" />
        {{ rule }}
      </label>
    </div>

    <div class="flex justify-between">
      <OButton @click="props.prevStep" variant="outline">بازگشت</OButton>
      <OButton @click="props.nextStep">مرحله بعد</OButton>
    </div>
  </div>
</template>
