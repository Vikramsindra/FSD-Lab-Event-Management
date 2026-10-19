import { useEffect, useState } from "react";
import Button from "../components/Button";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { api, unwrapList } from "../services/api";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  location: "",
  category: "",
  capacity: "",
};

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadEvents() {
    setLoading(true);
    setError("");
    try {
      setEvents(unwrapList(await api.getEvents(), "events"));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    api
      .getEvents()
      .then((payload) => {
        if (active) setEvents(unwrapList(payload, "events"));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function createEvent(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setNotice("");
    try {
      const details = {
        ...form,
        date: new Date(form.date).toISOString(),
        ...(form.capacity ? { capacity: Number(form.capacity) } : {}),
      };
      await api.createEvent(details);
      setIsModalOpen(false);
      setForm(emptyForm);
      setNotice("Event published.");
      await loadEvents();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteEvent(event) {
    const id = event._id || event.id;
    if (
      !id ||
      !window.confirm(
        `Delete “${event.title || event.name}”? This cannot be undone.`,
      )
    )
      return;
    setNotice("");
    setError("");
    try {
      await api.deleteEvent(id);
      setEvents((current) =>
        current.filter((item) => (item._id || item.id) !== id),
      );
      setNotice("Event deleted.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Manage events and view registrations.
            </p>
          </div>
          <Button
            onClick={() => {
              setError("");
              setIsModalOpen(true);
            }}
          >
            Create event
          </Button>
        </div>
        {notice && (
          <div
            className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700"
            role="status"
          >
            {notice}
          </div>
        )}
        {error && (
          <div
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}
        <p className="mt-6 text-sm text-slate-600">
          Published events: {events.length}
        </p>
        {loading && <Loading label="Loading events..." />}
        {!loading && events.length === 0 && !error && (
          <div className="mt-4 rounded-xl border bg-white p-6 text-slate-600">
            <p>No events have been created yet.</p>
            <Button onClick={() => setIsModalOpen(true)}>Create event</Button>
          </div>
        )}
        {!loading && events.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {events.map((event) => (
              <article
                className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:p-6"
                key={event._id || event.id}
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {event.title || event.name || "Untitled event"}
                  </h2>
                  <p className="mt-2 text-slate-600">
                    {event.date
                      ? new Intl.DateTimeFormat(undefined, {
                          dateStyle: "medium",
                        }).format(new Date(event.date))
                      : "Date to be announced"}{" "}
                    <span aria-hidden="true">·</span>{" "}
                    {event.location || "Location to be announced"}
                  </p>
                </div>
                <Button variant="danger" onClick={() => deleteEvent(event)}>
                  Delete
                </Button>
              </article>
            ))}
          </div>
        )}
        <Modal
          isOpen={isModalOpen}
          title="Create an event"
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={createEvent} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block font-medium" htmlFor="event-title">
                Event name
              </label>
              <input
                id="event-title"
                name="title"
                value={form.title}
                onChange={updateField}
                required
                maxLength={100}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                className="mb-1 block font-medium"
                htmlFor="event-description"
              >
                Description
              </label>
              <textarea
                id="event-description"
                name="description"
                value={form.description}
                onChange={updateField}
                rows="4"
                required
                maxLength={1000}
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium" htmlFor="event-date">
                  Date and time
                </label>
                <input
                  id="event-date"
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={updateField}
                  required
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  className="mb-1 block font-medium"
                  htmlFor="event-location"
                >
                  Location
                </label>
                <input
                  id="event-location"
                  name="location"
                  value={form.location}
                  onChange={updateField}
                  required
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  className="mb-1 block font-medium"
                  htmlFor="event-category"
                >
                  Category
                </label>
                <input
                  id="event-category"
                  name="category"
                  value={form.category}
                  onChange={updateField}
                  placeholder="Workshop, music..."
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  className="mb-1 block font-medium"
                  htmlFor="event-capacity"
                >
                  Capacity
                </label>
                <input
                  id="event-capacity"
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={updateField}
                  min="1"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            {error && (
              <p className="text-red-600" role="alert">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish event"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}

export default AdminDashboard;
