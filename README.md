# Amin Esmaeilzadeh — Web & AI Engineering Portfolio

A modern, high-performance web portfolio and interactive case-study showcase engineered with **Vite, Vanilla JavaScript (ES6+), Advanced CSS (Liquid Glass System)** on the frontend, and **Django REST Framework** on the backend.

Official Website: **[https://aminez.ir](https://aminez.ir)**

---

## 🌟 Overview & Architecture

This repository contains the complete codebase for Amin Esmaeilzadeh's personal portfolio. The project demonstrates high-end interaction design, smooth cinematic transitions, and reliable server-side architecture.

### Key Highlights
- **Liquid Glass Design System:** Custom glassmorphic surfaces with dynamic specular highlights, frosted blurs, and real-time contrast-adaptive theming.
- **Zero-Lag Media & Animations:** GPU-accelerated video canvas, GSAP timelines, Lenis smooth scrolling, and page state transitions.
- **Adaptive Monochrome Branding:** Dynamic monogram emblem that automatically inverts between pure white (on dark/hero sections) and jet black (on light/editorial sections).
- **Embedded AI Capabilities:** Client-side inference powered by ONNX Runtime for sub-12ms neural network evaluation directly in the browser.
- **Robust REST API Backend:** Django 5 backend powering contact message storage, project telemetry, skill ratings, and administrative review workflows.
- **Resilient & Fault-Tolerant:** Decoupled client architecture that functions seamlessly with local cached data even when offline or during backend service maintenance.

---

## 📂 Project Structure

```text
├── front/                          # Frontend workspace & client application
│   ├── index.html                  # Main portfolio entry with 3D nav, hero, services & contact
│   ├── projects/                   # Editorial case study showcase pages
│   │   ├── all.html                # Comprehensive project archive
│   │   ├── fit-predict.html        # FitPredict: AI & Biometrics Case Study
│   │   ├── lumina.html             # Lumina: Digital Library Case Study
│   │   ├── mod-style.html          # ModStyle: Modern E-Commerce Case Study
│   │   ├── project-management.html # Northwind: Project Management Case Study
│   │   └── trip-os.html            # TripOS: Travel Workspace Case Study
│   ├── src/
│   │   ├── css/                    # Modular stylesheets (main, liquid-glass, lumina-redesign, ...)
│   │   ├── js/                     # Client scripts (main, navigation, transitions, api, loader)
│   │   └── data/                   # Structured showcase datasets (projects.js)
│   ├── public/                     # Static media, icons, resume PDF, and video assets
│   ├── package.json                # Frontend dependencies & npm scripts
│   └── vite.config.js              # Vite configuration & dev proxy
│
└── backend/                        # Server application (Django 5 + Django REST Framework)
    ├── manage.py                   # Django CLI management entry point
    ├── requirements.txt            # Python dependencies
    ├── db.sqlite3                  # Pre-configured SQLite database with seeded showcase data
    ├── portfolio_backend/          # Project settings, WSGI, ASGI, and root routing
    └── api/                        # Core REST API application
        ├── models.py               # Database schemas (ContactMessage, Project, Skill, ProfileInfo)
        ├── serializers.py          # Data serialization & validation
        ├── views.py                # RESTful API viewsets & endpoints
        ├── urls.py                 # API route definitions
        ├── admin.py                # Django admin customizations
        ├── tests.py                # Comprehensive automated unit tests
        └── management/commands/    # Management commands (e.g., seed_data.py)
```

---

## 🚀 Featured Projects Showcase

1. **FITPREDICT — AI Biometric & Fitness Platform**
   - Real-time physiological telemetry analysis and precision workout & nutrition prescription.
   - Built with Multi-Task MLP-ResNet architecture and in-browser ONNX Runtime (<12ms client inference).
   - Technologies: HTML5, Modern CSS, JavaScript (ES6+), Machine Learning, Vite.

2. **LUMINA — Digital Library Platform**
   - Online reading sanctuary featuring interactive reader mode, curated collections, and author spotlights.
   - Technologies: HTML5, Modern CSS, JavaScript, Django REST.

3. **MODSTYLE — Fashion E-Commerce**
   - High-end clothing store experience with live shopping cart, rich category filters, and checkout flows.
   - Technologies: HTML5, Modern CSS, JavaScript, Django REST.

4. **NORTHWIND — Project Management Workspace**
   - Team productivity and task tracking suite with interactive canvases, timeline visualizations, and status dashboards.
   - Technologies: HTML5 Canvas, Modern CSS, Modular JavaScript, State Management, Vite.

5. **TRIP OS — Travel Planner Operating System**
   - All-in-one trip orchestration platform with interactive itinerary builder, destination discovery, and responsive travel cards.
   - Technologies: HTML5, Modern CSS, JavaScript, Django REST.

---

## 🛠️ Technologies & Architecture Overview

| Domain | Technologies & Libraries |
| :--- | :--- |
| **Frontend Core** | HTML5, Modern CSS3, JavaScript (ES6+), Vite |
| **Styling & UI** | Liquid Glass Design System, Responsive Grid, CSS Custom Properties |
| **Motion & UX** | GSAP (GreenSock Animation Platform), Lenis Smooth Scroll |
| **Machine Learning** | ONNX Runtime Web, Tensor Embeddings, Neural Network Presets |
| **Backend Framework**| Python 3.13, Django 5, Django REST Framework (DRF) |
| **Static & Serving** | Whitenoise, Gunicorn, Nginx Reverse Proxy |
| **Storage & Testing**| SQLite / PostgreSQL, Django Unit Testing Framework |

---

## 🔌 REST API Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health/` | Service health status and backend heartbeat |
| `POST` | `/api/contact/` | Submits contact messages with server-side validation |
| `GET` | `/api/projects/` | Retrieves the list of all portfolio showcase projects |
| `GET` | `/api/projects/<slug>/` | Retrieves in-depth metrics and technical case studies |
| `GET` | `/api/skills/` | Lists skill proficiencies, categories, and ratings |
| `GET` | `/api/profile/` | Developer biography, identity, and contact channels |

---

## 💻 Local Development Setup

### Prerequisites
- Python 3.11+ (Python 3.13 recommended)
- Node.js 18+ & npm

### 1. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Seed initial showcase data (optional)
python manage.py seed_data

# Start the Django development server
python manage.py runserver
# Backend runs at http://127.0.0.1:8000
```

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to the frontend directory
cd front

# Install npm dependencies
npm install

# Start the Vite development server
npm run dev
# Frontend runs at http://localhost:3000 (proxies /api to http://127.0.0.1:8000)
```

### 3. Production Build
```bash
# Build frontend assets into front/dist
npm --prefix front run build

# Collect static files into backend/staticfiles
python backend/manage.py collectstatic --noinput
```

---

## 🌐 Production Deployment Architecture

```text
Client Browser (https://aminez.ir)
       │
       ▼
  Nginx (Reverse Proxy + SSL Let's Encrypt + HTTP/2 + Caching)
   ├── / (HTML/JS/CSS) ──────► front/dist/ (Pre-rendered static files)
   ├── /static/ & /media/ ───► backend/staticfiles/
   └── /api/ & /admin/ ──────► Gunicorn WSGI Server (127.0.0.1:8000)
                                      │
                                      ▼
                                Django 5 REST Backend
```

---

## 📄 License & Copyright

© 2026 **Amin Esmaeilzadeh**. All rights reserved.
