import { apiRequest } from "./client";

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("findit_user") || "null");
  } catch {
    return null;
  }
}

export function saveAuth(token, user) {
  localStorage.setItem("findit_token", token);
  localStorage.setItem("findit_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("findit_token");
  localStorage.removeItem("findit_user");
}

export function loginUser(body) {
  return apiRequest("/auth/login", { method: "POST", body });
}

export function registerUser(body) {
  return apiRequest("/auth/register", { method: "POST", body });
}
