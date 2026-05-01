import { apiClient } from "../client";

export function registerUser(payload) {
  return apiClient.post("/user/register", payload);
}

export function getRoles(params = { limit: 10, offset: 0 }) {
  return apiClient.get("/role/", { params });
}

export function getUserById(userId) {
  return apiClient.get(`/user/${userId}`);
}
