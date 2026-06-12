<script setup lang="ts">
import OButton from "@/components/base/button.vue";

defineOptions({ name: "FinalStep" });

const props = defineProps<{
    //TODO: fix type 
  formData: any;
  isPending: boolean;
  mutate: () => void;
}>();
</script>

<template>
  <div class="space-y-4 text-center">
    <h2 class="text-xl font-semibold">منتشر کن</h2>
    <p>از اینجا به بعد، با هم هستید — ایونتت آماده‌ست.</p>

    <OButton class="w-full"  @click="props.mutate">منتشر کن</OButton>
    <OButton class="w-full mt-2" variant="outline">ایونت جدید بذار</OButton>
  </div>
</template>
