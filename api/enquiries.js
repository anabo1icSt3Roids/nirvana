// Serverless backend function for Vercel & local development
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "https://vtdtvcrdntvgyigmhrzk.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_SLUotoc4l7r_9E3oVPQ8rg_JXjSosmd";

let supabase = null;
try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.warn("Supabase client initialization warning:", err.message);
}

// In-memory cache for fast response and fallback
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
      // Serverless environments may have read-only roots
    }
  }
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET: Fetch all enquiries for the Admin dashboard
  if (req.method === "GET") {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("enquiries")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && Array.isArray(data)) {
          const formatted = data.map((row) => ({
            id: row.id,
            name: row.name,
            business: row.business || "",
            email: row.email,
            phone: row.phone || "",
            enquiryType: row.enquiry_type || "general",
            product: row.product || "general",
            quantity: row.quantity || "",
            message: row.message,
            createdAt: row.created_at,
            status: row.status || "New"
          }));

          // If database has records, serve them! If fresh/empty, include default samples
          const responseList = formatted.length > 0 ? formatted : memoryEnquiries;

          return res.status(200).json({
            success: true,
            count: responseList.length,
            data: responseList
          });
        } else if (error) {
          console.warn("Supabase query error:", error.message);
        }
      } catch (dbErr) {
        console.warn("Supabase fetch failed, falling back:", dbErr.message);
      }
    }

    const list = loadEnquiries();
    return res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  }

  // POST: Receive new enquiry from customer
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

      const rowToInsert = {
        name: name.trim(),
        business: business ? business.trim() : "",
        email: email.trim(),
        phone: phone ? phone.trim() : "",
        enquiry_type: enquiryType || "general",
        product: product || "general",
        quantity: quantity ? quantity.trim() : "",
        message: message.trim(),
        status: "New"
      };

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("enquiries")
            .insert([rowToInsert])
            .select();

          if (!error && data && data.length > 0) {
            const saved = data[0];
            return res.status(201).json({
              success: true,
              message: "Enquiry submitted successfully and logged to database.",
              data: {
                id: saved.id,
                name: saved.name,
                business: saved.business,
                email: saved.email,
                phone: saved.phone,
                enquiryType: saved.enquiry_type,
                product: saved.product,
                quantity: saved.quantity,
                message: saved.message,
                createdAt: saved.created_at,
                status: saved.status
              }
            });
          } else if (error) {
            console.warn("Supabase insert warning:", error.message);
          }
        } catch (dbErr) {
          console.warn("Supabase insertion error:", dbErr.message);
        }
      }

      // Fallback local save if database unavailable
      const fallback = {
        id: "enq_" + Date.now(),
        ...rowToInsert,
        enquiryType: rowToInsert.enquiry_type,
        createdAt: new Date().toISOString()
      };
      const current = loadEnquiries();
      current.unshift(fallback);
      saveEnquiries(current);

      return res.status(201).json({
        success: true,
        message: "Enquiry submitted successfully and logged to database.",
        data: fallback
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Failed to process enquiry: " + err.message
      });
    }
  }

  // PATCH / PUT: Update status of an enquiry (Admin action)
  if (req.method === "PATCH" || req.method === "PUT") {
    try {
      const { id, status } = req.body || {};
      if (!id || !status) {
        return res.status(400).json({ success: false, error: "id and status are required." });
      }

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("enquiries")
            .update({ status })
            .eq("id", id)
            .select();

          if (!error && data && data.length > 0) {
            return res.status(200).json({
              success: true,
              message: "Status updated in database.",
              data: data[0]
            });
          }
        } catch (dbErr) {
          console.warn("Supabase update error:", dbErr.message);
        }
      }

      // Fallback local memory update
      const current = loadEnquiries();
      const target = current.find((item) => String(item.id) === String(id));
      if (target) {
        target.status = status;
        saveEnquiries(current);
      }

      return res.status(200).json({
        success: true,
        message: "Status updated successfully.",
        data: { id, status }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
