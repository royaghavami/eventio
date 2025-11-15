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
  <main class="py-24 px-12">
    <form @submit.prevent="mutate()" class="pb-20 space-y-4">
      <OInput v-model="formData.title" label="نام ایونت" />
      <OInput v-model="formData.description" label="توضیحات" />
      <OInput
        v-model="formData.startDate"
        type="datetime-local"
        label="تاریخ شروع"
      />
      <OInput
        v-model="formData.endDate"
        type="datetime-local"
        label="تاریخ پایان"
      />
      <OInput v-model="formData.address" label="محل برگزاری" />
      <OInput v-model="formData.capacity" type="number" label="ظرفیت" />

      <OImageUploader v-model:files="formData.images" />

      <OButton type="submit" class="w-full" :disabled="isPending">
        ایجاد کردن
      </OButton>
    </form>
  </main>
</template>
