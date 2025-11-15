<script setup lang="ts">
import OButton from "@/components/base/button.vue";

defineOptions({ name: "WelcomeStep" });

const props = defineProps<{ nextStep: () => void }>();
</script>

<template>
    <div class="space-y-6 text-center mt-24">
        <h1 class="text-2xl font-bold">ایونت جدید بساز!</h1>
        <p>مراحل بسیار ساده و کوتاه هست.</p>
        <OButton @click="props.nextStep">شروع ساخت ایونت</OButton>
    </div>
</template>