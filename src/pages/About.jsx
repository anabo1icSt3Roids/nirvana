import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function About() {
  useEffect(() => {
    document.title = "About Us | Nirvana Impex";
  }, []);

  return (
    <>
      {/* ── Page hero ── */}
      <div className="page-hero" aria-label="About page introduction">
        <div className="wrap">
          <span className="label">About Nirvana Impex</span>
          <h1>A trusted name in biomedical waste collection & commercial paper supply.</h1>
          <p className="lead">
            Established in 2020 and headquartered in Guwahati, Assam, Nirvana Impex operates under the guidance of Mr. Gautam Pradhan, serving 50+ B2B clients with sustainable waste management and quality commercial paper solutions.
          </p>
        </div>
      </div>

      {/* ── Company Story ── */}
      <section className="section section--white" aria-labelledby="story-h">
        <div className="wrap split">
          <div>
            <span className="label" style={{ display: "block", marginBottom: ".75rem" }}>Our Company</span>
            <h2 id="story-h">Fostering strong B2B connections across Northeast India & beyond</h2>
            <p>
              Welcome to <strong>Nirvana Impex</strong>, a trusted name in the biomedical waste collection and biohazard garbage bag industry. With over a decade of industry expertise, we have proudly served more than 50 satisfied clients, ensuring safe, compliant, and reliable waste management solutions.
            </p>
            <p>
              Based in Northeast India, our focus has always been on fostering strong B2B connections and promoting sustainable, eco-friendly practices. Every product in our catalogue—from biohazard liners to virgin-grade tissue papers—is selected to meet rigorous performance standards for hospitals, laboratories, hotels, and commercial facilities.
            </p>
            <p>
              As we look to the future, we are expanding our supply operations across India and extending into manufacturing to provide superior products and meet the growing demands of our business clients.
            </p>
          </div>
          <div className="split__image">
            <div className="img-frame" style={{ aspectRatio: "4 / 3", borderRadius: "var(--r)", overflow: "hidden" }}>
              <img
                src="/images/about/warehouse.jpg"
                alt="Nirvana Impex Warehouse and Inventory Storage in Guwahati"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Leadership & Eco-Friendly Vision ── */}
      <section className="section" aria-labelledby="leadership-h">
        <div className="wrap split split--flip">
          <div className="split__image">
            <div className="img-frame" style={{ aspectRatio: "4 / 5", borderRadius: "var(--r)", overflow: "hidden", maxWidth: "380px", margin: "0 auto" }}>
              <img
                src="/images/about/gautam-pradhan.jpg"
                alt="Mr. Gautam Pradhan - Founder & CEO of Nirvana Impex"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
          </div>
          <div>
            <span className="label" style={{ display: "block", marginBottom: ".75rem" }}>Leadership & Vision</span>
            <h2 id="leadership-h">Led by Mr. Gautam Pradhan</h2>
            <p>
              Under the guidance of <strong>Mr. Gautam Pradhan</strong>, Nirvana Impex continues to innovate and prioritize sustainability across all supply lines.
            </p>
            <p>
              We offer an extensive range that includes biomedical waste collection bags, biodegradable garbage bags, commercial toilet rolls, and tissue papers, with options for both virgin and recycled materials. Special orders for biodegradable and corn-starch plastic bags further highlight our dedication to eco-friendly, compliant containment solutions.
            </p>
            <p>
              Our mission is to create a cleaner, safer, and healthier environment by providing reliable products, transparent communication, and timely delivery.
            </p>
          </div>
        </div>
      </section>

      {/* ── Verified Factsheet ── */}
      <section className="section section--white" aria-labelledby="factsheet-h">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="label" style={{ display: "block", marginBottom: ".5rem" }}>Company Profile</span>
              <h2 id="factsheet-h">Company Factsheet</h2>
            </div>
          </div>
          <p style={{ color: "var(--mid)", maxWidth: "680px", marginBottom: "1.5rem" }}>
            Verified commercial registration and business profile for Nirvana Impex as listed on national trade and regulatory directories.
          </p>

          <dl className="factsheet-grid">
            <div className="factsheet-item">
              <dt>Nature of Business</dt>
              <dd>Trader · Wholesaler · Distributor</dd>
            </div>
            <div className="factsheet-item">
              <dt>Founder & CEO</dt>
              <dd>Mr. Gautam Pradhan</dd>
            </div>
            <div className="factsheet-item">
              <dt>Year of Establishment</dt>
              <dd>2020</dd>
            </div>
            <div className="factsheet-item">
              <dt>Legal Status</dt>
              <dd>Proprietorship</dd>
            </div>
            <div className="factsheet-item">
              <dt>Total Employees</dt>
              <dd>Up to 10 People</dd>
            </div>
            <div className="factsheet-item">
              <dt>Client Base</dt>
              <dd>50+ Satisfied B2B Clients</dd>
            </div>
            <div className="factsheet-item">
              <dt>Registered Location</dt>
              <dd>Kahilipara, Guwahati, Assam - 781019</dd>
            </div>
            <div className="factsheet-item">
              <dt>GST Registration No.</dt>
              <dd>18AKCPP8029J3ZQ</dd>
            </div>
            <div className="factsheet-item">
              <dt>Primary Banker</dt>
              <dd>Bank of Baroda</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── Infrastructure & Certifications Album ── */}
      <section className="section" aria-labelledby="infrastructure-h">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="label" style={{ display: "block", marginBottom: ".5rem" }}>Infrastructure & Compliance</span>
              <h2 id="infrastructure-h">Facilities & Certifications</h2>
            </div>
          </div>

          <div className="gallery-grid">
            <div className="gallery-card">
              <div className="gallery-card__img">
                <img src="/images/about/warehouse.jpg" alt="Warehouse Storage Facility" loading="lazy" />
              </div>
              <div className="gallery-card__caption">
                <h3>Warehouse Unit</h3>
                <p>Bulk inventory storage and staged order dispatch facility in Guwahati.</p>
              </div>
            </div>

            <div className="gallery-card">
              <div className="gallery-card__img">
                <img src="/images/about/production-facility.jpg" alt="Production Facility & Machinery" loading="lazy" />
              </div>
              <div className="gallery-card__caption">
                <h3>Production Facility</h3>
                <p>Equipped for efficient packaging, sealing, and material inspection.</p>
              </div>
            </div>

            <div className="gallery-card">
              <div className="gallery-card__img">
                <img src="/images/about/manufacturing-unit.jpg" alt="Manufacturing and Processing Unit" loading="lazy" />
              </div>
              <div className="gallery-card__caption">
                <h3>Manufacturing Unit</h3>
                <p>Infrastructure supporting expanding manufacturing and supply capacities.</p>
              </div>
            </div>

            <div className="gallery-card">
              <div className="gallery-card__img">
                <img src="/images/about/infrastructure.jpg" alt="Operational Sales Office" loading="lazy" />
              </div>
              <div className="gallery-card__caption">
                <h3>Office Infrastructure</h3>
                <p>Administrative headquarters coordinating client orders and logistics.</p>
              </div>
            </div>

            <div className="gallery-card">
              <div className="gallery-card__img">
                <img src="/images/about/msme-certificate.jpg" alt="MSME Registration Certificate" loading="lazy" />
              </div>
              <div className="gallery-card__caption">
                <h3>MSME / Udyam Certified</h3>
                <p>Officially registered under the Ministry of Micro, Small and Medium Enterprises.</p>
              </div>
            </div>

            <div className="gallery-card">
              <div className="gallery-card__img">
                <img src="/images/about/fssai-certificate.jpg" alt="FSSAI Registration Certificate" loading="lazy" />
              </div>
              <div className="gallery-card__caption">
                <h3>FSSAI Compliant</h3>
                <p>Compliant food safety standards for food-grade paper packaging products.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Custom Printing Capabilities ── */}
      <section className="section section--white" aria-labelledby="custom-h">
        <div className="wrap split">
          <div className="split__image">
            <div className="img-frame" style={{ aspectRatio: "4 / 3", borderRadius: "var(--r)", overflow: "hidden" }}>
              <img
                src="/images/products/custom-logo-printed-tissue.jpg"
                alt="Custom Logo Printed Tissue Paper Sample by Nirvana Impex"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
          <div>
            <span className="label" style={{ display: "block", marginBottom: ".75rem" }}>Customization</span>
            <h2 id="custom-h">Custom-Printed Tissue Paper</h2>
            <p>
              We provide custom logo and branding printing directly on commercial tissue papers. Send us your artwork and branding specifications, and we will advise on lead times, print options, and minimum order quantities.
            </p>
            <p>
              Custom printing enables retail businesses, luxury boutiques, hotels, and corporate events to elevate their unboxing experience with bespoke branded packaging.
            </p>
            <div className="btn-row">
              <Link to="/enquiry?product=tissue-paper-5&type=custom-print" className="btn btn--primary">
                Enquire about custom printing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-banner" aria-label="Enquiry call to action">
        <div className="wrap cta-banner__inner">
          <div>
            <h2>Ready to discuss your supply requirements?</h2>
            <p className="lead" style={{ opacity: 0.9, marginTop: ".35rem" }}>
              Connect directly with our Guwahati team for quotations and order specifications.
            </p>
          </div>
          <div className="btn-row" style={{ marginTop: 0 }}>
            <Link to="/products" className="btn btn--light">Browse products</Link>
            <Link to="/enquiry" className="btn btn--ghost-light">Enquire now</Link>
          </div>
        </div>
      </section>
    </>
  );
}
