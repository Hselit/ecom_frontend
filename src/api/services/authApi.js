import { apiClient } from "../client";

export function login(credentials) {
  return apiClient.post("/login", credentials);
}
