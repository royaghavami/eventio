import type { Router } from "vue-router";
import { tokenStorage } from "@/infrastructure/auth/tokenStorage";
import { authApi } from "@/infrastructure/http/auth.api";

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to) => {
    const requiresAuth = Boolean(to.meta.requiresAuth);
    const requiresOrganizer = Boolean(to.meta.requiresOrganizer);
    const requiresAdmin = Boolean(to.meta.requiresAdmin);

    if (!requiresAuth && !requiresOrganizer && !requiresAdmin) {
      return true;
    }

    const token = tokenStorage.get();
    if (!token) {
      return {
        path: "/auth/login",
        query: { redirect: to.fullPath },
      };
    }

    try {
      const user = await authApi.me();

      if (requiresAdmin && user.role !== "ADMIN") {
        return { path: "/events" };
      }

      if (requiresOrganizer) {
        if (user.organizer) {
          return true;
        }
        if (user.role === "ADMIN") {
          return { path: "/admin" };
        }
        return {
          path: "/auth/register",
          query: { role: "organizer", redirect: to.fullPath },
        };
      }
    } catch {
      tokenStorage.clear();
      return {
        path: "/auth/login",
        query: { redirect: to.fullPath },
      };
    }

    return true;
  });
}
