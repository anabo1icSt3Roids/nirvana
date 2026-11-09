// Serverless endpoint to serve verified products via REST API
import { products, categories } from "../src/data/products.js";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    const { category, search } = req.query || {};

    let filtered = products;

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      total: filtered.length,
      categories: categories,
      products: filtered
    });
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
