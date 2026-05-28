import { computed, ref } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { authApi } from "@/infrastructure/http/auth.api";
import { tokenStorage } from "@/infrastructure/auth/tokenStorage";
import type {
  AuthUser,
  LoginInput,
  RegisterInput,
  UserRole,
} from "@/entity/user/user";

const AUTH_ME_KEY = ["auth", "me"] as const;

export function useAuth() {
  const queryClient = useQueryClient();
  const hasToken = ref(!!tokenStorage.get());

  const meQuery = useQuery({
    queryKey: AUTH_ME_KEY,
    queryFn: () => authApi.me(),
    enabled: computed(() => hasToken.value),
    retry: false,
  });

  const user = computed<AuthUser | null>(
    () => meQuery.data.value ?? null,
  );
  const isAuthenticated = computed(
    () => hasToken.value && !!user.value && !meQuery.isError.value,
  );
  /** User registered as event organizer (role only). */
  const isOrganizer = computed(() => user.value?.role === "ORGANIZER");
  const isAdmin = computed(() => user.value?.role === "ADMIN");
  /** Has an organizer_profiles row — required for create/profile pages. */
  const hasOrganizerProfile = computed(() => !!user.value?.organizer);

  const applySession = async (accessToken: string) => {
    tokenStorage.set(accessToken);
    hasToken.value = true;
    await queryClient.invalidateQueries({ queryKey: AUTH_ME_KEY });
  };

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: async (data) => {
      await applySession(data.accessToken);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: async (data) => {
      await applySession(data.accessToken);
    },
  });

  const logout = () => {
    tokenStorage.clear();
    hasToken.value = false;
    queryClient.setQueryData(AUTH_ME_KEY, null);
    queryClient.clear();
  };

  const hasRole = (role: UserRole) => user.value?.role === role;

  return {
    user,
    isAuthenticated,
    isOrganizer,
    isAdmin,
    hasOrganizerProfile,
    isLoading: computed(() => meQuery.isLoading.value && hasToken.value),
    loginMutation,
    registerMutation,
    logout,
    hasRole,
    refetchUser: meQuery.refetch,
  };
}
