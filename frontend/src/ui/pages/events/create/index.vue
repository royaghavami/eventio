<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { eventApi } from "@/infrastructure/http/event.api";
import { httpClient } from "@/infrastructure/http/httpClient";
import { useRouter } from "vue-router";
import { useRequireOrganizer } from "@/composables/auth/useRequireOrganizer";

import Wizard from "@/ui/components/wizard/index.vue";
import type { WizardStep } from "@/ui/components/wizard/index";
import Welcome from "@/ui/pages/events/create/steps/welcome.vue";
import GeneralInfo from "@/ui/pages/events/create/steps/general-info.vue";
import Tools from "@/ui/pages/events/create/steps/tools.vue";
import Sessions from "@/ui/pages/events/create/steps/sessions.vue";
import Rules from "@/ui/pages/events/create/steps/rules.vue";
import Preview from "@/ui/pages/events/create/steps/preview.vue";
import Images from "@/ui/pages/events/create/steps/images.vue";
import Categories from "@/ui/pages/events/create/steps/categories.vue";
import Final from "@/ui/pages/events/create/steps/final.vue";

defineOptions({ name: "CreateEvent" });

useRequireOrganizer();

const router = useRouter();
const queryClient = useQueryClient();

const formData = reactive({
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  city: "تهران",
  address: "",
  capacity: 0,
  categoryId: null as number | null,
  images: [] as (File | null)[],
  sessions: [] as { time: string; title: string; description?: string }[],
  tools: [] as string[],
  rules: [] as string[],
});

const currentStep = ref(0);
const totalSteps = 9;

const CATEGORY_EMOJI: Record<string, string> = {
  art: "🎨",
  food: "🍳",
  health: "🏃",
  culture: "🖼",
  celebration: "🎉",
  nature: "🌿",
};

const { data: apiCategories } = useQuery({
  queryKey: ["categories"],
  queryFn: () =>
    httpClient
      .get<{ id: number; slug: string; name: string }[]>("/categories")
      .then((r) => r.data),
});

const categories = computed(() =>
  (apiCategories.value ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    icon: CATEGORY_EMOJI[c.slug] ?? "✦",
  })),
);

const selectCategory = (categoryId: number) => {
  formData.categoryId = formData.categoryId === categoryId ? null : categoryId;
};

const toolsList = ["ابزار نقاشی", "وسایل آشپزی", "لباس راحت", "کفش مناسب", "هیچ چیز لازم نیست"];
const rulesList = ["رفتار دوستانه و احترام", "کنسلی تا ۲۴ ساعت قبل", "محدودیت سنی (اختیاری)"];

const toggleArray = (arr: string[], value: string) => {
  if (arr.includes(value)) arr.splice(arr.indexOf(value), 1);
  else arr.push(value);
};

const selectedCategoryName = computed(
  () => categories.value.find((c) => c.id === formData.categoryId)?.name ?? "—",
);

const { mutate, isPending } = useMutation({
  mutationFn: () =>
    eventApi.create(
      {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        city: formData.city,
        address: formData.address,
        capacity: formData.capacity,
        categoryId: formData.categoryId ?? undefined,
      },
      formData.images.filter((f): f is File => f !== null),
    ),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["event-listing"] });
    queryClient.invalidateQueries({ queryKey: ["events", "mine"] });
    router.push("/events/mine");
  },
});

const nextStep = () => {
  if (currentStep.value < totalSteps - 1) currentStep.value++;
};
const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--;
};

const addSession = () =>
  formData.sessions.push({ time: "", title: "", description: "" });
const removeSession = (index: number) => formData.sessions.splice(index, 1);

const wizardSteps = computed<WizardStep<number>[]>(() => [
  { key: 0, component: Welcome, props: { nextStep } },
  {
    key: 1,
    component: Categories,
    props: { formData, categories: categories.value, selectCategory, nextStep, prevStep },
  },
  { key: 2, component: GeneralInfo, props: { formData, nextStep, prevStep } },
  {
    key: 3,
    component: Sessions,
    props: { formData, addSession, removeSession, nextStep, prevStep },
  },
  { key: 4, component: Tools, props: { formData, toolsList, nextStep, prevStep } },
  { key: 5, component: Images, props: { formData, nextStep, prevStep } },
  { key: 6, component: Rules, props: { formData, rulesList, nextStep, prevStep } },
  { key: 7, component: Preview, props: { formData, selectedCategoryName: selectedCategoryName.value, nextStep, prevStep } },
  { key: 8, component: Final, props: { formData, isPending: isPending.value, mutate } },
]);
</script>

<route lang="yaml">
meta:
  requiresOrganizer: true
</route>

<template>
  <main class="flex flex-col py-24 px-6 max-w-3xl mx-auto space-y-6">
    <div class="w-full h-2 bg-gray-200 rounded-full">
      <div
        class="h-2 bg-indigo-700 rounded-full transition-all"
        :style="{ width: (currentStep + 1) / totalSteps * 100 + '%' }"
      ></div>
    </div>
    <Wizard :active-step="currentStep" :steps="wizardSteps" />
  </main>
</template>
