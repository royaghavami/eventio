<script setup lang="ts">
defineOptions({ name: "Footer" });
</script>

<template>
  <footer class="border-t border-violet-100/80 mt-auto">
    <div class="max-w-6xl mx-auto py-10 px-6 flex flex-col md:flex-row justify-between gap-6">
      <div>
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center">
            <img
              src="/logo-v1.png"
              alt=""
              class="h-11 w-11 object-contain scale-[2.75]"
              width="44"
              height="44"
            />
          </div>
          <p class="font-bold text-xl text-gradient inline-block">پیش پیش</p>
        </div>
        <p class="text-sm text-[var(--color-muted)] mt-2 max-w-sm leading-relaxed">
          پیش پیش جاییه که آدم‌ها، برندها در ایونت‌ها جمع می‌شن — و لحظه‌ها رو با هم می‌سازن.
        </p>
      </div>
      <div class="flex gap-8 text-sm">
        <router-link to="/events" class="text-[var(--color-muted)] hover:text-violet-600">
          ایونت‌ها
        </router-link>
        <router-link to="/organizers/start" class="text-[var(--color-muted)] hover:text-violet-600">
          لحظه بساز
        </router-link>
      </div>
    </div>
    <div class="text-center text-xs text-[var(--color-muted)] pb-6">
      © {{ new Date().getFullYear() }} Pish Pish
    </div>
  </footer>
</template>
