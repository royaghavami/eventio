<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { eventApi } from '@/infrastructure/http/event.api'
import { useRouter } from 'vue-router'
import { getImageUrl } from '@/utils/helper'
import OCard from '@/components/base/card.vue'


defineOptions({ name: 'Events' })

const { data: eventListings, isLoading } = useQuery({
  queryKey: ['event-listing'],
  queryFn: () => eventApi.getAll(),
})

const router = useRouter()

const onCardClick = (eventId: string) => {
  router.push(`/events/${eventId}`)
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Events</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <OCard
        v-for="e in eventListings"
        :key="e.id"
        :title="e.title"
        :subtitle="e.capacity?.toString()"
        :extra="e.description"
        :image-src="getImageUrl(e.images?.[0]?.url || '')"
        :image-alt="e.title"
        :clickable="true"
        @click="() => onCardClick(e.id)"
      />
    </div>
  </div>
</template>
