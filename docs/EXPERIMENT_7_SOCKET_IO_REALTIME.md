# Experiment – 7: Real-Time Communication with Socket.IO

**Student Name:** Vikram Sindra  
**Class:** D15A  
**Roll No.:** 50  
**Subject:** Full Stack Development Lab (FSD Lab)

---

## 1. Aim
To integrate real-time bidirectional event notifications in the EventHub application using Socket.IO across the Express backend and React frontend.

---

## 2. Key Code Implementations

### 2.1 Backend Socket.IO Setup (`server/server.js`)
```javascript
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, reason);
  });
});

app.set("io", io);
```

### 2.2 Controller Notification Emits (`server/controllers/eventController.js`)
* **Event Creation:**
  ```javascript
  const io = req.app.get("io");
  io.emit("event:created", {
    message: `A new event has been added: ${event.title}`,
    event: { _id: event._id, title: event.title, date: event.date, location: event.location },
    createdAt: new Date(),
  });
  ```
* **Event Updation:**
  ```javascript
  const io = req.app.get("io");
  io.emit("event:updated", {
    message: `An event has been updated: ${event.title}`,
    event: { _id: event._id, title: event.title, date: event.date, location: event.location },
    createdAt: new Date(),
  });
  ```
* **Event Deletion:**
  ```javascript
  const io = req.app.get("io");
  io.emit("event:deleted", {
    message: `An event has been cancelled: ${event.title}`,
    event: { _id: event._id, title: event.title },
    createdAt: new Date(),
  });
  ```

### 2.3 React Notification Component (`client/src/components/NotificationBell.jsx`)
```jsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    function addNotification(notification) {
      setNotifications((prev) => [{ ...notification, id: `${Date.now()}-${Math.random()}` }, ...prev]);
    }

    socket.on("event:created", addNotification);
    socket.on("event:updated", addNotification);
    socket.on("event:deleted", addNotification);

    return () => {
      socket.off("event:created", addNotification);
      socket.off("event:updated", addNotification);
      socket.off("event:deleted", addNotification);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-white">
        🔔 {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      </button>
      {isOpen && (
        <div className="dropdown">
          <button onClick={() => setNotifications([])}>Clear all</button>
          {notifications.map((n) => (
            <div key={n.id}>
              <p>{n.message}</p>
              <small>{new Date(n.createdAt).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 3. Screenshots Guide
1. **Admin creating an event & user receiving notification** (Split-screen)
2. **Admin updating an event & user receiving notification** (Split-screen)
3. **Admin deleting an event & user receiving notification** (Split-screen)
4. **Backend terminal logs:** `Socket connected: <id>` and `Socket disconnected: <id>`
5. **Navbar with red notification count badge**
6. **Opened notification dropdown listing received messages**
