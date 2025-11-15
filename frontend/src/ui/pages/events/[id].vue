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
  <main class="py-24 px-12">
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      Loading...
    </div>

    <div v-else-if="eventDetail" class="flex flex-1">
      <div class="flex-1">
        <h1 class="text-4xl font-bold mb-2">{{ eventDetail.title }}</h1>
        <p class="text-2xl">{{ eventDetail.description }}</p>
      </div>
      <div class="">
        <OImage
          :src="getImageUrl(eventDetail.images?.[0]?.url || '')"
          width="350"
          height="350"
          class="rounded shadow"
          fallback-src="/images/placeholder.svg"
        />
        <div class="flex mt-4 gap-2">
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
    <OButton class="mt-auto bottom-0 w-full" @click="handleDelete"> حذف </OButton>
  </main>
</template>
