<script setup lang="ts">
import OButton from "@/components/base/button.vue";
import { useBecomeOrganizer } from "@/composables/organizer/useBecomeOrganizer";

defineOptions({ name: "OrganizerCta" });

const { goToStart, hasOrganizerProfile } = useBecomeOrganizer();
</script>

<template>
  <section
    class="relative mx-4 md:mx-auto max-w-5xl my-20 md:my-28 rounded-3xl overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-linear-to-bl from-violet-600 via-fuchsia-600 to-orange-500"
    />
    <div
      class="absolute inset-0 opacity-30"
      style="
        background-image: radial-gradient(circle at 20% 80%, white 1px, transparent 1px);
        background-size: 24px 24px;
      "
    />
    <div
      class="relative px-6 py-12 md:px-14 md:py-16 flex flex-col md:flex-row items-center gap-10 text-white"
    >
      <div class="flex-1 text-center md:text-right space-y-4">
        <h2 class="text-3xl md:text-4xl font-bold leading-tight">
          ایونتت رو بذار،
          <br class="hidden sm:block" />
          جمع رو دعوت کن
        </h2>
      </div>

      <div
        class="w-full md:w-80 shrink-0 glass rounded-2xl p-6 text-center md:text-right shadow-xl border border-white/20"
      >
        <p class="text-violet-900 font-semibold text-lg mb-1">
          {{ hasOrganizerProfile ? "آماده‌ای؟" : "برگزارکننده شو" }}
        </p>
        <p class="text-violet-800/80 text-sm mb-5">
          {{
            hasOrganizerProfile
              ? ""
              : "پروفایلت رو بساز و اولین ایونتت رو با بقیه به اشتراک بذار"
          }}
        </p>
        <OButton
          variant="fill"
          size="lg"
          class="w-full !bg-violet-900 hover:!bg-violet-800"
          @click="goToStart"
        >
          {{ hasOrganizerProfile ? "ایونت جدید بذار" : "شروع کن" }}
        </OButton>
      </div>
    </div>
  </section>
</template>
