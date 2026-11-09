# Nirvana Impex

B2B supplier website for Nirvana Impex — a Guwahati-based business supplying paper cups, tissue products, packaging materials, stationery, and hygiene products to businesses across Assam and Northeast India.

Built with React + Vite and deployed on Vercel with a serverless API backend.

---

## Features

- Filterable product catalogue with category and keyword search
- Product enquiry form with enquiry type, quantity, and WhatsApp follow-up link
- General contact form
- Serverless REST API (`/api/enquiries`, `/api/products`)
- Password-protected admin dashboard for viewing submitted enquiries
- WhatsApp click-to-chat integration on the enquiry page

---

## Tech Stack

- **React 18** with React Router v6
- **Vite 5** — build tool and local dev server
- **Vercel Serverless Functions** — `api/` folder auto-deployed as Node.js handlers
- **Plain CSS** — custom design system, no UI framework

---

## Project Structure

```
├── api/
│   ├── enquiries.js        # POST to submit, GET to list leads (admin use)
│   └── products.js         # GET with optional ?category and ?search filters
├── public/
│   └── images/             # Product images, about page images, logo, favicon
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── data/
│   │   └── products.js     # Product catalogue (source of truth)
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Enquiry.jsx
│   │   ├── Quote.jsx
│   │   └── Admin.jsx       # Lead management dashboard
│   ├── App.jsx
│   └── styles.css
├── vite-api-plugin.js      # Dev middleware — serves /api/* locally without a second server
├── vercel.json
└── index.html
```

---

## Getting Started

**Requirements:** Node.js ≥ 18, npm ≥ 9

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build
```

The local API middleware (`vite-api-plugin.js`) handles `/api/*` requests during development. No separate backend server is needed.

---

## Environment Variables

Create a `.env` file at the project root:

```env
# Public — embedded in the client bundle at build time
VITE_WHATSAPP_NUMBER=917903221659      # digits only, no + or spaces
VITE_CONTACT_EMAIL=nirvanaimpex11@gmail.com

# Optional — Formspree form ID for email forwarding on contact/enquiry submissions
# Sign up at formspree.io, create a form, and paste the ID here.
# This is a public submission key, not a secret.
VITE_FORMSPREE_ID=
```

> `.env` is in `.gitignore` and must not be committed. Add the same variables in Vercel project settings for production.

---

## API Overview

Both endpoints are Vercel Serverless Functions under `api/`.

### `GET /api/products`

Returns the product catalogue.

| Query param | Description |
|---|---|
| `category` | Filter by category slug |
| `search` | Keyword search on product name and description |

### `POST /api/enquiries`

Accepts a new enquiry from the contact or product enquiry forms.

Required fields: `name`, `email`, `message`  
Optional fields: `business`, `phone`, `enquiryType`, `product`, `quantity`

Returns `201` with the saved enquiry object. Enquiries are stored in memory and written to `data/enquiries.json` when the filesystem is writable (local dev). In Vercel's serverless environment, storage is in-memory per function instance.

### `GET /api/enquiries`

Returns all submitted enquiries. Used by the admin dashboard at `/admin`.

---

## Deployment

The project is configured for Vercel. `vercel.json` routes `/api/*` to serverless functions and all other paths to `index.html` for client-side routing.

**Vercel project settings:**

| Setting | Value |
|---|---|
| Root Directory | `nirvana-impex/nirvana-impex` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Add the environment variables from the section above in **Project Settings → Environment Variables** before deploying.
