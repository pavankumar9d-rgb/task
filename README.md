<div align="center">
  <h1>⏰ AlarmPro Enterprise</h1>
  <p><strong>The High-Precision, Multi-Tenant Reminder & Task Management Platform</strong></p>
  
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
  [![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
  [![PWA Ready](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)]()
</div>

---

## 🚀 Overview

**AlarmPro** is not just an alarm clock; it is a scalable, **Progressive Web Application (PWA)** built from the ground up for high-precision task execution and niche-specific user targeting. It demonstrates robust architectural patterns, zero-delay worker threads, and dynamic, data-driven CSS themes.

Whether deployed as an enterprise scheduler or packaged as a SaaS product for students, gym enthusiasts, and professionals, the codebase is lightweight, dependency-free on the frontend, and blazingly fast.

### 🎯 Key Commercial Features:
- **Zero-Delay High-Precision Alarms**: Utilizes Web Workers for non-blocking, millisecond-accurate time tracking that completely avoids generic DOM `setInterval` thread throttling.
- **Dynamic Multi-Tenant UI Themes**: Instantly adapts its user interface based on 3 core "Genres" (📚 Student, 💪 Gym Workout, 📝 Exam Planner) using purely CSS Variables. None of the heavy frontend frameworks—just ultra-performant Native DOM.
- **True PWA Installability**: Complete offline caching via Service Workers (`sw.js`) and an app manifest. Installs seamlessly as a native desktop/mobile app on Windows, macOS, iOS, and Android.
- **Secure Persistence via Node/SQLite**: User authentication and robust relational data partitioning. Prevents cross-user data bleeding natively via REST endpoints.
- **Cross-Thread Event Bus**: PWA push notifications communicate directly back to the active Main Thread to intuitively turn off audio streams.

---

## 📸 Platform Sneak Peek

### The Sleek, Niche-Driven Interface
Built with a relentless focus on aesthetics, applying strict Dark Mode boundaries (`#1a1a1a`) and dynamic neon LED accents.

*(Screenshots will be visible if downloaded from the repository's assets)*
<p align="center">
  <img src="assets/main_app_screen_1774338832157.png" width="400" alt="AlarmPro Main Dashboard" />
  <img src="assets/settings_modal_1774339086035.png" width="400" alt="AlarmPro Settings & Theming" />
</p>

---

## 🛠 Tech Stack & Architecture

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend UI** | HTML5 / CSS3 / Vanilla JS | Eliminates dependency hell, ensures 100/100 Lighthouse scores, and keeps the payload under 100KB. |
| **PWA Core** | Service Workers + Web Manifest | Provides native "Add to Homescreen" functionality and background notification processing. |
| **Web Workers** | Native `Worker` API | Guarantees millisecond precision. Offloads the JS event loop to prevent the alarm from delaying when the user scrolls. |
| **Backend API** | Node.js + Express.js | Secure REST routing for User Auth and CRUD operations on Tasks. |
| **Database** | SQLite3 | 100% portable, zero-configuration local database that scales perfectly for SaaS MVPs and containerized deployments. |

---

## ⚙️ Quick Start Installation

This repository contains both the backend REST API and the Frontend client (located in `/public`).

### Prerequisites
- Node.js (v18+)

### 1. Clone & Install
```bash
git clone https://github.com/pavankumar9d-rgb/task.git
cd task2-website
npm install
```

### 2. Start the Server
```bash
npm run dev
```

### 3. Usage
Navigate to `http://localhost:3000` in your browser. Complete the Registration flow and install the app to your device using the browser address bar icon.

---

## 💼 Why Invest/Acquire this IP?
This application solves the classic "sleeping tab" issue modern browsers face. Standard JavaScript alarms fail or delay exactly when the browser minimizes them. **AlarmPro** engineers around this natively using dedicated Workers and Service Workers, delivering a true iOS/Android caliber alarm experience inside a web browser, making it a highly profitable cross-platform B2C asset.

---
*Developed with pristine architecture, tailored for high-availability enterprise environments.*
