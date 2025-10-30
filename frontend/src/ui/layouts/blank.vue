<script setup lang="ts">

</script>

<template>

    <div class="flex flex-col min-h-screen bg-gray-50">
    <header class="bg-white shadow-md py-4">
      <div class="mx-auto flex justify-between items-center px-4">
        <h1 class="text-2xl font-bold text-blue-600">Event App</h1>
        <nav class="flex gap-4">
          <router-link
            to="/events"
            class="text-gray-700 hover:text-blue-600 font-medium"
          >
            Events
          </router-link>
          <router-link
            to="/events/create"
            class="text-gray-700 hover:text-blue-600 font-medium"
          >
            Add Event
          </router-link>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <router-view />
      </div>
    </main>

      <footer class="bg-white border-t py-3 mt-auto">
        <div class="max-w-6xl mx-auto px-4 text-sm text-gray-500">
          © 2025 My Company. All rights reserved.
        </div>
      </footer>
    </div>

</template>
