async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || `Request failed with status ${response.status}`,
    );
  }

  return payload;
}

export function getEvents() {
  return request("/api/events");
}

export function unwrapList(payload, key) {
  const list = Array.isArray(payload) ? payload : payload?.[key];
  if (!Array.isArray(list)) {
    throw new Error(`Expected the API response to contain a "${key}" list.`);
  }
  return list;
}

export const api = {
  getEvents,
  createEvent: (details) =>
    request("/api/events", {
      method: "POST",
      body: JSON.stringify(details),
    }),
  deleteEvent: (id) =>
    request(`/api/events/${encodeURIComponent(id)}`, { method: "DELETE" }),
  registerForEvent: (id) =>
    request(`/api/events/${encodeURIComponent(id)}/registrations`, {
      method: "POST",
    }),
  getMyRegistrations: () => request("/api/registrations"),
  cancelRegistration: (id) =>
    request(`/api/registrations/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};
