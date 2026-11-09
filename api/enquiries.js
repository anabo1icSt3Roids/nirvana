// Serverless backend function for Vercel & local development
import fs from "fs";
import path from "path";

// In-memory cache for fast response and fallback in serverless environments
let memoryEnquiries = [
  {
    id: "enq_sample_1",
    name: "Dr. Rajesh Sharma",
    business: "Guwahati City Hospital",
    email: "procurement@cityhospital.in",
    phone: "+91 98765 43210",
    enquiryType: "quote",
    product: "blue-biohazard-bag",
    quantity: "500 rolls",
    message: "Requirement for 500 rolls of blue biohazard non-chlorinated bags for biomedical waste segregation.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "New"
  },
  {
    id: "enq_sample_2",
    name: "Anita Barman",
    business: "Assam Hotel & Resorts",
    email: "anita.b@assamresorts.com",
    phone: "+91 98540 12345",
    enquiryType: "samples",
    product: "royal-plus-tissue-paper",
    quantity: "Sample box",
    message: "Requesting sample box for custom logo printed tissue paper for hotel banquet tables.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: "In Progress"
  }
];

// Helper to get local storage path if filesystem is writable
const getStorageFile = () => {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    return path.join(dataDir, "enquiries.json");
  } catch {
    return null;
  }
};

const loadEnquiries = () => {
  const filePath = getStorageFile();
  if (filePath && fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    } catch {
      return memoryEnquiries;
    }
  }
  return memoryEnquiries;
};

const saveEnquiries = (list) => {
  memoryEnquiries = list;
  const filePath = getStorageFile();
  if (filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
    } catch {
      // Serverless environments may have read-only roots; memoryEnquiries handles runtime state
    }
  }
};

export default function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET: Fetch all enquiries for the Admin dashboard
  if (req.method === "GET") {
    const list = loadEnquiries();
    return res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  }

  // POST: Receive new enquiry from website customer
  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const { name, email, message, business, phone, enquiryType, product, quantity } = body;

      // Validation
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: "Name, email, and message are required fields."
        });
      }

      const newEnquiry = {
        id: "enq_" + Date.now(),
        name: name.trim(),
        business: business ? business.trim() : "",
        email: email.trim(),
        phone: phone ? phone.trim() : "",
        enquiryType: enquiryType || "general",
        product: product || "general",
        quantity: quantity ? quantity.trim() : "",
        message: message.trim(),
        createdAt: new Date().toISOString(),
        status: "New"
      };

      const current = loadEnquiries();
      current.unshift(newEnquiry); // Place newest first
      saveEnquiries(current);

      return res.status(201).json({
        success: true,
        message: "Enquiry submitted successfully and logged to database.",
        data: newEnquiry
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Failed to process enquiry: " + err.message
      });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
