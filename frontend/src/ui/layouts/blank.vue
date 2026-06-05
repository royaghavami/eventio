<script setup lang="ts">
import Header from '@/ui/layouts/components/header.vue';
import Footer from '@/ui/layouts/components/footer.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header position="fixed" />
    <main class="flex-1 w-full">
      <router-view />
    </main>
    <Footer />
  </div>
</template>
