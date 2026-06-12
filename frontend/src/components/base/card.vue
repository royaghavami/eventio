<script setup lang="ts">
import OImage from "@/components/base/image.vue";

const props = defineProps<{
  title: string;
  capacity?: number;
  remaining?: number;
  city?: string;
  description?: string;
  clickable?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  imageFallback?: string;
}>();

const emit = defineEmits<{
  (event: "click"): void;
}>();

const handleClick = () => {
  if (props.clickable) emit("click");
};

const spotsLabel = computed(() => {
  if (props.remaining === undefined) return null;
  if (props.remaining <= 0) return "این جمع داره کامل می‌شه";
  if (props.remaining <= 5) return `${props.remaining} جا مونده`;
  return null;
});
</script>

<template>
  <article
    @click="handleClick"
    :class="[
      'group glass rounded-2xl overflow-hidden border border-violet-100/80 transition-all duration-300',
      clickable
        ? 'cursor-pointer hover:shadow-xl hover:shadow-violet-200/40 hover:-translate-y-1 hover:border-violet-200'
        : 'cursor-default',
    ]"
  >
    <div class="relative aspect-[4/3] overflow-hidden bg-violet-50" v-if="imageSrc">
      <OImage
        :src="imageSrc"
        :alt="imageAlt || title"
        :fallback-src="imageFallback || '/images/placeholder.svg'"
        class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
      />
      <div
        class="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-80"
      />
      <span
        v-if="spotsLabel"
        :class="[
          'absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full',
          remaining === 0
            ? 'bg-amber-500/90 text-white'
            : 'bg-white/90 text-violet-800',
        ]"
      >
        {{ spotsLabel }}
      </span>
      <span
        v-if="city"
        class="absolute bottom-3 right-3 text-xs text-white/95 font-medium"
      >
        📍 {{ city }}
      </span>
    </div>

    <div class="p-4">
      <h2 class="font-bold text-lg text-[var(--color-ink)] line-clamp-1 group-hover:text-violet-700 transition-colors">
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="mt-2 text-sm text-[var(--color-muted)] line-clamp-2 leading-relaxed"
      >
        {{ description }}
      </p>
      <div
        v-if="capacity"
        class="mt-3 flex items-center justify-between text-xs text-[var(--color-muted)]"
      >
        <span>ظرفیت {{ capacity }}</span>
        <span class="text-violet-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          نزدیک‌تر نگاه کن ←
        </span>
      </div>
    </div>
  </article>
</template>
