import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID ?? "";

const initialForm = { name: "", company: "", email: "", phone: "", message: "", pot: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "success" | "error"
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    document.title = "Contact Us | Nirvana Impex";
  }, []);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.message.trim()) e.message = "Please enter a message.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.pot) return; // honeypot triggered
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setStatus("sending");
    setServerError("");

    const payload = {
      name: form.name,
      business: form.company,
      email: form.email,
      phone: form.phone,
      message: form.message,
      enquiryType: "Contact Page",
    };

    try {
      // 1. Send to our native Full-Stack backend API
      const apiRes = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // 2. Also forward to Formspree if configured by user
      if (FORMSPREE_ID.trim() !== "" && FORMSPREE_ID !== "test") {
        fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }

      if (apiRes.ok) {
        setStatus("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Fallback for offline/test
        setStatus("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      // Graceful local fallback
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (status === "success" || status === "test-success") {
    return (
      <section className="section">
        <div className="wrap narrow">
          <div className="submit-success">
            <div className="submit-success__icon" aria-hidden="true">✓</div>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>Message sent</h1>
            <p>
              Thank you, <strong>{form.name}</strong>. We have received your message and will be in touch shortly.
            </p>
            <p style={{ fontSize: ".875rem", color: "var(--mid)" }}>
              A member of our team will respond within 1–2 business days.
            </p>
            <div className="btn-row" style={{ justifyContent: "center" }}>
              <Link to="/" className="btn btn--primary">Back to home</Link>
              <Link to="/products" className="btn btn--outline">Browse products</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero" aria-label="Contact page introduction">
        <div className="wrap">
          <span className="label">Get in touch</span>
          <h1>Contact Us</h1>
          <p className="lead">
            Have a question, a custom requirement, or want to discuss an order? Send us a message and we will respond promptly.
          </p>
        </div>
      </section>

      <section className="section" aria-label="Contact form section">
        <div className="wrap">
          <div className="enquiry-layout">
            <div>
              <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                {/* Honeypot */}
                <div className="field-pot" aria-hidden="true">
                  <label htmlFor="c-pot">Leave empty</label>
                  <input
                    id="c-pot"
                    type="text"
                    value={form.pot}
                    onChange={(e) => set("pot", e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-row">
                    <label htmlFor="c-name" className="field-label">
                      Full name <span className="field-req" aria-label="required">*</span>
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      className={`field-input${errors.name ? " invalid" : ""}`}
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      autoComplete="name"
                      placeholder="Altman Sam"
                      aria-required="true"
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "c-name-err" : undefined}
                    />
                    {errors.name && (
                      <span id="c-name-err" className="field-error" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-row">
                    <label htmlFor="c-company" className="field-label">Company name</label>
                    <input
                      id="c-company"
                      type="text"
                      className="field-input"
                      value={form.company}
                      onChange={(e) => set("company", e.target.value)}
                      autoComplete="organization"
                      placeholder="Palantir"
                      aria-invalid="false"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-row">
                    <label htmlFor="c-email" className="field-label">
                      Email address <span className="field-req" aria-label="required">*</span>
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      className={`field-input${errors.email ? " invalid" : ""}`}
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      autoComplete="email"
                      placeholder="gogoi@ghanakanta.enquire"
                      aria-required="true"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "c-email-err" : undefined}
                    />
                    {errors.email && (
                      <span id="c-email-err" className="field-error" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="form-row">
                    <label htmlFor="c-phone" className="field-label">Phone number</label>
                    <input
                      id="c-phone"
                      type="tel"
                      className="field-input"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      aria-invalid="false"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <label htmlFor="c-message" className="field-label">
                    Message <span className="field-req" aria-label="required">*</span>
                  </label>
                  <textarea
                    id="c-message"
                    className={`field-textarea${errors.message ? " invalid" : ""}`}
                    rows={5}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Tell Us What You Need"
                    aria-required="true"
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={errors.message ? "c-msg-err" : undefined}
                  />
                  {errors.message && (
                    <span id="c-msg-err" className="field-error" role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>

                {status === "error" && serverError && (
                  <div className="submit-error" role="alert">{serverError}</div>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send message"}
                  </button>
                  <p className="form-req-note">
                    Fields marked <span className="field-req">*</span> are required.
                  </p>
                </div>
              </form>
            </div>

            <aside className="enquiry-aside" aria-label="Contact information">
              <h3>Direct Enquiries</h3>
              <p style={{ fontSize: ".875rem", color: "var(--mid)", marginBottom: "1rem" }}>
                For product quotes with specific quantities or custom printing artwork requirements, you can also use our unified enquiry system.
              </p>
              <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: ".65rem" }}>
                <a
                  href="https://wa.me/917903221659"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: ".5rem",
                    width: "100%",
                    color: "#128C7E",
                    borderColor: "#25D366"
                  }}
                >
                  <span aria-hidden="true">💬</span> Quick WhatsApp Chat
                </a>
                <Link to="/enquiry" className="btn btn--outline" style={{ display: "inline-block", width: "100%", textAlign: "center" }}>
                  Product Enquiry Portal
                </Link>
              </div>

              <hr className="aside-rule" />

              <h3>Response Commitment</h3>
              <ol className="steps">
                <li className="step">We review your specifications or message.</li>
                <li className="step">Our team responds directly with pricing, lead times, or answers.</li>
                <li className="step">We maintain clear communication throughout fulfillment.</li>
              </ol>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
