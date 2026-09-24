# How to Make DocuExplain AI Public & Share with Others

This guide describes the 3 easiest ways to share **DocuExplain AI** with professors, evaluators, teammates, and users across the internet.

---

## Method 1: Instant Local Network (Wi-Fi / Hotspot) Sharing — ACTIVE NOW!

If other people (or your own phone/tablet) are connected to the **same Wi-Fi network or mobile hotspot**, they can already access the full platform immediately:

👉 **`http://10.0.11.138:5173`**

*(Make sure your Windows Firewall allows incoming connections on port 5173 when prompted).*

---

## Method 2: Instant Public Internet Tunnel (Share via Live HTTPS URL)

If you want to send a link to someone in another city or country over the internet while running the project on your computer:

### Option A: Cloudflare Tunnel (Recommended — Free & No Limits)
1. Open PowerShell and install `cloudflared`:
   ```powershell
   winget install --id Cloudflare.cloudflared
   ```
2. Start the public tunnel:
   ```powershell
   cloudflared tunnel --url http://localhost:5173
   ```
3. Cloudflare will give you a public URL (e.g. `https://random-name.trycloudflare.com`).  
   Share this URL with anyone in the world!

---

### Option B: Ngrok (Popular & Fast)
1. Install ngrok:
   ```powershell
   winget install ngrok
   ```
2. Connect your free ngrok token and run:
   ```powershell
   ngrok http 5173
   ```
3. Share the generated `https://xxxx.ngrok-free.app` link.

---

## Method 3: Permanent 24/7 Cloud Deployment (Stays Online Always)

If you want the platform to run 24/7 on the cloud without keeping your computer on:

### 1. Deploy the Backend to Render.com (Free)
1. Push this project to your GitHub repository.
2. Go to [Render.com](https://render.com) > **New** > **Web Service**.
3. Select your repository.
4. Set:
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Render will give you a backend URL (e.g., `https://docuexplain-backend.onrender.com`).

### 2. Deploy the Frontend to Vercel (Free)
1. Go to [Vercel.com](https://vercel.com) > **Add New** > **Project**.
2. Select your repository.
3. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Environment Variable:** `VITE_API_BASE_URL` = `https://docuexplain-backend.onrender.com/api`
4. Click **Deploy**. Vercel will give you a permanent live public URL (e.g. `https://docuexplain-ai.vercel.app`)!

---

## 🔑 Demo Access for External Users

When sharing your public link, users can log in using:
- **One-Click Demo Button**: Click *"Instant One-Click Demo Access"* on the login page.
- **Demo Credentials**:
  - **Email:** `researcher@docuexplain.ai`
  - **Password:** `DemoUser2026!`
- Or they can click **"Create Account"** to register their own private user workspace.
