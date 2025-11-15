<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { eventApi } from "@/infrastructure/http/event.api";
import EventsTemplate from '@/ui/pages/events/events.vue'


defineOptions({ name: "Events" });

const { data: eventListings, isLoading } = useQuery({
  queryKey: ["event-listing"],
  queryFn: () => eventApi.getAll(),
});
</script>

<template>
  <main>
    <div v-if="isLoading">Loading...</div>
    <EventsTemplate 
      v-else-if="eventListings"
      :events="eventListings"
    />
  </main>
</template>
