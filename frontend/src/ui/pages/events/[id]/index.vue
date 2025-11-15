<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { eventApi } from '@/infrastructure/http/event.api';
import EventDetailTemplate from '@/ui/pages/events/[id]/event.vue';

defineOptions({ name: 'EventDetail' });

//TODO: remove the logic to composable
const route = useRoute();
const router = useRouter();

const queryClient = useQueryClient();

const id = Number(route.params.id);

const { data: eventDetail, isLoading } = useQuery({
  queryKey: ['event', id],
  queryFn: () => eventApi.getById(id),
});

//TODO: add the is pending
const { mutate } = useMutation({
  mutationFn: () => eventApi.delete(id),
  onSuccess: () => {
    //TODO: use queryClient instead
    queryClient.invalidateQueries({ queryKey: ['event-list'] });
    router.push('/events');
  },
});
</script>

<template>
  <main class="py-24 px-12">
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">Loading...</div>
    <EventDetailTemplate v-else-if="eventDetail" :event-detail="eventDetail" @delete="mutate" />
  </main>
</template>
