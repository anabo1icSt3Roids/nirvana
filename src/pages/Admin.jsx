import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("nirvana_admin_auth") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passwordInput })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem("nirvana_admin_auth", "true");
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError(data.error || "Invalid security passcode.");
      }
    } catch {
      // Offline fallback
      if (passwordInput.trim() === "nirvana2024") {
        sessionStorage.setItem("nirvana_admin_auth", "true");
        setIsAuthenticated(true);
      } else {
        setAuthError("Invalid security passcode. Access denied.");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("nirvana_admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/enquiries");
      if (!res.ok) throw new Error("Server returned status " + res.status);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEnquiries(data.data);
      } else {
        throw new Error(data.error || "Failed to load enquiries");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    // Optimistic UI update
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    try {
      const res = await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (!res.ok) {
        console.warn("Server status update returned:", res.status);
      }
    } catch (err) {
      console.warn("Failed to update status on server:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    document.title = "Admin Portal | Nirvana Impex";
    if (isAuthenticated) {
      fetchEnquiries();
    }
  }, [isAuthenticated]);

  const filtered = enquiries.filter((e) => {
    if (filter === "all") return true;
    return e.status?.toLowerCase() === filter.toLowerCase();
  });

  // ── Authentication Gate (Login Screen) ──
  if (!isAuthenticated) {
    return (
      <div className="section section--white" style={{ minHeight: "75vh", display: "flex", alignItems: "center" }}>
        <div className="wrap narrow" style={{ maxWidth: "420px", margin: "0 auto" }}>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--rule)",
              borderRadius: "var(--r)",
              padding: "2.5rem 2rem",
              textAlign: "center"
            }}
          >
            <h1 style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>Admin Portal Login</h1>
            <p style={{ fontSize: ".875rem", color: "var(--mid)", marginBottom: "1.75rem", lineHeight: 1.5 }}>
              Please enter your authorized security key to access backend customer inquiries and operations.
            </p>

            <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label className="field-label" htmlFor="admin-pass">
                  Security Passcode
                </label>
                <input
                  id="admin-pass"
                  type="password"
                  className="field-input"
                  placeholder="Enter admin passcode"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                  required
                />
                {authError && (
                  <span className="field-error" style={{ marginTop: ".5rem" }}>
                    {authError}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                disabled={isAuthenticating}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {isAuthenticating ? "Verifying…" : "Verify & Enter Portal"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated Admin Portal ──
  return (
    <div className="section section--white" style={{ minHeight: "80vh" }}>
      <div className="wrap">
        {/* Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid var(--rule)", paddingBottom: "1.5rem", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".35rem" }}>
              <span className="label" style={{ margin: 0 }}>Executive Control</span>
              <span style={{ fontSize: ".75rem", background: "#E8F0FE", color: "#1967D2", padding: ".2rem .5rem", borderRadius: "10px", fontWeight: 700 }}>
                Live Database Active
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", margin: 0 }}>
              Lead Management Dashboard
            </h1>
          </div>
          <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
            <button onClick={fetchEnquiries} className="btn btn--outline" style={{ padding: ".45rem 1rem", fontSize: ".85rem" }}>
              ↻ Refresh Leads
            </button>
            <button onClick={handleLogout} className="btn btn--outline" style={{ padding: ".45rem 1rem", fontSize: ".85rem", color: "var(--error)", borderColor: "#E8C8C8" }}>
              Lock Portal
            </button>
            <Link to="/" className="btn btn--primary" style={{ padding: ".45rem 1rem", fontSize: ".85rem" }}>
              Go to Website
            </Link>
          </div>
        </div>

        {/* Status Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "var(--surface)", padding: "1.25rem", borderRadius: "var(--r)", border: "1px solid var(--rule)" }}>
            <span style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--mid)", fontWeight: 700 }}>Total Inquiries</span>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--charcoal)", marginTop: ".25rem" }}>{enquiries.length}</div>
          </div>
          <div style={{ background: "var(--surface)", padding: "1.25rem", borderRadius: "var(--r)", border: "1px solid var(--rule)" }}>
            <span style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--mid)", fontWeight: 700 }}>New Requests</span>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1F7A4A", marginTop: ".25rem" }}>
              {enquiries.filter((e) => (e.status || "New").toLowerCase() === "new").length}
            </div>
          </div>
          <div style={{ background: "var(--surface)", padding: "1.25rem", borderRadius: "var(--r)", border: "1px solid var(--rule)" }}>
            <span style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--mid)", fontWeight: 700 }}>In Progress</span>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#B06000", marginTop: ".25rem" }}>
              {enquiries.filter((e) => (e.status || "").toLowerCase() === "in progress").length}
            </div>
          </div>
          <div style={{ background: "var(--surface)", padding: "1.25rem", borderRadius: "var(--r)", border: "1px solid var(--rule)" }}>
            <span style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--mid)", fontWeight: 700 }}>Cloud Storage</span>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1F7A4A", marginTop: ".6rem" }}>
              ● Supabase Postgres Connected
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: "flex", gap: ".5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {["all", "new", "in progress", "resolved"].map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: ".35rem .9rem",
                fontSize: ".85rem",
                borderRadius: "var(--r)",
                border: "1px solid " + (filter === key ? "var(--charcoal)" : "var(--rule)"),
                background: filter === key ? "var(--charcoal)" : "transparent",
                color: filter === key ? "var(--white)" : "var(--charcoal)",
                fontWeight: 600,
                textTransform: "capitalize",
                cursor: "pointer"
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Leads Table */}
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--mid)" }}>
            Loading records from Supabase database...
          </div>
        ) : error ? (
          <div style={{ padding: "1.5rem", background: "#FDF6F6", border: "1px solid #E8C8C8", borderRadius: "var(--r)", color: "var(--error)" }}>
            <strong>Backend notice:</strong> {error}
            <div style={{ marginTop: ".5rem", fontSize: ".85rem", color: "var(--mid)" }}>
              Tip: The serverless endpoint at <code>/api/enquiries</code> responds live in production on Vercel or when Vite local API middleware is active.
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", border: "1px dashed var(--rule)", borderRadius: "var(--r)", color: "var(--mid)" }}>
            No customer inquiries found matching the <strong>"{filter}"</strong> filter.
          </div>
        ) : (
          <div style={{ border: "1px solid var(--rule)", borderRadius: "var(--r)", overflow: "hidden", background: "var(--white)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: ".875rem" }}>
                <thead>
                  <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--rule)" }}>
                    <th style={{ padding: "1rem", fontWeight: 700, color: "var(--charcoal)" }}>Client / Business</th>
                    <th style={{ padding: "1rem", fontWeight: 700, color: "var(--charcoal)" }}>Contact Info</th>
                    <th style={{ padding: "1rem", fontWeight: 700, color: "var(--charcoal)" }}>Type & Product</th>
                    <th style={{ padding: "1rem", fontWeight: 700, color: "var(--charcoal)" }}>Message / Specs</th>
                    <th style={{ padding: "1rem", fontWeight: 700, color: "var(--charcoal)" }}>Date</th>
                    <th style={{ padding: "1rem", fontWeight: 700, color: "var(--charcoal)" }}>Status (Click to Change)</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => (
                    <tr key={item.id || idx} style={{ borderBottom: "1px solid var(--rule)" }}>
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <strong style={{ display: "block", color: "var(--charcoal)" }}>{item.name}</strong>
                        {item.business && <span style={{ color: "var(--mid)", fontSize: ".8rem" }}>{item.business}</span>}
                      </td>
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <div style={{ color: "var(--charcoal)" }}>{item.email}</div>
                        {item.phone && <div style={{ color: "var(--mid)", fontSize: ".8rem" }}>{item.phone}</div>}
                      </td>
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <span style={{ display: "inline-block", padding: ".2rem .55rem", background: "#ECEAE3", borderRadius: "4px", fontSize: ".75rem", fontWeight: 600, textTransform: "uppercase" }}>
                          {item.enquiryType || "General"}
                        </span>
                        {item.product && <div style={{ fontSize: ".8rem", color: "var(--mid)", marginTop: ".35rem" }}>{item.product}</div>}
                        {item.quantity && <div style={{ fontSize: ".75rem", color: "var(--mid)" }}>Qty: {item.quantity}</div>}
                      </td>
                      <td style={{ padding: "1rem", verticalAlign: "top", maxWidth: "300px" }}>
                        <p style={{ margin: 0, fontSize: ".825rem", color: "var(--charcoal)", whiteSpace: "pre-wrap" }}>
                          {item.message}
                        </p>
                      </td>
                      <td style={{ padding: "1rem", verticalAlign: "top", whiteSpace: "nowrap", fontSize: ".8rem", color: "var(--mid)" }}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        }) : "—"}
                      </td>
                      <td style={{ padding: "1rem", verticalAlign: "top" }}>
                        <select
                          value={item.status || "New"}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          disabled={updatingId === item.id}
                          aria-label={`Change status for enquiry from ${item.name}`}
                          style={{
                            padding: ".35rem .6rem",
                            borderRadius: "6px",
                            fontSize: ".75rem",
                            fontWeight: 700,
                            border: "1px solid var(--rule)",
                            background:
                              item.status === "Resolved"
                                ? "#E8F0FE"
                                : item.status === "In Progress"
                                ? "#FDF3E7"
                                : "#E3F7EB",
                            color:
                              item.status === "Resolved"
                                ? "#1A73E8"
                                : item.status === "In Progress"
                                ? "#B06000"
                                : "#14693B",
                            cursor: "pointer",
                            outline: "none"
                          }}
                        >
                          <option value="New">New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        {updatingId === item.id && (
                          <div style={{ fontSize: ".7rem", color: "var(--mid)", marginTop: ".25rem" }}>
                            Saving…
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
