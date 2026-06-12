import { computed, type Ref } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { reservationApi } from "@/infrastructure/http/reservation.api";
import { useAuth } from "@/composables/auth/useAuth";

export function useReserveSpot(eventId: Ref<number> | number) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const id = computed(() =>
    typeof eventId === "number" ? eventId : eventId.value,
  );

  const statsKey = computed(() => ["reservations", "stats", id.value] as const);
  const mineKey = computed(() => ["reservations", "mine", id.value] as const);

  const statsQuery = useQuery({
    queryKey: statsKey,
    queryFn: () => reservationApi.getStats(id.value),
  });

  const myReservationQuery = useQuery({
    queryKey: mineKey,
    queryFn: () => reservationApi.getMine(id.value),
    enabled: computed(() => isAuthenticated.value),
  });

  const reserveMutation = useMutation({
    mutationFn: () => reservationApi.reserve(id.value),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: statsKey.value });
      const previousStats = queryClient.getQueryData(statsKey.value);
      const previousMine = queryClient.getQueryData(mineKey.value);

      if (previousStats) {
        const stats = { ...previousStats } as {
          approvedCount: number;
          waitlistCount: number;
          remainingSpots: number;
          isFull: boolean;
        };
        if (stats.isFull) {
          stats.waitlistCount += 1;
        } else {
          stats.approvedCount += 1;
          stats.remainingSpots = Math.max(0, stats.remainingSpots - 1);
          if (stats.remainingSpots === 0) stats.isFull = true;
        }
        queryClient.setQueryData(statsKey.value, stats);
      }

      queryClient.setQueryData(mineKey.value, {
        id: -1,
        eventId: id.value,
        status: previousStats && (previousStats as { isFull: boolean }).isFull
          ? "WAITLISTED"
          : "APPROVED",
      });

      return { previousStats, previousMine };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousStats) {
        queryClient.setQueryData(statsKey.value, context.previousStats);
      }
      if (context?.previousMine !== undefined) {
        queryClient.setQueryData(mineKey.value, context.previousMine);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: statsKey.value });
      queryClient.invalidateQueries({ queryKey: mineKey.value });
      queryClient.invalidateQueries({ queryKey: ["event", id.value] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (reservationId: number) => reservationApi.cancel(reservationId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: statsKey.value });
      queryClient.invalidateQueries({ queryKey: mineKey.value });
      queryClient.invalidateQueries({ queryKey: ["event", id.value] });
    },
  });

  const myReservation = computed(() => myReservationQuery.data.value);
  const stats = computed(
    () => statsQuery.data.value ?? null,
  );

  const canReserve = computed(() => {
    const r = myReservation.value;
    return !r || r.status === "CANCELLED";
  });

  const reserveLabel = computed(() => {
    if (!canReserve.value) {
      if (myReservation.value?.status === "WAITLISTED") return "تو هم دعوتی";
      if (myReservation.value?.status === "APPROVED") return "تو وارد شدی";
      return "در انتظار تأیید";
    }
    return stats.value?.isFull ? "تو هم دعوتی" : "من هستم";
  });

  const reservationStatus = computed(() => {
    const r = myReservation.value;
    if (!r || r.status === "CANCELLED") return null;
    if (r.status === "APPROVED") return "از اینجا به بعد، با هم هستید";
    if (r.status === "WAITLISTED") return "یه چیزی داره شکل می‌گیره…";
    return "دیدمت تو جمع پیش پیش";
  });

  return {
    stats,
    myReservation,
    canReserve,
    reserveLabel,
    reservationStatus,
    isLoading: computed(
      () => statsQuery.isLoading.value || myReservationQuery.isLoading.value,
    ),
    reserve: reserveMutation.mutateAsync,
    cancel: cancelMutation.mutateAsync,
    isReserving: reserveMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
}
