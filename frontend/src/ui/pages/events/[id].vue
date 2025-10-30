<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { eventApi } from "@/infrastructure/http/event.api";
import { getImageUrl } from "@/utils/helper";
import OButton from "@/components/base/button.vue";
import OImage from "@/components/base/image.vue";

defineOptions({ name: "EventDetail" });

//TODO: remove the logic to composable
const route = useRoute();
const router = useRouter();

const queryClient = useQueryClient();

const id = Number(route.params.id);

const { data: eventDetail, isLoading } = useQuery({
  queryKey: ["event", id],
  queryFn: () => eventApi.getById(id),
});

//TODO: add the is pending
const { mutate } = useMutation({
  mutationFn: () => eventApi.delete(id),
  onSuccess: () => {
    //TODO: use queryClient instead
    queryClient.invalidateQueries({ queryKey: ["event-list"] });
    router.push("/events");
  },
});

const handleDelete = () => {
  mutate();
};
</script>

<template>
  <div class="flex flex-col min-h-[calc(100vh-10rem)]">
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      Loading...
    </div>

    <div v-else-if="eventDetail" class="flex flex-1">
      <h1 class="flex-1 text-2xl font-bold mb-2">{{ eventDetail.title }}</h1>
      <div class="">
        <OImage
          :src="getImageUrl(eventDetail.images?.[0]?.url || '')"
          width="350"
          height="350"
          class="rounded shadow"
          fallback-src="/images/placeholder.svg"
        />
        <div>
          <OImage
            v-for="image in eventDetail.images"
            :key="image.id"
            :src="getImageUrl(image.url)"
            width="150"
            height="150"
            class="flex rounded shadow"
            fallback-src="/images/placeholder.svg"
          />
        </div>
      </div>
    </div>
    <OButton class="mt-auto w-full" @click="handleDelete"> Delete </OButton>
  </div>
</template>
