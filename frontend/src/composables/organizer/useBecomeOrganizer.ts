import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { organizerApi } from "@/infrastructure/http/organizer.api";
import { useAuth } from "@/composables/auth/useAuth";

const AUTH_ME_KEY = ["auth", "me"] as const;

export function useBecomeOrganizer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, hasOrganizerProfile } = useAuth();

  const goToStart = () => {
    if (!isAuthenticated.value) {
      router.push({
        path: "/auth/register",
        query: { role: "organizer", redirect: "/organizers/start" },
      });
      return;
    }
    if (hasOrganizerProfile.value) {
      router.push("/events/create");
      return;
    }
    router.push("/organizers/start");
  };

  const becomeMutation = useMutation({
    mutationFn: (name: string) => organizerApi.becomeOrganizer({ name }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_KEY });
      router.push("/events/create");
    },
  });

  return {
    goToStart,
    become: becomeMutation.mutateAsync,
    isPending: becomeMutation.isPending,
    hasOrganizerProfile,
    isAuthenticated,
  };
}
