<script setup lang="ts">
import { getImageUrl } from '@/utils/helper';
import OCard from '@/components/base/card.vue';
import OButton from '@/components/base/button.vue';
import OrganizerCta from '@/ui/components/marketing/OrganizerCta.vue';
import { useBecomeOrganizer } from '@/composables/organizer/useBecomeOrganizer';
import { useRouter } from 'vue-router';
import type { Event } from '@/entity/event/event';

defineOptions({ name: 'EventsTemplate' });

const props = defineProps<{
  events: Event[];
  categories?: { id: number; slug: string; name: string }[];
  selectedCategoryId?: number | null;
}>();

const emit = defineEmits<{
  selectCategory: [categoryId: number | null];
}>();

const router = useRouter();
const { goToStart } = useBecomeOrganizer();

const CATEGORY_EMOJI: Record<string, string> = {
  art: '🎨',
  food: '🍳',
  health: '🏃',
  culture: '🖼',
  celebration: '🎉',
  nature: '🌿',
};

const defaultCategories = [
  { emoji: '🎨', name: 'هنر و خلاقیت', slug: 'art' },
  { emoji: '🍳', name: 'غذا و آشپزی', slug: 'food' },
  { emoji: '🏃', name: 'سلامت و فعالیت', slug: 'health' },
  { emoji: '🖼', name: 'فرهنگ و گالری', slug: 'culture' },
  { emoji: '🎉', name: 'جشن و مناسبت', slug: 'celebration' },
  { emoji: '🌿', name: 'طبیعت و سفر', slug: 'nature' },
];

const displayCategories = computed(() => {
  if (props.categories?.length) {
    return props.categories.map((c) => ({
      emoji: CATEGORY_EMOJI[c.slug] ?? '✦',
      name: c.name,
      id: c.id,
    }));
  }
  return defaultCategories.map((c) => ({ ...c, id: null as number | null }));
});

const onCategoryClick = (categoryId: number | null) => {
  if (categoryId == null) return;
  const next =
    props.selectedCategoryId === categoryId ? null : categoryId;
  emit('selectCategory', next);
  if (next !== null) {
    nextTick(() => scrollToEvents());
  }
};

const clearCategory = () => {
  emit('selectCategory', null);
};

const onCardClick = (eventId: number) => {
  router.push(`/events/${eventId}`);
};

const scrollToEvents = () => {
  document.getElementById('events-grid')?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<template>
  <!-- Hero -->
  <section class="relative min-h-[72vh] md:min-h-[78vh] flex items-end">
    <picture class="absolute inset-0">
      <img
        alt="پیش پیش"
        src="/images/hero-landing.jpeg"
        class="size-full object-cover"
        fetchpriority="high"
      />
    </picture>
    <div
      class="absolute inset-0 bg-linear-to-t from-[#1e1b2e] via-[#1e1b2e]/70 to-violet-900/40"
    />
    <div
      class="relative w-full max-w-6xl mx-auto px-6 pb-16 md:pb-24 pt-32 text-white"
    >
      <h1 class="text-4xl md:text-6xl font-bold leading-[1.15] max-w-2xl mb-4">
        امروز
        <span class="text-transparent bg-clip-text bg-linear-to-l from-orange-300 via-fuchsia-300 to-violet-300">
          کجا
        </span>
        بریم؟
      </h1>
      <p class="text-lg md:text-xl text-white/80 max-w-lg mb-8 leading-relaxed">
        پیش پیش جاییه که آدم‌ها در ایونت‌ها جمع می‌شن و لحظه‌ها رو با هم می‌سازن.
        کدوم ایونت داره صدات می‌زنه؟
      </p>
      <div class="flex flex-wrap gap-3">
        <OButton variant="gradient" size="lg" @click="scrollToEvents">
          ببین بقیه کجا جمع شدن
        </OButton>
        <OButton
          variant="outline"
          size="lg"
          @click="goToStart"
        >
          ایونتت رو بذار
        </OButton>
      </div>
    </div>
  </section>

  <!-- Categories -->
  <section class="max-w-6xl mx-auto px-6 py-16 md:py-20">
    <div class="flex items-end justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-ink)]">
          دسته‌بندی
        </h2>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <button
        type="button"
        :class="[
          'group glass rounded-2xl p-4 text-center border transition-all duration-200 hover:-translate-y-0.5',
          selectedCategoryId == null
            ? 'border-violet-400 bg-violet-50 shadow-md shadow-violet-100/50'
            : 'border-violet-100/80 hover:border-violet-300 hover:shadow-md hover:shadow-violet-100/50',
        ]"
        @click="clearCategory"
      >
        <span class="text-2xl block mb-2">✨</span>
        <span class="text-sm font-medium text-[var(--color-ink)]">همه</span>
      </button>
      <button
        v-for="(cat, i) in displayCategories"
        :key="cat.id ?? i"
        type="button"
        :disabled="cat.id == null"
        :class="[
          'group glass rounded-2xl p-4 text-center border transition-all duration-200 hover:-translate-y-0.5',
          selectedCategoryId === cat.id
            ? 'border-violet-400 bg-violet-50 shadow-md shadow-violet-100/50'
            : 'border-violet-100/80 hover:border-violet-300 hover:shadow-md hover:shadow-violet-100/50',
          cat.id == null ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        @click="onCategoryClick(cat.id)"
      >
        <span class="text-2xl block mb-2 group-hover:scale-110 transition-transform">
          {{ cat.emoji }}
        </span>
        <span class="text-sm font-medium text-[var(--color-ink)]">{{ cat.name }}</span>
      </button>
    </div>
  </section>

  <OrganizerCta />

  <!-- Events grid -->
  <section id="events-grid" class="max-w-6xl mx-auto px-6 pb-24">
    <p class="text-center text-[var(--color-muted)] mb-10 text-sm">
      {{ events.length ? `${events.length} ایونت منتظرته` : 'ایونت‌ها دارن شکل می‌گیرن' }}
    </p>

    <div
      v-if="!events.length"
      class="glass rounded-3xl p-12 text-center border border-dashed border-violet-200"
    >
      <span class="text-5xl">✨</span>
      <p class="mt-4 text-[var(--color-muted)]">
        {{
          selectedCategoryId
            ? 'این دسته هنوز ایونتی نداره — یه چیز دیگه امتحان کن'
            : 'هنوز ایونتی اینجا نیست — تو اولین پیش پیش رو بذار'
        }}
      </p>
      <OButton variant="gradient" class="mt-6" @click="goToStart">
        ایونت بذار
      </OButton>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <OCard
        v-for="e in events"
        :key="e.id"
        :title="e.title"
        :city="e.city"
        :capacity="e.capacity"
        :remaining="e.stats?.remainingSpots"
        :description="e.description"
        :image-src="getImageUrl(e.images?.[0]?.url || '')"
        :image-alt="e.title"
        :clickable="true"
        @click="() => onCardClick(e.id)"
      />
    </div>
  </section>
</template>
