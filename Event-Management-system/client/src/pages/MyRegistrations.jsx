import { useEffect, useState } from "react";
import Button from "../components/Button";
import Loading from "../components/Loading";
import useAuth from "../hooks/useAuth";
import { api, unwrapList } from "../services/api";

function displayDate(value) {
  if (!value) return "Date to be announced";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(date);
}

function MyRegistrations() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canceling, setCanceling] = useState("");

  async function loadRegistrations() {
    setLoading(true);
    setError("");
    try {
      setRegistrations(
        unwrapList(await api.getMyRegistrations(), "registrations"),
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    api
      .getMyRegistrations()
      .then((payload) => {
        if (active) setRegistrations(unwrapList(payload, "registrations"));
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

  async function cancelRegistration(registration) {
    const id = registration._id || registration.id;
    if (!id) return;
    setCanceling(id);
    setError("");
    try {
      await api.cancelRegistration(id);
      setRegistrations((current) =>
        current.filter((item) => (item._id || item.id) !== id),
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCanceling("");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          My Registrations
        </h1>
        <p className="mt-2 text-slate-600">
          {user ? (
            <>
              Welcome, <span className="font-semibold">{user.name}</span>. Your
              registered events will appear here.
            </>
          ) : (
            "Please log in to view your registrations."
          )}
        </p>
        {error && (
          <div
            className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
            role="alert"
          >
            <span>{error}</span>
            <Button variant="secondary" onClick={loadRegistrations}>
              Retry
            </Button>
          </div>
        )}
        {loading && <Loading label="Loading your registrations..." />}
        {!loading && !error && registrations.length === 0 && (
          <div className="mt-6 rounded-xl border bg-white p-6 text-slate-600">
            <p>You haven’t registered for an event yet.</p>
            <a
              className="mt-2 inline-block font-semibold text-indigo-600"
              href="/events"
            >
              Browse events
            </a>
          </div>
        )}
        {!loading && registrations.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {registrations.map((registration) => {
              const event = registration.event || registration;
              const id = registration._id || registration.id;
              return (
                <article
                  className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:p-6"
                  key={id || event._id}
                >
                  <h2 className="text-xl font-bold text-slate-900">
                    {event.title || event.name || "Untitled event"}
                  </h2>
                  <p className="text-slate-600">
                    {displayDate(event.date || event.startDate)}{" "}
                    <span aria-hidden="true">·</span>{" "}
                    {event.location || "Location to be announced"}
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => cancelRegistration(registration)}
                    disabled={canceling === id}
                  >
                    {canceling === id ? "Canceling..." : "Cancel"}
                  </Button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRegistrations;
