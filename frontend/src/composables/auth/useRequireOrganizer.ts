import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "./useAuth";

export function useRequireOrganizer() {
  const router = useRouter();
  const { isAuthenticated, hasOrganizerProfile, isAdmin, isLoading } = useAuth();

  const ensureOrganizer = () => {
    if (isLoading.value) return;
    if (!isAuthenticated.value) {
      router.replace({
        path: "/auth/login",
        query: { redirect: router.currentRoute.value.fullPath },
      });
      return;
    }
    if (!hasOrganizerProfile.value) {
      if (isAdmin.value) {
        router.replace("/admin");
        return;
      }
      router.replace("/auth/register?role=organizer");
    }
  };

  onMounted(ensureOrganizer);
  watch(
    [isAuthenticated, hasOrganizerProfile, isAdmin, isLoading],
    ensureOrganizer,
  );

  return { isAuthenticated, hasOrganizerProfile, isLoading };
}
