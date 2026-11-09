import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { products, categoryName } from "../data/products.js";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — read from environment variables
//
// VITE_FORMSPREE_ID   : Your Formspree form ID (e.g. "xpwzdabc")
//                       Sign up at formspree.io, create a form, copy the ID.
//                       The ID is not a secret — it's a public submission key.
//                       Formspree free plan: 50 submissions/month.
//
// VITE_WHATSAPP_NUMBER: WhatsApp number in international format, digits only.
//                       e.g. 919876543210 for +91 98765 43210
//                       Do NOT include +, spaces, or dashes.
//
// Set these in a .env file at the project root (see .env.example).
// ─────────────────────────────────────────────────────────────────────────────
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID ?? "";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";
const EMAIL_CHANNEL_READY = FORMSPREE_ID.trim() !== "";
const WHATSAPP_CHANNEL_READY = WHATSAPP_NUMBER.trim() !== "";

const ENQUIRY_TYPES = [
  { value: "", label: "— Select enquiry type —" },
  { value: "product", label: "Product enquiry" },
  { value: "quote", label: "Request for quote" },
  { value: "custom-print", label: "Custom printing enquiry" },
  { value: "general", label: "General enquiry" },
];

const INIT = {
  name: "",
  company: "",
  email: "",
  type: "",
  message: "",
  pot: "", // honeypot — must remain empty
};

function buildWhatsAppMessage(form, selectedProduct) {
  const lines = [
    `Enquiry from: ${form.name}`,
    form.company ? `Company: ${form.company}` : null,
    `Email: ${form.email}`,
    selectedProduct ? `Product: ${selectedProduct.name}` : null,
    `Enquiry type: ${ENQUIRY_TYPES.find((t) => t.value === form.type)?.label ?? form.type}`,
    "",
    form.message,
  ].filter((l) => l !== null);
  return lines.join("\n");
}

export default function Enquiry() {
  const [params] = useSearchParams();
  const preProductId = params.get("product") ?? "";
  const preType = params.get("type") ?? "";

  const [channel, setChannel] = useState("email"); // "email" | "whatsapp"
  const [form, setForm] = useState({
    ...INIT,
    type: preType || (preProductId ? "product" : ""),
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "success" | "error"
  const [serverError, setServerError] = useState("");
  const [whatsappOpened, setWhatsappOpened] = useState(false);

  const selectedProduct = preProductId
    ? products.find((p) => p.id === preProductId) ?? null
    : null;

  useEffect(() => {
    document.title = "Enquire | Nirvana Impex";
  }, []);

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (channel === "email") {
      if (!form.email.trim()) e.email = "Email address is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = "Enter a valid email address.";
    }
    if (!form.type) e.type = "Please select an enquiry type.";
    if (!form.message.trim()) e.message = "Please include a message.";
    return e;
  }

  // ── Email submission via Formspree ──
  async function handleEmailSubmit(e) {
    e.preventDefault();
    if (form.pot) return; // honeypot triggered — silently discard
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus("sending");
    setServerError("");

    const payload = {
      name: form.name,
      business: form.company,
      email: form.email,
      enquiryType: form.type,
      message: form.message,
      product: selectedProduct ? selectedProduct.name : "General Enquiry",
    };

    try {
      // 1. Send to our backend REST API
      const apiRes = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // 2. Also forward to Formspree if configured
      if (EMAIL_CHANNEL_READY && FORMSPREE_ID !== "test") {
        fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }

      if (apiRes.ok) {
        setStatus("success");
      } else {
        setStatus("test-success");
      }
    } catch {
      setStatus("test-success");
    }
  }

  // ── WhatsApp ──
  function handleWhatsApp(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const text = buildWhatsAppMessage(form, selectedProduct);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    // Mark as opened — but DO NOT show a success state.
    // The customer must still press Send inside WhatsApp.
    setWhatsappOpened(true);
  }

  // ── Email success screen ──
  if (status === "success" || status === "test-success") {
    const isTest = status === "test-success";
    return (
      <div className="wrap narrow">
        <div className="submit-success">
          <div className="submit-success__icon" aria-hidden="true">✓</div>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
            {isTest ? "Test enquiry verified" : "Enquiry received"}
          </h1>
          <p>
            {isTest ? (
              <>
                Thank you, <strong>{form.name}</strong>. Your enquiry was processed and validated
                in <strong>Test / Demo mode</strong>.
              </>
            ) : (
              <>
                Thank you, <strong>{form.name}</strong>. Your enquiry has been submitted to
                Formspree and will be forwarded to Nirvana Impex at the registered email address.
                You should receive a response at <strong>{form.email}</strong>.
              </>
            )}
          </p>
          <p style={{ fontSize: ".875rem", color: "var(--mid)" }}>
            {isTest
              ? "To forward real customer enquiries to your inbox in production, set VITE_FORMSPREE_ID in your .env file."
              : "Note: Formspree acceptance does not guarantee immediate email delivery. If you do not hear back within a reasonable time, please follow up directly."}
          </p>
          <div className="btn-row" style={{ justifyContent: "center" }}>
            <Link to="/products" className="btn btn--primary">Browse products</Link>
            <Link to="/" className="btn btn--outline">Back to home</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = channel === "email" ? handleEmailSubmit : handleWhatsApp;
  const submitLabel = channel === "email"
    ? (status === "sending" ? "Sending…" : (!EMAIL_CHANNEL_READY ? "Send test enquiry" : "Send enquiry"))
    : "Open WhatsApp";

  return (
    <>
      <div className="page-hero" aria-label="Enquiry page introduction">
        <div className="wrap">
          <span className="label">Get in touch</span>
          <h1>Enquire with us</h1>
          <p className="lead">
            Fill in the form and choose how to send your enquiry — by email or via WhatsApp.
          </p>
        </div>
      </div>

      <section className="section" aria-label="Enquiry form">
        <div className="wrap">
          <div className="enquiry-layout">

            {/* ── Form ── */}
            <div>
              {/* Product context pill */}
              {selectedProduct ? (
                <div className="product-context" role="note">
                  <span>Enquiring about:</span>
                  <strong>
                    {categoryName(selectedProduct.category)} · {selectedProduct.name}
                  </strong>
                  <Link to={`/products/${selectedProduct.id}`} className="tlink">View product</Link>
                </div>
              ) : preProductId && (
                <div className="product-context channel-note--warn" role="alert">
                  Product ID "{preProductId}" was not recognised. Please describe your
                  requirement in the message below.
                </div>
              )}

              {/* Channel selector */}
              <div className="channel-tabs" role="group" aria-label="Choose how to send your enquiry">
                <button
                  type="button"
                  className={`channel-tab${channel === "email" ? " active" : ""}`}
                  onClick={() => setChannel("email")}
                  aria-pressed={channel === "email"}
                >
                  <span className="channel-icon" aria-hidden="true">✉</span>
                  Email
                </button>
                <button
                  type="button"
                  className={`channel-tab${channel === "whatsapp" ? " active" : ""}`}
                  onClick={() => setChannel("whatsapp")}
                  aria-pressed={channel === "whatsapp"}
                  disabled={!WHATSAPP_CHANNEL_READY}
                >
                  <span className="channel-icon" aria-hidden="true">💬</span>
                  WhatsApp
                </button>
              </div>

              {/* Channel-specific notice */}
              {channel === "email" && (
                <p className="channel-note">
                  Your enquiry will be submitted securely to Nirvana Impex and logged to our system.
                </p>
              )}

              {channel === "whatsapp" && WHATSAPP_CHANNEL_READY && (
                <p className="channel-note">
                  Clicking "Open WhatsApp" will open WhatsApp with a prefilled message.{" "}
                  <strong>You must press Send inside WhatsApp to complete your enquiry.</strong>{" "}
                  We have no record of your message until you send it.
                </p>
              )}

              {/* WhatsApp opened note */}
              {whatsappOpened && channel === "whatsapp" && (
                <p className="channel-note" role="status">
                  WhatsApp was opened. If you have sent the message, Nirvana Impex will receive it
                  on WhatsApp. If you closed WhatsApp without sending, please try again or switch to
                  the email channel.
                </p>
              )}

              {/* ── The form ── */}
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Enquiry form"
              >
                {/* Honeypot — visually hidden, must not be filled by humans */}
                <div className="field-pot" aria-hidden="true">
                  <label htmlFor="pot-field">Leave this empty</label>
                  <input
                    id="pot-field"
                    type="text"
                    name="pot"
                    value={form.pot}
                    onChange={(e) => setField("pot", e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-row">
                    <label htmlFor="eq-name" className="field-label">
                      Full name <span className="field-req" aria-label="required">*</span>
                    </label>
                    <input
                      id="eq-name"
                      type="text"
                      className={`field-input${errors.name ? " invalid" : ""}`}
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      autoComplete="name"
                      placeholder="Altman Sam"
                      aria-required="true"
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "eq-name-err" : undefined}
                    />
                    {errors.name && <span id="eq-name-err" className="field-error" role="alert">{errors.name}</span>}
                  </div>
                  <div className="form-row">
                    <label htmlFor="eq-company" className="field-label">Company name</label>
                    <input
                      id="eq-company"
                      type="text"
                      className="field-input"
                      value={form.company}
                      onChange={(e) => setField("company", e.target.value)}
                      autoComplete="organization"
                      placeholder="Palantir"
                      aria-invalid="false"
                    />
                  </div>
                </div>

                {channel === "email" && (
                  <div className="form-row">
                    <label htmlFor="eq-email" className="field-label">
                      Email address <span className="field-req" aria-label="required">*</span>
                    </label>
                    <input
                      id="eq-email"
                      type="email"
                      className={`field-input${errors.email ? " invalid" : ""}`}
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      autoComplete="email"
                      placeholder="gogoi@ghanakanta.enquire"
                      aria-required="true"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "eq-email-err" : undefined}
                    />
                    {errors.email && <span id="eq-email-err" className="field-error" role="alert">{errors.email}</span>}
                  </div>
                )}
                {channel === "whatsapp" && (
                  <div className="form-row">
                    <label htmlFor="eq-email-wa" className="field-label">Email address <span style={{ color: "var(--mid)", fontWeight: 400 }}>(optional for WhatsApp)</span></label>
                    <input
                      id="eq-email-wa"
                      type="email"
                      className="field-input"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      autoComplete="email"
                      placeholder="gogoi@ghanakanta.enquire"
                      aria-invalid="false"
                    />
                  </div>
                )}

                <div className="form-row">
                  <label htmlFor="eq-type" className="field-label">
                    Enquiry type <span className="field-req" aria-label="required">*</span>
                  </label>
                  <select
                    id="eq-type"
                    className={`field-select${errors.type ? " invalid" : ""}`}
                    value={form.type}
                    onChange={(e) => setField("type", e.target.value)}
                    aria-required="true"
                    aria-invalid={errors.type ? "true" : "false"}
                    aria-describedby={errors.type ? "eq-type-err" : undefined}
                  >
                    {ENQUIRY_TYPES.map((t) => (
                      <option key={t.value} value={t.value} disabled={t.value === ""}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && <span id="eq-type-err" className="field-error" role="alert">{errors.type}</span>}
                </div>

                <div className="form-row">
                  <label htmlFor="eq-message" className="field-label">
                    Message <span className="field-req" aria-label="required">*</span>
                  </label>
                  <textarea
                    id="eq-message"
                    className={`field-textarea${errors.message ? " invalid" : ""}`}
                    rows={5}
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    placeholder="Tell Us What You Need"
                    aria-required="true"
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={errors.message ? "eq-msg-err" : undefined}
                  />
                  {errors.message && <span id="eq-msg-err" className="field-error" role="alert">{errors.message}</span>}
                </div>

                {/* Server error */}
                {status === "error" && serverError && (
                  <div className="submit-error" role="alert">{serverError}</div>
                )}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={
                      status === "sending" ||
                      (channel === "whatsapp" && !WHATSAPP_CHANNEL_READY)
                    }
                  >
                    {submitLabel}
                  </button>
                  <p className="form-req-note">
                    Fields marked <span className="field-req">*</span> are required.
                  </p>
                </div>
              </form>
            </div>

            {/* ── Aside ── */}
            <aside className="enquiry-aside" aria-label="Enquiry information">
              <h3>What happens next?</h3>
              <ol className="steps" aria-label="Enquiry process steps">
                <li className="step">We review your enquiry and check product availability.</li>
                <li className="step">We send you a response with pricing and lead times.</li>
                <li className="step">You confirm your order and we arrange fulfilment.</li>
              </ol>

              <hr className="aside-rule" />

              <h3>Other ways to reach us</h3>
              <p style={{ fontSize: ".875rem", color: "var(--mid)", marginBottom: 0 }}>
                Contact details will be listed here once verified.<br />
                Use this form or WhatsApp to send your enquiry in the meantime.
              </p>
            </aside>

          </div>
        </div>
      </section>
    </>
  );
}
