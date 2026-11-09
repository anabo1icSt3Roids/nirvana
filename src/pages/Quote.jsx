import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { products, categoryName } from "../data/products.js";

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  product: "",
  customPrint: false,
  quantity: "",
  message: "",
};

export default function Quote() {
  const [params] = useSearchParams();
  const preProduct = params.get("product") || "";
  const preCustom = params.get("custom") === "1";

  const [form, setForm] = useState({
    ...initialForm,
    product: preProduct,
    customPrint: preCustom,
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => { document.title = "Request a Quote | Nirvana Impex"; }, []);

  const selectedProduct = products.find((p) => p.id === form.product);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.product) e.product = "Please select a product.";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <section className="section">
        <div className="wrap narrow" style={{ textAlign: "center", padding: "4rem 0" }}>
          <div className="success-icon" aria-hidden="true">✓</div>
          <h1>Quote request received</h1>
          <p>
            Thank you, <strong>{form.name}</strong>. We have received your request and will
            get back to you at <strong>{form.email}</strong> as soon as possible.
          </p>
          <div className="btn-row" style={{ justifyContent: "center" }}>
            <Link to="/products" className="btn">Browse more products</Link>
            <Link to="/" className="btn ghost">Back to home</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Get in touch</p>
          <h1>Request a Quote</h1>
          <p className="lead">
            Fill in the form below and we will get back to you with pricing and availability.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="form-layout">
            <form className="quote-form" onSubmit={handleSubmit} noValidate aria-label="Quote request form">

              {/* Contact details */}
              <fieldset className="form-fieldset">
                <legend className="form-legend">Your details</legend>
                <div className="form-row two-col">
                  <div className="form-group">
                    <label htmlFor="q-name" className="form-label">Full name <span className="req">*</span></label>
                    <input
                      id="q-name" type="text" className={"form-input" + (errors.name ? " error" : "")}
                      value={form.name} onChange={(e) => set("name", e.target.value)}
                      autoComplete="name" placeholder="Jane Smith"
                      aria-required="true"
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "q-name-err" : undefined}
                    />
                    {errors.name && <span id="q-name-err" className="form-error" role="alert">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="q-company" className="form-label">Company name</label>
                    <input
                      id="q-company" type="text" className="form-input"
                      value={form.company} onChange={(e) => set("company", e.target.value)}
                      autoComplete="organization" placeholder="Acme Ltd"
                      aria-invalid="false"
                    />
                  </div>
                </div>
                <div className="form-row two-col">
                  <div className="form-group">
                    <label htmlFor="q-email" className="form-label">Email address <span className="req">*</span></label>
                    <input
                      id="q-email" type="email" className={"form-input" + (errors.email ? " error" : "")}
                      value={form.email} onChange={(e) => set("email", e.target.value)}
                      autoComplete="email" placeholder="jane@company.com"
                      aria-required="true"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "q-email-err" : undefined}
                    />
                    {errors.email && <span id="q-email-err" className="form-error" role="alert">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="q-phone" className="form-label">Phone number</label>
                    <input
                      id="q-phone" type="tel" className="form-input"
                      value={form.phone} onChange={(e) => set("phone", e.target.value)}
                      autoComplete="tel" placeholder="+91 98765 43210"
                      aria-invalid="false"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Product */}
              <fieldset className="form-fieldset">
                <legend className="form-legend">Product enquiry</legend>
                <div className="form-group">
                  <label htmlFor="q-product" className="form-label">Product <span className="req">*</span></label>
                  <select
                    id="q-product"
                    className={"form-input form-select" + (errors.product ? " error" : "")}
                    value={form.product}
                    onChange={(e) => set("product", e.target.value)}
                    aria-required="true"
                    aria-invalid={errors.product ? "true" : "false"}
                    aria-describedby={errors.product ? "q-product-err" : undefined}
                  >
                    <option value="">— Select a product —</option>
                    {products.filter((p) => p.published).map((p) => (
                      <option key={p.id} value={p.id}>
                        {categoryName(p.category)} · {p.name}
                      </option>
                    ))}
                  </select>
                  {errors.product && <span id="q-product-err" className="form-error" role="alert">{errors.product}</span>}
                </div>

                {selectedProduct?.customisable && (
                  <div className="form-group">
                    <label className="form-checkbox-label">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={form.customPrint}
                        onChange={(e) => set("customPrint", e.target.checked)}
                      />
                      I am interested in custom printing on this product
                    </label>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="q-qty" className="form-label">Approximate quantity / order size</label>
                  <input
                    id="q-qty" type="text" className="form-input"
                    value={form.quantity} onChange={(e) => set("quantity", e.target.value)}
                    placeholder="e.g. 500 units per month"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="q-message" className="form-label">Additional requirements or message</label>
                  <textarea
                    id="q-message" className="form-input form-textarea"
                    rows={5} value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Tell us anything else we should know about your requirements…"
                  />
                </div>
              </fieldset>

              <div className="form-footer">
                <p className="form-note">Fields marked <span className="req">*</span> are required.</p>
                <button type="submit" className="btn" style={{ minWidth: "180px" }}>
                  Send quote request
                </button>
              </div>
            </form>

            {/* Sidebar */}
            <aside className="form-aside">
              <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>What happens next?</h2>
              <ol className="steps-list">
                <li>We review your request and check availability.</li>
                <li>We send you a quote with pricing and lead times.</li>
                <li>You confirm, and we arrange fulfilment.</li>
              </ol>
              <hr className="aside-divider" />
              <h2 style={{ fontSize: "1.1rem", marginBottom: ".8rem" }}>Prefer to call or email?</h2>
              <p style={{ color: "var(--slate)", fontSize: ".95rem" }}>
                Contact details will be added here once verified.
              </p>
              <Link to="/contact" className="text-link">Go to Contact page →</Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
