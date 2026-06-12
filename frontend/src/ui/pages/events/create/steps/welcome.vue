<script setup lang="ts">
import OButton from "@/components/base/button.vue";

defineOptions({ name: "WelcomeStep" });

const props = defineProps<{ nextStep: () => void }>();
</script>

<template>
    <div class="space-y-6 text-center mt-24">
        <h1 class="text-2xl font-bold">این ایونت داره شکل می‌گیره</h1>
        <p class="text-[var(--color-muted)] text-sm">چند قدم تا انتشار — با هم می‌سازیمش</p>
        <OButton @click="props.nextStep">شروع کنیم</OButton>
    </div>
</template>