import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link to="/" className="wordmark" aria-label="Nirvana Impex — home">
          <img
            src="/images/logo.jpg"
            alt=""
            aria-hidden="true"
            className="wordmark__logo"
          />
          Nirvana Impex
        </Link>

        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav
          id="main-nav"
          className={`site-nav${open ? " open" : ""}`}
          aria-label="Main navigation"
        >
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/enquiry"
            className={({ isActive }) => `nav-enquire${isActive ? " active" : ""}`}
          >
            Enquire
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
