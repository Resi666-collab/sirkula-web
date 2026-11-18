# SIRKULA — Phase 1: Landing Page

**Sistem Integrasi Rantai Keberlanjutan Limbah Organik Indonesia**

> *Waste less. Give more. Grow better.*

SIRKULA connects restaurants, cafes, hotels, catering services, and food businesses that produce organic waste with individuals, farmers, compost producers, BSF cultivators, and livestock owners who can upcycle and reuse that waste across Indonesia.

---

## 🌿 Tech Stack (Phase 1)

- **Markup & Styling:** Semantic HTML5, CSS3 with modern CSS custom properties (variables), Flexbox & CSS Grid.
- **Interactivity:** Vanilla JavaScript (ES6+), zero external runtime frameworks.
- **Icons:** Lucide Icons & inline scalable vector graphics (SVG).
- **Typography:** Google Fonts (*Plus Jakarta Sans*).
- **Deployment Target:** Netlify (Static Web Hosting).
- **Future Integration (Phase 2):** Supabase Authentication, PostgreSQL, and Storage.

---

## 📁 File Structure

```
sirkula/
├── index.html                   # Main landing page
├── login.html                   # Authentication interface (Phase 1 preview)
├── register.html                # Multi-role registration (Business vs Collector)
├── marketplace.html             # Marketplace explorer with live filtering
├── netlify.toml                 # Netlify deployment configuration
├── serve.ps1                    # Lightweight local development HTTP server
├── css/
│   ├── style.css                # Core design system tokens, typography & components
│   └── responsive.css           # Mobile & tablet media queries
├── js/
│   └── main.js                  # Navigation, drawer, modal, and filtering logic
└── assets/
    └── images/
        ├── logo.svg             # SIRKULA vector logo
        ├── favicon.svg          # Circular sprout favicon
        ├── hero-illustration.svg # Circular economy vector illustration
        ├── composting-illustration.svg
        ├── bsf-cultivation-illustration.svg
        └── animal-feed-illustration.svg
```

---

## 🚀 How to Run Locally

You can run SIRKULA locally using any static web server:

### Option A: Using the included PowerShell script (Windows)
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 8080
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Option B: Using Python (if installed)
```bash
python -m http.server 8080
```

### Option C: Using Node.js / npx
```bash
npx serve .
```

### Option D: Direct Browser
You can also open `index.html` directly in any modern web browser.

---

## 🚢 Netlify Deployment

1. Connect this repository or upload the `sirkula` folder to [Netlify](https://www.netlify.com/).
2. Build command: *(leave blank)*
3. Publish directory: `.`
4. The included `netlify.toml` automatically configures optimal HTTP security headers and asset caching.

---

## 📋 Quality & Compliance Notes

- **No Fabricated Statistics:** The Trust and Impact section utilizes genuine descriptive context on municipal organic waste and source segregation rather than manufactured milestone metrics.
- **Demo Data Badging:** All marketplace listings are explicitly marked with `DEMO DATA` tags and clear disclaimers.
- **No Fake Authentication:** Forms feature informative feedback indicating that account persistence will activate in Phase 2 with Supabase.
