# 🍔 FoodieHub — Fullstack Food Delivery App

A modern fullstack food delivery web application built with **React**, **Node.js**, **Express**, and **MongoDB**.  
It provides a complete ecosystem for **users** to browse and order food, and for **partners (restaurants)** to manage orders and track performance.

---

## 🚀 Features

### 👤 Authentication & Security
- JWT-based authentication system for secure login/signup  
- Passwords hashed with **bcrypt**  
- Protected routes for both users and partners  
- Auth middleware for role-based access control  

### 🍽️ User Features
- Browse restaurants and food items  
- Add items to cart and place orders  
- Track order status in real-time  
- Mobile-responsive UI for smooth experience  

### 🧑‍🍳 Partner Features
- Partner dashboard to manage orders  
- View total revenue, pending deliveries, and new reviews  
- Manage food menu items  

### ⚙️ Admin (optional)
- Manage users, partners, and orders  

---

## 🛠️ Tech Stack

| Category | Tech |
|-----------|------|
| **Frontend** | React.js, React Router, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT, bcrypt |
| **API Testing** | Postman |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## 🧩 Folder Structure

FoodieHub/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ └── App.jsx
│ └── package.json
│
├── server/ # Node + Express backend
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── middleware/
│ └── server.js
│
└── README.md


---

## 🧠 Key Learnings

- Implemented **full authentication system** from scratch with JWT.  
- Designed UI using **AI-generated ideas** + custom polish.  
- Managed role-based logic between **users** and **partners**.  
- Learned how to **connect frontend and backend APIs securely**.  

---

## 🔒 Authentication Flow

1. **User registers or logs in** → Backend returns JWT token.  
2. Token stored in client-side storage (localStorage).  
3. Every protected API request includes the token in headers.  
4. Middleware validates token and authorizes access.

---

## 🖼️ Screenshots

*(You can add your real screenshots later)*

| Landing Page | Partner Dashboard |
|---------------|------------------|
| ![Landing](screenshots/landing.png) | ![Dashboard](screenshots/dashboard.png) |

---

## ⚡ Quick Start


Environment Variables

Create a .env file inside the server/ folder:

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key

Run the app
# Backend
cd server
npm run dev

# Frontend
cd ../client
npm run dev


Now open http://localhost:5173 to view the app.
