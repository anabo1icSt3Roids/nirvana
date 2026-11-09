# Nirvana Impex — B2B Supply Website

> Official website for **Nirvana Impex**, a Guwahati-based proprietorship supplying paper cups, tissue, packaging, and hygiene products to businesses across Assam and Northeast India.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| Routing | React Router v6 |
| Backend / API | Vercel Serverless Functions (`/api`) |
| Styling | Plain CSS (custom design system, no UI framework) |
| Deployment | Vercel |

---

## Project Structure

```
nirvana-impex/
├── api/                        # Serverless backend (auto-deployed by Vercel)
│   ├── enquiries.js            # POST /api/enquiries — receive & store leads
│   └── products.js             # GET  /api/products  — product catalogue API
├── public/
│   ├── images/
│   │   ├── products/           # 13 product images
│   │   └── about/              # About page images (facility, founder portrait)
│   ├── logo.jpg                # Official company logo
│   └── favicon.jpg             # Browser favicon
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Sticky nav with logo
│   │   └── Footer.jsx          # Contact info, links, Admin portal
│   ├── data/
│   │   └── products.js         # 13 real products with categories and details
│   ├── pages/
│   │   ├── Home.jsx            # Landing page — hero, features, CTA
│   │   ├── Products.jsx        # Filterable product catalogue
│   │   ├── About.jsx           # Company story, founder, factsheet
│   │   ├── Contact.jsx         # Contact form → /api/enquiries
│   │   ├── Enquiry.jsx         # Product enquiry form → /api/enquiries
│   │   ├── Quote.jsx           # Quote request form
│   │   └── Admin.jsx           # Password-protected admin dashboard
│   ├── App.jsx                 # Route definitions
│   ├── main.jsx                # React entry point
│   └── styles.css              # Global design system
├── vite-api-plugin.js          # Local dev middleware — serves /api/* without a second server
├── vite.config.js
├── vercel.json                 # API + SPA routing rules
└── index.html
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs at `http://localhost:5173`. The local API middleware (`vite-api-plugin.js`) serves `/api/enquiries` and `/api/products` during development — **no second server needed**.

### Production Build

```bash
npm run build        # outputs to dist/
npm run preview      # preview the production build locally
```

---

## Environment Variables

Create a `.env` file in the project root (copy `.env.example` if present):

```env
VITE_WHATSAPP_NUMBER=917903221659
VITE_CONTACT_EMAIL=nirvanaimpex11@gmail.com

# Optional — set a real Formspree form ID to forward contact emails to inbox
VITE_FORMSPREE_ID=
```

> **Never commit `.env` to version control.** It is listed in `.gitignore`.

For Vercel deployment, add these as **Environment Variables** in the Vercel project settings.

---

## Deployment (Vercel)

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import from GitHub.
3. Set the **Root Directory** to `nirvana-impex/nirvana-impex` (if deploying from the monorepo root).
4. Framework preset: **Vite**.
5. Build command: `npm run build` | Output directory: `dist`.
6. Add environment variables from the section above.
7. Deploy — Vercel automatically deploys the `api/` folder as serverless functions.

`vercel.json` handles routing:
- `/api/(.*)` → serverless functions
- `(.*)` → `index.html` (SPA catch-all)

---

## Admin Dashboard

A lightweight internal lead-management dashboard is available at `/admin`.

- **Login passcode:** stored in `src/pages/Admin.jsx` as `DEFAULT_ADMIN_PASSCODE` — change before going to production.
- Session is maintained via `sessionStorage` (cleared on tab close).
- Displays all enquiries received via `/api/enquiries` with filter tabs (All / New / In Progress).

---

## API Reference

### `POST /api/enquiries`

Submit a new lead or enquiry.

**Request body (JSON):**
```json
{
  "name": "Rajan Das",
  "business": "Hotel Brahmaputra",
  "email": "rajan@hotelb.com",
  "phone": "+91 98765 43210",
  "enquiryType": "Bulk Order",
  "message": "Need 500 cartons of paper cups monthly."
}
```

**Response:** `201 Created` with the saved enquiry object.

---

### `GET /api/products`

Returns the product catalogue.

**Query parameters:**

| Param | Description |
|---|---|
| `category` | Filter by category slug (e.g. `paper-cups`) |
| `search` | Full-text search on name and description |

**Response:** `200 OK` with an array of product objects.

---

## Product Catalogue

13 real products across 5 categories:

| Category | Products |
|---|---|
| Paper Cups | Disposable paper cups (various sizes) |
| Tissue & Napkins | Facial tissue, table napkins, pocket tissue |
| Packaging | Carry bags, corrugated boxes |
| Hygiene | Hand sanitizers, soap dispensers |
| Stationery | Notebooks, writing pads |

Product data is maintained in [`src/data/products.js`](src/data/products.js).

---

## Business Details

| Field | Detail |
|---|---|
| Company | Nirvana Impex |
| Type | Proprietorship |
| Proprietor | Mr. Gautam Pradhan |
| GST | 18AKCPP8029J3ZQ |
| Bank | Bank of Baroda |
| Founded | 2020 |
| Email | nirvanaimpex11@gmail.com |
| WhatsApp | +91 79032 21659 |
| Location | Guwahati, Assam, India |

---

## License

This project is proprietary. All rights reserved — Nirvana Impex © 2024.
