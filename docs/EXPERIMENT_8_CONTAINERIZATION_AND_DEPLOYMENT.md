# Experiment – 8: Containerization, CI/CD Pipeline and Deployment

**Student Name:** Vikram Sindra  
**Class:** D15A  
**Roll No.:** 50  
**Date:** 16/11/2026  
**Subject:** Full Stack Development Lab (FSD Lab)

---

## 1. Aim
To containerize the Web Application using Docker and implement CI/CD using GitHub Actions and cloud deployment platforms.

---

## 2. Problem Statement
Deploy the EventHub application (React frontend and Node.js backend) using Docker. Configure Docker Compose, automate code validation using GitHub Actions, and deploy the frontend and backend using Vercel and Render.

---

## 3. Theory Questions & Answers

### Q1. What is Docker and Containerization?
**Answer:**  
Docker is an open-source platform that enables developers to build, package, and run applications inside lightweight environments called containers. Containerization is the process of bundling an application along with its code, libraries, dependencies, and configuration files into a single portable unit. This ensures that the application runs consistently across different environments, such as a developer's laptop, testing servers, and production systems. Unlike virtual machines, containers share the host operating system's kernel, making them faster, more efficient, and significantly less resource-intensive.

### Q2. What is Docker Compose?
**Answer:**  
Docker Compose is a tool used to define and manage multi-container Docker applications. Instead of running several `docker run` commands manually with complex network flags, developers describe all services, networks, volumes, and environment variables in a single `docker-compose.yml` file. With a single command (`docker compose up`), Docker Compose automatically provisions, links, and starts all containers on an isolated bridge network. It simplifies orchestration for microservices, web servers, databases, and reverse proxies.

### Q3. What is a Dockerfile?
**Answer:**  
A Dockerfile is a text file that contains an ordered set of instructions used to build a Docker image. It specifies the base image (e.g., `node:20-alpine`), working directory, file copies, dependency installations, exposed ports, and default runtime commands. Docker reads the Dockerfile layer by layer, caching intermediate layers for fast builds. By using a Dockerfile, application environments become immutable, version-controlled, and reproducible across all platforms.

### Q4. What is GitHub Actions?
**Answer:**  
GitHub Actions is GitHub's built-in Continuous Integration and Continuous Deployment (CI/CD) platform. It allows developers to automate software workflows such as syntax verification, unit testing, linting, Docker image building, and production releases directly from their GitHub repository. Workflows are defined in YAML files inside the `.github/workflows/` directory and trigger automatically on events like `git push` or `pull_request`. GitHub Actions ensures high code quality, catches bugs before merge, and accelerates automated delivery.

---

## 4. Code Implementation

### 4.1 Backend Dockerfile (`Event-Management-system/server/Dockerfile`)
```dockerfile
# Use official Node.js Alpine base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package manifests and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
```

### 4.2 Frontend Dockerfile (`Event-Management-system/client/Dockerfile`)
*Multi-stage build compiling React with Vite and serving production static assets via Nginx.*
```dockerfile
# Stage 1: Build React Application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install

# Build environment arguments
ARG VITE_API_URL
ARG VITE_SOCKET_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

COPY . .
RUN npm run build

# Stage 2: Serve application with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4.3 Nginx Configuration (`Event-Management-system/client/nginx.conf`)
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://backend:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

### 4.4 `.dockerignore` Configurations
* **Backend (`Event-Management-system/server/.dockerignore`):**
  ```text
  node_modules
  npm-debug.log
  .env
  .git
  .gitignore
  ```
* **Frontend (`Event-Management-system/client/.dockerignore`):**
  ```text
  node_modules
  dist
  npm-debug.log
  .env
  .env.*
  .git
  .gitignore
  ```

### 4.5 Docker Compose (`docker-compose.yml`)
```yaml
services:
  backend:
    build:
      context: ./Event-Management-system/server
      dockerfile: Dockerfile
    container_name: eventhub-backend
    ports:
      - "5000:5000"
    env_file:
      - ./Event-Management-system/server/.env
    environment:
      - PORT=5000
      - CLIENT_ORIGIN=http://localhost:5173
    networks:
      - eventhub-network
    restart: unless-stopped

  frontend:
    build:
      context: ./Event-Management-system/client
      dockerfile: Dockerfile
    container_name: eventhub-frontend
    ports:
      - "5173:80"
    depends_on:
      - backend
    networks:
      - eventhub-network
    restart: unless-stopped

networks:
  eventhub-network:
    driver: bridge
```

### 4.6 GitHub Actions CI Workflow (`.github/workflows/ci.yml`)
```yaml
name: EventHub CI Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  backend-validation:
    name: Backend Code Verification
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: Event-Management-system/server/package-lock.json
      - name: Install Dependencies
        working-directory: Event-Management-system/server
        run: npm ci
      - name: Verify Server Syntax
        working-directory: Event-Management-system/server
        run: node -c server.js

  frontend-validation:
    name: Frontend Lint & Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: Event-Management-system/client/package-lock.json
      - name: Install Dependencies
        working-directory: Event-Management-system/client
        run: npm ci
      - name: Run ESLint
        working-directory: Event-Management-system/client
        run: npm run lint
      - name: Build React Application
        working-directory: Event-Management-system/client
        run: npm run build
```

### 4.7 Deployment Configurations for Vercel and Render

#### Vercel (`Event-Management-system/client/vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://eventhub-backend-xhd2.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

#### Render Blueprint (`render.yaml`)
```yaml
services:
  - type: web
    name: eventhub-backend
    env: node
    rootDir: Event-Management-system/server
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: PORT
        value: 5000
      - key: JWT_EXPIRES_IN
        value: 1d
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: CLIENT_ORIGIN
        sync: false
```

---

## 5. Step-by-Step Execution Guide

### Step 1: Run Multi-Container Setup Locally with Docker Compose
1. Launch **Docker Desktop** on your PC.
2. Stop any local server processes occupying ports `5000` or `5173`.
3. Open a terminal in the project root and run:
   ```bash
   docker compose up -d --build
   ```
4. Verify both containers are up:
   ```bash
   docker ps
   ```
5. Open `http://localhost:5173` in your browser to verify the application running via Docker.
6. 📸 **Capture Screenshot 1:** Terminal showing `docker ps` or Docker Desktop dashboard with green running containers.

---

### Step 2: Trigger and Verify GitHub Actions CI Pipeline
1. Any commit pushed to branch `main` automatically triggers the workflow.
2. Go to your repository on GitHub:  
   👉 `https://github.com/Vikramsindra/FSD-Lab-Event-Management/actions`
3. Click on the latest workflow run.
4. Verify both jobs pass with green checkmarks:
   * **Backend Code Verification** (Checks dependencies & server syntax)
   * **Frontend Lint & Build** (Runs ESLint and executes Vite build)
5. 📸 **Capture Screenshot 2:** GitHub Actions page showing green checkmarks.

---

### Step 3: Deploy Backend on Render
1. Open [dashboard.render.com](https://dashboard.render.com) and click **New +** &rarr; **Web Service**.
2. Connect repository: `Vikramsindra/FSD-Lab-Event-Management`.
3. Configure settings:
   * **Root Directory:** `Event-Management-system/server`
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
4. Add Environment Variables:
   * `PORT`: `5000`
   * `MONGODB_URI`: *(Your MongoDB connection string)*
   * `JWT_SECRET`: *(Your secret key)*
   * `JWT_EXPIRES_IN`: `1d`
   * `CLIENT_ORIGIN`: `*`
5. Click **Deploy Web Service**.
6. Deployment URL generated: `https://eventhub-backend-container.onrender.com`.
7. 📸 **Capture Screenshot 3:** Render dashboard showing status **`Live`** and the service URL.

---

### Step 4: Deploy Frontend on Vercel
1. Open [vercel.com](https://vercel.com) and click **Add New…** &rarr; **Project**.
2. Select your repository `Vikramsindra/FSD-Lab-Event-Management` and click **Import**.
3. Configure settings:
   * **Framework Preset:** `Vite`
   * **Root Directory:** Click Edit and select `Event-Management-system/client`.
4. In **Environment Variables**, add:
   * `VITE_SOCKET_URL`: `https://eventhub-backend-container.onrender.com`
   * `VITE_API_URL`: `https://eventhub-backend-container.onrender.com`
5. Click **Deploy**.
6. 📸 **Capture Screenshot 4:** Vercel deployment overview showing **Ready (Production)**.

---

### Step 5: Verify Live Deployed Application
1. Click the production link from Vercel: 👉 [https://fsd-lab-event-management.vercel.app/](https://fsd-lab-event-management.vercel.app/).
2. Log in, create/browse events, and verify real-time Socket.IO notifications connecting to Render.
3. 📸 **Capture Screenshot 5:** Full browser window displaying the live online EventHub with the production URL in the address bar.

---

## 6. Screenshots Checklist

| # | Screenshot Target | Where to Capture |
| :--- | :--- | :--- |
| **1** | Docker configuration and running containers | Docker Desktop or terminal output of `docker ps` |
| **2** | Successful GitHub Actions CI pipeline | GitHub Actions workflow execution page with green checkmarks |
| **3** | Backend deployment on Render | Render service dashboard showing `Status: Live` |
| **4** | Frontend deployment on Vercel | Vercel Project page showing status `Ready (Production)` |
| **5** | EventHub running successfully online | Browser showing live deployed frontend interacting with Render backend |
