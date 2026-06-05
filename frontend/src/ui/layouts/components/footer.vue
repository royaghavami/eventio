<script setup lang="ts">
defineOptions({ name: "Footer" });
</script>

<template>
  <footer class="border-t border-violet-100/80 mt-auto">
    <div class="max-w-6xl mx-auto py-10 px-6 flex flex-col md:flex-row justify-between gap-6">
      <div>
        <p class="font-bold text-lg text-gradient inline-block">ایونتیو</p>
        <p class="text-sm text-[var(--color-muted)] mt-2 max-w-xs leading-relaxed">
          پلتفرم کشف و رزرو تجربه‌های اجتماعی — برای نسلی که از روتین خسته شده.
        </p>
      </div>
      <div class="flex gap-8 text-sm">
        <router-link to="/events" class="text-[var(--color-muted)] hover:text-violet-600">
          ایونت‌ها
        </router-link>
        <router-link to="/organizers/start" class="text-[var(--color-muted)] hover:text-violet-600">
          برگزارکننده شو
        </router-link>
      </div>
    </div>
    <div class="text-center text-xs text-[var(--color-muted)] pb-6">
      © {{ new Date().getFullYear() }} Eventio
    </div>
  </footer>
</template>
