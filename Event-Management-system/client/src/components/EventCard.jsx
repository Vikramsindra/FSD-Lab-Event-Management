import { useState } from "react";
import Button from "./Button";
import useAuth from "../hooks/useAuth";
import { api } from "../services/api";

function formatDate(value) {
  if (!value) return "Date to be announced";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function EventCard({ event, onRegistered }) {
  const { user } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const title = event.title || event.name || "Untitled event";
  const id = event._id || event.id;

  async function register() {
    if (!id || isRegistered) return;
    setIsRegistering(true);
    setError("");
    setMessage("");
    try {
      if (user) {
        await api.registerForEvent(id);
        setMessage("You're registered. See you there.");
      } else {
        setMessage("Registration saved for this session.");
      }
      setIsRegistered(true);
      onRegistered?.();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <article className="flex h-full flex-col rounded-xl border bg-white p-4 shadow-md sm:p-6">
      <h2 className="break-words text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-600">
        {event.description || "More details will be announced soon."}
      </p>
      <p className="mt-3 text-slate-600">
        Date: {formatDate(event.date || event.startDate)}
      </p>
      <p className="text-slate-600">
        Location: {event.location || "Location to be announced"}
      </p>
      {event.time && <p className="text-slate-600">Time: {event.time}</p>}

      <div className="mt-4 flex flex-col items-start gap-3">
        <Button
          className="w-full sm:w-auto"
          onClick={register}
          disabled={isRegistering || isRegistered || !id}
        >
          {isRegistering
            ? "Registering..."
            : isRegistered
              ? "Registered"
              : "Register"}
        </Button>
        {message && (
          <p className="font-semibold text-green-600" role="status">
            {message}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}

export default EventCard;
