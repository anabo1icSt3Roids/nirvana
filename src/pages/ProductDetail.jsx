import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { products, categoryName } from "../data/products.js";
import ProductImage from "../components/ProductImage.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    document.title = product
      ? `${product.name} | Nirvana Impex`
      : "Product not found | Nirvana Impex";
  }, [product]);

  // ── Product not found ──
  if (!product) {
    return (
      <section className="section" aria-label="Product not found">
        <div className="wrap narrow">
          <span className="label" style={{ display: "block", marginBottom: ".75rem" }}>Not found</span>
          <h1>Product not found</h1>
          <p>The product you are looking for does not exist or has been removed.</p>
          <div className="btn-row">
            <Link to="/products" className="btn btn--primary">Back to products</Link>
          </div>
        </div>
      </section>
    );
  }

  // Related: same category, not this product, published, up to 3
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.published)
    .slice(0, 3);

  const enquiryHref = product.customisable
    ? `/enquiry?product=${product.id}&type=custom-print`
    : `/enquiry?product=${product.id}`;

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="crumb-bar">
        <div className="wrap">
          <nav aria-label="Breadcrumb">
            <ol className="crumb">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to={`/products?category=${product.category}`}>{categoryName(product.category)}</Link></li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Main detail ── */}
      <section className="section section--white" aria-label={`Product detail: ${product.name}`}>
        <div className="wrap product-detail-grid">

          <div className="product-detail-image">
            <ProductImage product={product} ratio="1 / 1" />
          </div>

          <div>
            {/* Badges */}
            <div>
              <span className="product-badge">{categoryName(product.category)}</span>
              {product.customisable && (
                <span className="product-badge">Custom print available</span>
              )}
            </div>

            <h1 style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)", margin: ".75rem 0 .65rem" }}>
              {product.name}
            </h1>

            <p>{product.short}</p>

            {/* Specification notice — honest, not fabricated */}
            <div className="product-notice" role="note">
              Specifications, pricing, and availability are confirmed at quotation stage.
              Please enquire directly for lead times and minimum order quantities.
            </div>

            <div className="btn-row">
              <Link to={enquiryHref} className="btn btn--primary">
                {product.customisable ? "Enquire about custom printing" : "Enquire about this product"}
              </Link>
              <Link to="/products" className="btn btn--outline">Back to products</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <section className="section" aria-labelledby="related-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="related-h">More in {categoryName(product.category)}</h2>
              <Link to={`/products?category=${product.category}`} className="tlink tlink--fwd">
                View all
              </Link>
            </div>
            <div className="related-grid">
              {related.map((p) => (
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
    </>
  );
}
