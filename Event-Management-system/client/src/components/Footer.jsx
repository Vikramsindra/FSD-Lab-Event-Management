import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#020d1d] text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 pb-8 md:grid-cols-[1.2fr_0.8fr_1fr] md:items-start">
          <div>
            <h3 className="mb-4 text-[2.1rem] font-extrabold tracking-tight text-white">
              EventHub
            </h3>
            <p className="max-w-xs text-base leading-7 text-slate-300">
              Discover unforgettable experiences and reserve your seat for the
              most exciting events in town.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-slate-300">
              Quick Links
            </h4>
            <ul className="space-y-3 text-base text-slate-200">
              <li>
                <Link to="/" className="transition hover:text-indigo-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="transition hover:text-indigo-400">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-slate-300">
              Contact
            </h4>
            <ul className="space-y-3 text-base text-slate-200">
              <li>Email: hello@eventhub.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Location: New York, NY</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700/80">
          <div className="mx-auto flex items-center justify-center px-6 py-4 text-sm text-slate-300">
            © 2026 EventHub. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
