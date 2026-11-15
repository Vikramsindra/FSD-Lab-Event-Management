# EventHub - Full Stack Event Management System

EventHub is a modern, full-stack event management and discovery platform built with the MERN stack (MongoDB, Express, React, Node.js) and enhanced with real-time notifications powered by Socket.IO.

---

## 🚀 Features

- **Authentication & Authorization:**
  - Secure user registration and login with bcrypt password hashing.
  - Stateless authentication using JSON Web Tokens (JWT).
  - Role-Based Access Control (RBAC) separating regular `user` and `admin` roles.
  - Protected client routes with automatic session verification.

- **Event Discovery & Filtering:**
  - Browse upcoming events with responsive card layouts.
  - Search events by title or description.
  - Filter events dynamically by location and date ranges.

- **Event Management (Admin Only):**
  - Dedicated Admin Dashboard.
  - Create new events with input validation (title, description, date, time, location).
  - Update existing event details in real-time.
  - Delete events with automatic cleanup of associated attendee registrations.
  - Review all system-wide attendee registrations.

- **Event Registration (Users):**
  - One-click registration for upcoming events.
  - "My Registrations" view to track booked events.
  - Ability to cancel personal registrations.

- **Real-Time Notifications (Socket.IO):**
  - Instant live notifications broadcast to connected users when an event is **created**, **updated**, or **cancelled/deleted**.
  - Interactive notification bell in the navbar with an unread badge counter.
  - Notification dropdown panel showing received notices, connection status, and "Clear all" action.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS
- **Real-Time Client:** Socket.IO Client (`socket.io-client`)
- **Icons & UI:** Custom modern responsive components

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Real-Time Server:** Socket.IO (`socket.io`)
- **Authentication:** `jsonwebtoken` (HS256) & `bcryptjs`
- **CORS & Middleware:** Configured for local cross-origin development

---

## 📁 Project Structure

```text
FSD-Lab-Event-Management/
├── .gitignore
├── README.md
└── Event-Management-system/
    ├── client/
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── Button.jsx
    │   │   │   ├── EventCard.jsx
    │   │   │   ├── Loading.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── NotificationBell.jsx   # Real-time notification component
    │   │   │   └── ProtectedRoute.jsx     # Route guard for Auth & Admin
    │   │   ├── context/
    │   │   │   └── AuthContext.jsx        # Global authentication state
    │   │   ├── hooks/
    │   │   │   └── useAuth.js
    │   │   ├── pages/
    │   │   │   ├── AdminDashboard.jsx     # Admin CRUD & registrations overview
    │   │   │   ├── Events.jsx             # Public event listing & search
    │   │   │   ├── Home.jsx               # Landing page
    │   │   │   ├── Login.jsx              # User login
    │   │   │   ├── MyRegistrations.jsx    # User registrations management
    │   │   │   └── Register.jsx           # User registration
    │   │   ├── services/
    │   │   │   └── api.js                 # API service layer
    │   │   ├── App.jsx                    # Routing configuration
    │   │   ├── main.jsx                   # Entry point
    │   │   └── index.css                  # Tailwind styles
    │   ├── .env                           # Client environment variables
    │   ├── package.json
    │   └── vite.config.js
    │
    └── server/
        ├── config/
        │   └── db.js                      # MongoDB connection setup
        ├── controllers/
        │   ├── authController.js          # Register, Login, Me
        │   ├── eventController.js         # Event CRUD & Socket.IO emits
        │   └── registrationController.js  # Registration management
        ├── middleware/
        │   ├── authMiddleware.js          # protect & adminOnly middleware
        │   └── errorMiddleware.js         # notFound & errorHandler
        ├── models/
        │   ├── Event.js                   # Event schema
        │   ├── Registration.js            # Registration schema
        │   └── User.js                    # User schema (roles: user, admin)
        ├── routes/
        │   ├── authRoutes.js
        │   ├── eventRoutes.js
        │   └── registrationRoutes.js
        ├── utils/
        │   └── generateToken.js           # JWT generator
        ├── .env                           # Server environment variables
        ├── package.json
        └── server.js                      # Express + HTTP + Socket.IO server
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Vikramsindra/FSD-Lab-Event-Management.git
cd FSD-Lab-Event-Management/Event-Management-system
```

---

### 2. Backend Setup
Navigate to the server directory:
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:5173
```

Start the backend server:
```bash
# Development mode
npm run dev

# Or production mode
npm start
```
*The server will run on `http://localhost:5000`.*

---

### 3. Frontend Setup
In a new terminal window, navigate to the client directory:
```bash
cd client
npm install
```

Create a `.env` file inside `client/`:
```env
VITE_SOCKET_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend will run on `http://localhost:5173`.*

---

## 📡 API Reference

### Authentication Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (`role: "user"`) | Public |
| `POST` | `/api/auth/login` | Login and obtain JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private |

### Events Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | List all events (supports search/filter) | Public |
| `GET` | `/api/events/:id` | Get event details by ID | Public |
| `POST` | `/api/events` | Create a new event | Admin |
| `PUT` | `/api/events/:id` | Update an existing event | Admin |
| `DELETE` | `/api/events/:id` | Delete an event | Admin |

### Registrations Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/registrations` | Register for an event | Private (User) |
| `GET` | `/api/registrations/me` | Get current user's registrations | Private (User) |
| `DELETE` | `/api/registrations/:id`| Cancel a registration | Private (User) |
| `GET` | `/api/registrations` | View all registrations | Admin |

---

## ⚡ Real-Time Socket.IO Events

| Event Name | Direction | Payload | Trigger |
| :--- | :--- | :--- | :--- |
| `event:created` | Server &rarr; Client | `{ message, event, createdAt }` | Admin creates an event |
| `event:updated` | Server &rarr; Client | `{ message, event, createdAt }` | Admin updates an event |
| `event:deleted` | Server &rarr; Client | `{ message, event: { _id, title }, createdAt }` | Admin deletes/cancels an event |

---

## 👥 Roles & Permissions

- **Guest:** Can view home page, browse events, and register/login.
- **User (`role: "user"`):** Can browse events, register for events, view/cancel own registrations, and receive live notifications.
- **Admin (`role: "admin"`):** Has full user capabilities plus access to Admin Dashboard, event creation, modification, deletion, and attendee list inspection.
