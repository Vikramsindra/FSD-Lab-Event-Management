# EventHub - Full Stack Event Management System

[![EventHub CI Pipeline](https://github.com/Vikramsindra/FSD-Lab-Event-Management/actions/workflows/ci.yml/badge.svg)](https://github.com/Vikramsindra/FSD-Lab-Event-Management/actions)
[![Frontend Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://fsd-lab-event-management.vercel.app/)
[![Backend Deployed on Render](https://img.shields.io/badge/Backend-Render%20Container-46E3B7?logo=render)](https://eventhub-backend-container.onrender.com/)
[![Docker Containerized](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)](https://github.com/Vikramsindra/FSD-Lab-Event-Management)

EventHub is a modern, production-ready event management platform built using the MERN stack (MongoDB, Express.js, React, Node.js), containerized with Docker, automated with GitHub Actions CI/CD, and enhanced with real-time notifications via Socket.IO.

---

## 🌐 Live Deployments

| Component | Platform | Deployment Type | Live URL |
| :--- | :--- | :--- | :--- |
| **Frontend Application** | **Vercel** | React / Vite SPA on Edge CDN | 👉 [https://fsd-lab-event-management.vercel.app/](https://fsd-lab-event-management.vercel.app/) |
| **Backend API & WebSockets** | **Render** | Docker Container Web Service | 👉 [https://eventhub-backend-container.onrender.com/](https://eventhub-backend-container.onrender.com/) |
| **API Health Check** | **Render** | Live Status Endpoint | 👉 [https://eventhub-backend-container.onrender.com/api/health](https://eventhub-backend-container.onrender.com/api/health) |

---

## 🚀 Key Features

### 1. Authentication & Role-Based Access Control (RBAC)
- Secure user registration and login with `bcryptjs` password hashing.
- Stateless authentication using JSON Web Tokens (HS256 JWT).
- Role segregation:
  - **`user`**: Can explore events, register for events, cancel bookings, and receive live notifications.
  - **`admin`**: Full access to Admin Dashboard, event creation, live edits, cancellations, and attendee management.
- Protected client-side routing with automatic session recovery and unauthorized redirects.

### 2. Event Discovery & Management
- Search events dynamically by keyword in title or description.
- Filter events by location and date ranges.
- Full Admin CRUD operations with input validation.
- Automatic cascade deletion of attendee registrations when an event is cancelled.

### 3. Real-Time Notifications (Socket.IO)
- Instant WebSocket event broadcasts whenever an admin creates, updates, or cancels an event.
- Interactive notification bell in the navbar displaying unread count badges.
- Scrollable notification dropdown with live timestamps, connection status indicators, and clear actions.

### 4. Containerization & DevOps
- Fully containerized with multi-stage Docker builds.
- Local multi-service orchestration with **Docker Compose**.
- Production-grade **Nginx** reverse proxy for the frontend container.
- Automated Continuous Integration (CI) pipeline via **GitHub Actions** checking backend syntax and frontend build integrity.
- Automated Continuous Deployment (CD) connected to Render and Vercel.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, React Router v7, Socket.IO Client (`socket.io-client`) |
| **Backend** | Node.js (v20), Express.js, Socket.IO (`socket.io`), JWT (`jsonwebtoken`), bcryptjs |
| **Database** | MongoDB Atlas with Mongoose ODM |
| **Containerization** | Docker, Docker Compose, Multi-stage builds, Alpine Linux, Nginx |
| **CI / CD** | GitHub Actions (`.github/workflows/ci.yml`) |
| **Hosting & Cloud** | Vercel (Edge CDN) & Render (Docker Web Service) |

---

## 📁 Repository Structure

```text
FSD-Lab-Event-Management/
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI workflow
├── docs/                              # Full Lab Manuals & Experiment Reports
│   ├── README.md                      # Documentation Index
│   ├── EXPERIMENT_7_SOCKET_IO_REALTIME.md
│   └── EXPERIMENT_8_CONTAINERIZATION_AND_DEPLOYMENT.md
├── docker-compose.yml                 # Multi-container orchestration (Backend + Frontend)
├── render.yaml                        # Render Infrastructure-as-Code Blueprint
├── .gitignore
├── README.md
└── Event-Management-system/
    ├── client/
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── Navbar.jsx         # Responsive Navigation Bar
    │   │   │   ├── NotificationBell.jsx # Real-time Socket.IO notification component
    │   │   │   ├── ProtectedRoute.jsx # Client-side route guard
    │   │   │   └── EventCard.jsx
    │   │   ├── pages/
    │   │   │   ├── AdminDashboard.jsx # Admin management & attendee review
    │   │   │   ├── Events.jsx         # Public events discovery & filtering
    │   │   │   ├── Home.jsx           # Landing page
    │   │   │   ├── Login.jsx          # User login
    │   │   │   ├── MyRegistrations.jsx# Personal registration tracker
    │   │   │   └── Register.jsx       # User registration
    │   │   ├── services/
    │   │   │   └── api.js             # API request service layer
    │   │   ├── App.jsx                # Application routes
    │   │   └── main.jsx               # Entry point
    │   ├── Dockerfile                 # Multi-stage Nginx container build
    │   ├── nginx.conf                 # Nginx SPA fallback & proxy configuration
    │   ├── vercel.json                # Vercel SPA rewrites & API proxy
    │   ├── .dockerignore
    │   ├── package.json
    │   └── vite.config.js
    │
    └── server/
        ├── config/
        │   └── db.js                  # MongoDB Atlas connection
        ├── controllers/
        │   ├── authController.js      # Auth logic (Register, Login, Me)
        │   ├── eventController.js     # Event CRUD & Socket.IO emits
        │   └── registrationController.js
        ├── middleware/
        │   ├── authMiddleware.js      # protect & adminOnly middleware
        │   └── errorMiddleware.js     # 404 & error handlers
        ├── models/
        │   ├── User.js                # User schema (roles: user, admin)
        │   ├── Event.js               # Event schema
        │   └── Registration.js        # Registration schema
        ├── routes/
        │   ├── authRoutes.js
        │   ├── eventRoutes.js
        │   └── registrationRoutes.js
        ├── Dockerfile                 # Node.js Alpine container build
        ├── .dockerignore
        ├── package.json
        └── server.js                  # Express + HTTP + Socket.IO server
```

---

## ⚡ Running the Project with Docker (Recommended)

Run the entire full-stack application (Frontend + Backend + Network) with a single command:

```bash
# 1. Build and start containers in background
docker compose up -d --build

# 2. Check running container status
docker ps

# 3. View live combined logs
docker compose logs -f

# 4. Stop all containers
docker compose down
```

* **Frontend:** Open [http://localhost:5173](http://localhost:5173) in your browser.
* **Backend:** Accessible at [http://localhost:5000](http://localhost:5000).

---

## 💻 Manual Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/Vikramsindra/FSD-Lab-Event-Management.git
cd FSD-Lab-Event-Management/Event-Management-system
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in `server/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:5173
```
Run backend:
```bash
npm run dev
```

### 3. Frontend Setup
In a new terminal:
```bash
cd client
npm install
```
Create a `.env` file in `client/`:
```env
VITE_SOCKET_URL=http://localhost:5000
```
Run frontend:
```bash
npm run dev
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login and receive JWT | Public |
| `GET` | `/api/auth/me` | Verify token & return profile | Authenticated |

### Events
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | List events with optional search/date filters | Public |
| `GET` | `/api/events/:id` | Fetch specific event details | Public |
| `POST` | `/api/events` | Create a new event | Admin Only |
| `PUT` | `/api/events/:id` | Update an event | Admin Only |
| `DELETE` | `/api/events/:id` | Cancel/delete an event | Admin Only |

### Registrations
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/registrations` | Book a seat for an event | User |
| `GET` | `/api/registrations/me` | View personal event registrations | User |
| `DELETE` | `/api/registrations/:id` | Cancel personal registration | User |
| `GET` | `/api/registrations` | View all system registrations | Admin Only |

---

## 🔄 Real-Time Events (Socket.IO)

| Event Name | Direction | Trigger | Payload |
| :--- | :--- | :--- | :--- |
| `event:created` | Server &rarr; Client | Admin creates a new event | `{ message, event: { _id, title, date, location }, createdAt }` |
| `event:updated` | Server &rarr; Client | Admin edits an event | `{ message, event: { _id, title, date, location }, createdAt }` |
| `event:deleted` | Server &rarr; Client | Admin deletes an event | `{ message, event: { _id, title }, createdAt }` |

---

## 🔄 CI/CD Pipeline (GitHub Actions)

The workflow defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) triggers automatically on every push or pull request to the `main` branch:

1. **Backend Code Verification:** Checks Node.js 20 environment, clean dependency installation (`npm ci`), and syntax check (`node -c server.js`).
2. **Frontend Lint & Build:** Runs ESLint across all React components and verifies the production build (`npm run build`).

---

## 👨‍💻 Author & Lab Details

* **Author:** Vikram Sindra
* **Class:** D15A
* **Roll No.:** 50
* **Course:** Full Stack Development Lab (FSD Lab)
* **Date:** 16/11/2026
