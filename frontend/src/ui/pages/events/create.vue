<script setup lang="ts">
import { reactive } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { eventApi } from "@/infrastructure/http/event.api";
import OInput from "@/components/base/input.vue";
import OButton from "@/components/base/button.vue";
import { useRouter } from "vue-router";
import OImageUploader from "@/components/image/uploader.vue";

defineOptions({ name: "CreateEvent" });

const router = useRouter();

const queryClient = useQueryClient();

const formData = reactive({
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  address: "",
  capacity: 0,
  images: [] as File[],
});

const { mutate, isPending } = useMutation({
  mutationFn: () =>
    eventApi.create(
      {
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        address: formData.address,
        capacity: formData.capacity,
      },
      formData.images,
    ),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["events"] });
    router.push("/events");
  },
});
</script>

<template>
  <div class="relative min-h-[calc(100vh-10rem)]">
    <form @submit.prevent="mutate()" class="pb-20 space-y-4">
      <OInput v-model="formData.title" label="Title" />
      <OInput v-model="formData.description" label="Description" />
      <OInput
        v-model="formData.startDate"
        type="datetime-local"
        label="Start Date"
      />
      <OInput
        v-model="formData.endDate"
        type="datetime-local"
        label="End Date"
      />
      <OInput v-model="formData.address" label="Address" />
      <OInput v-model="formData.capacity" type="number" label="Capacity" />

      <OImageUploader v-model:files="formData.images" />

      <OButton type="submit" class="w-full" :disabled="isPending">
        Add Event
      </OButton>
    </form>
  </div>
</template>
