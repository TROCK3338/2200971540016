# AffordMed Campus Hiring Evaluation - Frontend Test Submission

## 📁 Repository Structure
```
2200971540016/
├── Logging Middleware/
│   └── logger.ts
├── Frontend Test Submission/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ShortenerPage.tsx
│   │   │   ├── RedirectHandler.tsx
│   │   │   └── StatsPage.tsx (optional)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── vite.config.ts
│   └── package.json
```

---

## 🚀 Project Overview
This is a responsive **URL Shortener Web Application** built with **React (TypeScript)** and **Material UI**. It includes:

- 🔗 Shortening up to 5 URLs with optional shortcode & validity
- 📉 A stats page to view created short links and metadata
- 🛡️ Logging integrated via AffordMed's logging middleware
- 📦 `localStorage` based persistence (client-side only)
- 📍 Redirect handler for visiting shortened URLs

---

## ⚙️ Tech Stack
- React + TypeScript (Vite)
- Material UI
- React Router DOM
- Custom logging middleware integrated via AffordMed API

---

## ✅ How to Run
1. **Install dependencies:**
   ```bash
   cd "Frontend Test Submission"
   npm install
   ```

2. **Create a `.env` file** in the root:
   ```env
   VITE_ACCESS_TOKEN=your_access_token_here
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. Visit: [http://localhost:3000](http://localhost:3000)

---

## 📦 Logging Middleware
Located under the `Logging Middleware/` folder. It exports a `Log()` function that sends log data to AffordMed's API with the correct bearer token and headers.

```ts
Log("frontend", "info", "component", "Message here");
```

---

## 📸 Screenshots (Required for Submission)
Include in submission:
- [ ] URL Shortener Page — mobile & desktop
- [ ] Stats Page with metadata — mobile & desktop
- [ ] Redirect working — opening short URL
- [ ] Devtools Network tab showing log call to API
- [ ] Terminal screenshot of `npm run dev` on port 3000

---

## 📌 Notes
- No 3rd party CSS frameworks used (only MUI)
- No backend was used (client-side only per instruction)
- All short URLs are redirected via React Router handler
- `localStorage` ensures URLs persist across sessions

---

## ✅ Submission
> **Roll Number:** `2200971540016`  
> **Track:** Frontend  
> **Repository Name:** `2200971540016`  
> **No personal identifiers in commit messages / repo name**

---

Feel free to reach out in case of issues. Thank you!
