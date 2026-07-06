# 📦 Supabase Order Tracking Web App

A lightweight ecommerce search and order tracking system built using modern **Next.js (App Router)** and hosted entirely for free on **Cloudflare Pages**. Data operations run client-side directly through the **Supabase JS Client SDK**.

## 🛠️ Local Development Setup

Follow these steps to run the application on your computer:

1. Clone or download your repository.
2. Open your terminal inside the project root folder.
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Open `utils/supabase.js` and input your project's `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
5. Spin up the local development server:
   ```bash
   npm run dev
   ```
6. Open your web browser and navigate to `http://localhost:3000`.

## 📦 Static Production Compilation

To manually generate your static build architecture locally (this is what Cloudflare does automatically behind the scenes):

```bash
npm run build
```
This script runs the Next.js compilation compiler and outputs raw HTML/CSS asset sheets directly into a newly generated folder called `/out`.

## ☁️ Cloudflare Pages Free Deployment Settings

When linking this repository to your free Cloudflare Pages profile, configure these fields exactly inside the **Build settings** section:

* **Framework Preset:** `Next.js (Static HTML Export)`
* **Build Command:** `npm run build`
* **Build Output Directory:** `out`
