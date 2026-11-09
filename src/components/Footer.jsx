import { Link } from "react-router-dom";
import { categories } from "../data/products.js";

// CONFIGURATION NOTE:
// Contact information below is intentionally omitted until verified details
// are supplied. Do not add placeholder phone numbers, addresses, or emails.
// Update VITE_CONTACT_EMAIL in .env once the verified address is available.

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="wrap">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="wordmark wordmark--footer">
              Nirvana Impex
            </Link>
            <p>
              Supplier of tissue paper, biohazard bags, toilet rolls and paper pouches
              to businesses.
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h4>Company</h4>
            <nav className="footer-links" aria-label="Company pages">
              <Link to="/about">About Us</Link>
              <Link to="/products">Products</Link>
              <Link to="/enquiry">Enquire</Link>
            </nav>
          </div>

          {/* Products */}
          <div className="footer-col">
            <h4>Products</h4>
            <nav className="footer-links" aria-label="Product categories">
              {categories.map((c) => (
                <Link key={c.id} to={`/products?category=${c.id}`}>
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Location & Contact</h4>
            <p className="footer-contact-note">
              Hockey Stadium Rd, opp. LP School,<br />
              Lalmati, Guwahati, Assam 781040<br />
              Email: <a href="mailto:nirvanaimpex11@gmail.com" style={{ color: "rgba(255,255,255,.75)" }}>nirvanaimpex11@gmail.com</a><br />
              WhatsApp: <a href="https://wa.me/917903221659" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,.75)" }}>+91 79032 21659</a>
            </p>
          </div>
        </div>

        <div className="footer-base">
          <p>© {year} Nirvana Impex. All rights reserved.</p>
          <p>
            Paper products for businesses. · <Link to="/admin" style={{ color: "rgba(255,255,255,.45)", textDecoration: "underline" }}>Admin Portal</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
