// Serverless backend handler for Admin Authentication
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "nirvana2024";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const { passcode } = req.body || {};

    if (!passcode) {
      return res.status(400).json({ success: false, error: "Passcode required." });
    }

    if (passcode.trim() === ADMIN_PASSCODE.trim()) {
      return res.status(200).json({
        success: true,
        message: "Authentication successful."
      });
    }

    return res.status(401).json({
      success: false,
      error: "Invalid security passcode. Access denied."
    });
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
