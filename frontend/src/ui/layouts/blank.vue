<script setup lang="ts">
import Header from '@/ui/layouts/components/header.vue';
import Footer from '@/ui/layouts/components/footer.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Header position="fixed" />
    <main class="flex-1">
      <div class="mx-auto">
        <router-view />
      </div>
    </main>
    <Footer />
  </div>
</template>
