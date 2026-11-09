/**
 * ProductImage — renders the product photo if available, or a
 * controlled fallback that keeps layout stable and doesn't shout
 * "PLACEHOLDER" at visitors. The fallback uses a warm surface background
 * with a quiet development label that is easy to spot in dev but unintrusive.
 */
export default function ProductImage({ product, ratio = "4 / 3", className = "" }) {
  const style = { aspectRatio: ratio };

  if (product.image) {
    return (
      <div className={`img-frame ${className}`} style={style}>
        <img
          src={product.image}
          alt={product.imageAlt || product.name}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback — subtle, layout-stable, development-friendly
  return (
    <div
      className={`img-frame img-frame--ph ${className}`}
      style={style}
      role="img"
      aria-label={`${product.name} — image pending`}
      data-ph="Image pending"
    />
  );
}
