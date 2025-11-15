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
    <h2 class="text-xl font-semibold">انتشار ایونت</h2>
    <p>تبریک! ایونت شما آماده انتشار است.</p>

    <OButton class="w-full"  @click="props.mutate">انتشار ایونت</OButton>
    <OButton class="w-full mt-2" variant="outline">ایجاد ایونت جدید</OButton>
  </div>
</template>
