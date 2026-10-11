import { apiRequest } from "./client";

export async function fetchItems(params = {}) {
  const query = new URLSearchParams();
  if (params.type && params.type !== "ALL") query.set("type", params.type);
  if (params.status && params.status !== "ALL") query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.category && params.category !== "ALL") query.set("category", params.category);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const data = await apiRequest(`/items${queryString}`);
  return Array.isArray(data) ? data : data.items || [];
}

export async function fetchMyItems() {
  const data = await apiRequest("/items/mine");
  return Array.isArray(data) ? data : data.items || [];
}

export async function fetchItemById(id) {
  return apiRequest(`/items/${id}`);
}

export async function createItem(itemData) {
  return apiRequest("/items", {
    method: "POST",
    body: itemData,
  });
}

export async function updateItem(id, updateData) {
  return apiRequest(`/items/${id}`, {
    method: "PUT",
    body: updateData,
  });
}

export async function updateItemStatus(id, status) {
  return apiRequest(`/items/${id}/status`, {
    method: "PUT",
    body: { status },
  });
}

export async function deleteItem(id) {
  return apiRequest(`/items/${id}`, {
    method: "DELETE",
  });
}