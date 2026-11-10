import { useEffect } from "react";
import { Link } from "react-router-dom";
import { categories, products, countIn, categoryName } from "../data/products.js";
import ProductImage from "../components/ProductImage.jsx";

export default function Home() {
  useEffect(() => { document.title = "Nirvana Impex"; }, []);

  const featured = products.filter((p) => p.featured && p.published).slice(0, 4);

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero hero--centered" aria-label="Introduction">
        <div className="wrap">
          <div className="hero-inner hero-inner--centered">
            <div className="hero-text hero-text--centered">
              <span className="label">HYGIENE & PACKAGING PRODUCTS SUPPLIER</span>
              <h1>Reliable hygiene and packaging supplies for businesses.</h1>
              <p className="lead">
                From tissue paper and paper cups to packaging and hygiene essentials, we supply businesses with products they can depend on.
              </p>
              <div className="btn-row btn-row--centered">
                <Link to="/products" className="btn btn--primary">Explore products</Link>
                <Link to="/enquiry" className="btn btn--outline">Enquire with us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we supply (category index) ── */}
      <section className="section section--white" aria-labelledby="cat-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="cat-h">What we supply</h2>
            <Link to="/products" className="tlink tlink--fwd">View all products</Link>
          </div>
          <nav aria-label="Product categories">
            <ul className="cat-rows" role="list">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/products?category=${c.id}`} className="cat-row">
                    <span className="cat-row__name">{c.name}</span>
                    <span className="cat-row__blurb">{c.blurb}</span>
                    <span className="cat-row__count">
                      {countIn(c.id)} {countIn(c.id) === 1 ? "product" : "products"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* ── Featured products ── */}
      {featured.length > 0 && (
        <section className="section" aria-labelledby="feat-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="feat-h">Featured products</h2>
              <Link to="/products" className="tlink tlink--fwd">All products</Link>
            </div>
            <div className="product-grid">
              {featured.map((p) => (
                <article key={p.id}>
                  <Link to={`/products/${p.id}`} className="product-card" aria-label={`View ${p.name}`}>
                    <ProductImage product={p} ratio="4 / 3" className="product-card__image" />
                    <span className="label product-card__cat">{categoryName(p.category)}</span>
                    <h3 className="product-card__name">{p.name}</h3>
                    <p className="product-card__desc">{p.short}</p>
                  </Link>
                  <div className="product-card__links">
                    <Link to={`/products/${p.id}`} className="tlink">View product</Link>
                    <Link to={`/enquiry?product=${p.id}`} className="tlink">Enquire</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── About / company intro ── */}
      <section className="section section--white" aria-labelledby="about-h">
        <div className="wrap split split--wide">
          <div>
            <span className="label" style={{ display: "block", marginBottom: ".75rem" }}>About Nirvana Impex</span>
            <h2 id="about-h">A supplier focused on reliable, consistent delivery.</h2>
            <p>
              Nirvana Impex supplies tissue paper, biohazard bags, toilet rolls and paper pouches
              to businesses. We work with manufacturers who meet our standards for material quality
              and production reliability.
            </p>
            <p>
              Every product in our catalogue has been selected with business end-users in mind.
              Our aim is straightforward: reliable supply, clear communication, and products
              that perform as expected.
            </p>
            <div className="btn-row">
              <Link to="/about" className="btn btn--outline">About us</Link>
            </div>
          </div>
          <div className="split__image">
            <div className="img-frame" style={{ aspectRatio: "4 / 3", borderRadius: "var(--r)", overflow: "hidden" }}>
              <img
                src="/images/about/warehouse.jpg"
                alt="Nirvana Impex warehouse and supply operations"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Product capabilities ── */}
      <section className="section" aria-labelledby="cap-h">
        <div className="wrap">
          <h2 id="cap-h">Our product range</h2>
          <div className="cap-grid">
            <div className="cap-block">
              <div className="cap-block__num" aria-hidden="true">01</div>
              <h3>Tissue paper</h3>
              <p>Standard and custom-printed tissue paper for commercial use. Custom printing available on request.</p>
            </div>
            <div className="cap-block">
              <div className="cap-block__num" aria-hidden="true">02</div>
              <h3>Biohazard bags</h3>
              <p>Biohazard bags for healthcare, laboratory, and industrial waste management applications.</p>
            </div>
            <div className="cap-block">
              <div className="cap-block__num" aria-hidden="true">03</div>
              <h3>Toilet rolls</h3>
              <p>Toilet rolls for commercial and institutional use. Suitable for high-traffic environments.</p>
            </div>
            <div className="cap-block">
              <div className="cap-block__num" aria-hidden="true">04</div>
              <h3>Paper pouches</h3>
              <p>Paper pouch packaging for a variety of business packaging requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="cta-banner" aria-labelledby="cta-h">
        <div className="wrap cta-banner__inner">
          <div>
            <h2 id="cta-h">Tell us what your business needs.</h2>
            <p className="lead">
              Browse the catalogue or send us your requirements directly.
            </p>
          </div>
          <div className="btn-row" style={{ marginTop: 0 }}>
            <Link to="/enquiry" className="btn btn--light">Enquire now</Link>
            <Link to="/products" className="btn btn--ghost-light">Browse products</Link>
          </div>
        </div>
      </section>
    </>
  );
}
