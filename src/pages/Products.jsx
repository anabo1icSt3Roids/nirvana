import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { categories, products, categoryName } from "../data/products.js";
import ProductImage from "../components/ProductImage.jsx";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const activeCategory = params.get("category") || "all";

  useEffect(() => { document.title = "Products | Nirvana Impex"; }, []);

  // Preserve search value in URL if category is not changed
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!p.published) return false;
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          categoryName(p.category).toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, search]);

  function setCategory(id) {
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("category");
    else next.set("category", id);
    next.delete("search");
    setSearch("");
    setParams(next, { replace: true });
  }

  function clearAll() {
    setSearch("");
    setParams({}, { replace: true });
  }

  const isFiltered = activeCategory !== "all" || search.trim() !== "";

  return (
    <>
      {/* ── Page hero ── */}
      <div className="page-hero" aria-label="Products catalogue introduction">
        <div className="wrap">
          <span className="label">Catalogue</span>
          <h1>Our products</h1>
          <p className="lead">
            Browse our full range across four categories. Select any product to view
            details and enquire directly.
          </p>
        </div>
      </div>

      {/* ── Catalogue ── */}
      <section className="section" aria-label="Product catalogue">
        <div className="wrap">

          {/* Filter bar */}
          <div className="filter-bar" role="group" aria-label="Filter products">
            <div className="filter-tabs" role="list">
              <button
                role="listitem"
                className={`filter-tab${activeCategory === "all" ? " active" : ""}`}
                onClick={() => setCategory("all")}
                aria-pressed={activeCategory === "all"}
              >
                All products
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  role="listitem"
                  className={`filter-tab${activeCategory === c.id ? " active" : ""}`}
                  onClick={() => setCategory(c.id)}
                  aria-pressed={activeCategory === c.id}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <input
              type="search"
              className="search-input"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products by name or category"
            />
          </div>

          {/* Results summary + clear */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: ".5rem", marginBottom: "2rem" }}>
            <p className="results-count" aria-live="polite" aria-atomic="true">
              {filtered.length === 0
                ? "No products match."
                : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`
              }
            </p>
            {isFiltered && (
              <button className="tlink" onClick={clearAll} style={{ fontSize: ".8rem" }}>
                Clear filters
              </button>
            )}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="product-grid">
              {filtered.map((p) => (
                <article key={p.id}>
                  <Link to={`/products/${p.id}`} className="product-card" aria-label={`View ${p.name}`}>
                    <ProductImage product={p} ratio="4 / 3" className="product-card__image" />
                    <span className="label product-card__cat">
                      {categoryName(p.category)}
                      {p.customisable ? " · Custom print" : ""}
                    </span>
                    <h2 className="product-card__name">{p.name}</h2>
                    <p className="product-card__desc">{p.short}</p>
                  </Link>
                  <div className="product-card__links">
                    <Link to={`/products/${p.id}`} className="tlink">View product</Link>
                    <Link to={`/enquiry?product=${p.id}`} className="tlink">Enquire</Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state" role="status">
              <p>No products match your search or filter.</p>
              <button className="tlink" onClick={clearAll} style={{ marginTop: ".75rem", display: "block" }}>
                Clear and show all products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-banner" aria-label="Enquiry call to action">
        <div className="wrap cta-banner__inner">
          <h2>Can't find what you need?</h2>
          <Link to="/enquiry" className="btn btn--light">Send us an enquiry</Link>
        </div>
      </section>
    </>
  );
}
