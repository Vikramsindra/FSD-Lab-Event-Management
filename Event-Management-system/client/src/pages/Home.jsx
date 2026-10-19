import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <section className="bg-slate-100 px-4 py-12 text-center sm:px-6 sm:py-20">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl md:text-6xl">
          Discover Amazing Events
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Find exciting events, connect with people, and register for
          experiences that interest you.
        </p>
        <Link
          to="/events"
          className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Explore Events
        </Link>
      </section>

      <section className="bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Find Your Next Experience
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Explore technology workshops, conferences, festivals, and other
          exciting events happening near you.
        </p>
      </section>
    </div>
  );
}
export default Home;
