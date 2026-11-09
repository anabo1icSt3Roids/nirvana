import { useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Enquiry from "./pages/Enquiry.jsx";
import Admin from "./pages/Admin.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Products from "./pages/Products.jsx";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function NotFound() {
  useEffect(() => { document.title = "Page not found | Nirvana Impex"; }, []);
  return (
    <section className="section" aria-label="Page not found">
      <div className="wrap narrow not-found">
        <span className="label">404</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginTop: ".5rem" }}>
          Page not found
        </h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link to="/" className="btn btn--primary">Back to home</Link>
          <Link to="/products" className="btn btn--outline">Browse products</Link>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <ScrollTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/enquiry" element={<Enquiry />} />

          {/* Legacy routes — client-side redirect to unified enquiry page.
              Carries query params forward so product pre-fill still works.
              Note: direct page refresh on /quote or /contact will 404 on a
              static host unless the host is configured to serve index.html
              for all paths. See deployment documentation. */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/quote" element={<Navigate to="/enquiry?type=quote" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
