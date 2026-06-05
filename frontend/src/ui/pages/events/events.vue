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
}>();

const router = useRouter();
const { goToStart } = useBecomeOrganizer();

const defaultCategories = [
  { emoji: '🎨', name: 'هنر و خلاقیت' },
  { emoji: '🍳', name: 'غذا و آشپزی' },
  { emoji: '🏃', name: 'سلامت و فعالیت' },
  { emoji: '🖼', name: 'فرهنگ و گالری' },
  { emoji: '🎉', name: 'جشن و مناسبت' },
  { emoji: '🌿', name: 'طبیعت و سفر' },
];

const displayCategories = computed(() => {
  if (props.categories?.length) {
    return props.categories.map((c) => ({ emoji: '✦', name: c.name, id: c.id }));
  }
  return defaultCategories.map((c) => ({ ...c, id: null as number | null }));
});

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
        alt="ایونتیو"
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
      <p
        class="inline-flex items-center gap-2 text-sm bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm"
      >
        <span class="size-2 rounded-full bg-emerald-400 animate-pulse" />
        تجربه‌های واقعی، نه برنامه‌های تکراری
      </p>
      <h1 class="text-4xl md:text-6xl font-bold leading-[1.15] max-w-2xl mb-4">
        هر هفته یه
        <span class="text-transparent bg-clip-text bg-linear-to-l from-orange-300 via-fuchsia-300 to-violet-300">
          ماجراجویی
        </span>
        تازه
      </h1>
      <p class="text-lg md:text-xl text-white/80 max-w-lg mb-8 leading-relaxed">
        ورکشاپ، کلاب، مهمونی، کلاس — کشف کن، رزرو کن، برو تو جمع آدم‌های هم‌فکر.
      </p>
      <div class="flex flex-wrap gap-3">
        <OButton variant="gradient" size="lg" @click="scrollToEvents">
          کشف ایونت‌ها
        </OButton>
        <OButton
          variant="outline"
          size="lg"
          @click="goToStart"
        >
          می‌خوام ایونت بذارم
        </OButton>
      </div>
    </div>
  </section>

  <!-- Categories -->
  <section class="max-w-6xl mx-auto px-6 py-16 md:py-20">
    <div class="flex items-end justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-ink)]">
          چی حال می‌ده؟
        </h2>
        <p class="text-[var(--color-muted)] mt-1 text-sm md:text-base">
          دسته‌بندی‌ها رو بگرد — به‌زودی فیلتر هم میاد
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <button
        v-for="(cat, i) in displayCategories"
        :key="cat.id ?? i"
        type="button"
        class="group glass rounded-2xl p-4 text-center border border-violet-100/80 hover:border-violet-300 hover:shadow-md hover:shadow-violet-100/50 transition-all duration-200 hover:-translate-y-0.5"
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
    <h2 class="text-2xl md:text-3xl font-bold text-center mb-2">
      ایونت‌های داغ این روزها
    </h2>
    <p class="text-center text-[var(--color-muted)] mb-10 text-sm">
      {{ events.length ? `${events.length} تجربه منتظرته` : 'به‌زودی ایونت‌های جدید اضافه می‌شن' }}
    </p>

    <div
      v-if="!events.length"
      class="glass rounded-3xl p-12 text-center border border-dashed border-violet-200"
    >
      <span class="text-5xl">🔍</span>
      <p class="mt-4 text-[var(--color-muted)]">فعلاً ایونتی نیست — اولین نفر باش!</p>
      <OButton variant="gradient" class="mt-6" @click="goToStart">
        اولین ایونت رو بساز
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
