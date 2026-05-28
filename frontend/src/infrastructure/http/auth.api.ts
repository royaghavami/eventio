import { httpClient } from "./httpClient";
import type {
  AuthResponse,
  AuthUser,
  LoginInput,
  RegisterInput,
} from "@/entity/user/user";

export const authApi = {
  register(input: RegisterInput) {
    return httpClient
      .post<AuthResponse>("/auth/register", input)
      .then((r) => r.data);
  },
  login(input: LoginInput) {
    return httpClient.post<AuthResponse>("/auth/login", input).then((r) => r.data);
  },
  me() {
    return httpClient.get<AuthUser>("/auth/me").then((r) => r.data);
  },
};
