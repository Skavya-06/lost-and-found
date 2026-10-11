# Lost & Found Management System - Backend API

Node.js + Express + MongoDB backend built for the Lost & Found Management platform.

---

## 🚀 Features

- **JWT Authentication**: Secure user registration and login with bcrypt password hashing.
- **Role-Based Access Control**: Standard `user` role and elevated `admin` privileges.
- **Item Reporting & Lifecycle**:
  - Report `LOST` and `FOUND` items.
  - Track statuses: `OPEN`, `CLAIMED`, `CLOSED`.
  - Filter items by category, type, and search query.
- **User Item Management**: Fetch and manage items created by the logged-in user (`/api/items/mine`).
- **Admin Moderation**: Admins can oversee all items, update statuses, and delete reports.
- **Database Seeder**: Preloaded with initial users and demo items.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB / Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **Security & Config**: `cors`, `dotenv`

---

## 📁 Directory Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   └── itemController.js     # Lost & found items CRUD & status
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & admin check
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Item.js               # Item report schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── itemRoutes.js         # /api/items routes
│   └── server.js                 # Express app entrypoint
├── .env.example
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (or edit existing `.env`):
```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lost-and-found
JWT_SECRET=supersecretlostandfoundjwtkey_2026
```
*(For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string).*

### 3. Start the Server
Development mode (with auto-reload via nodemon):
```bash
npm run dev
```

Production start:
```bash
npm start
```

API will be live at: `http://localhost:5000/api`

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (`name`, `email`, `password`, `role`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Protected | Get profile of logged-in user |

### 📦 Lost & Found Items (`/api/items`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/items` | Public | List items (supports `?type=&status=&category=&search=`) |
| `GET` | `/api/items/mine` | Protected | List items reported by logged-in user |
| `GET` | `/api/items/:id` | Public | Get single item details |
| `POST` | `/api/items` | Protected | Create new item report |
| `PUT` | `/api/items/:id` | Owner / Admin | Update item report details |
| `PUT` | `/api/items/:id/status`| Admin | Update item status (`OPEN`, `CLAIMED`, `CLOSED`) |
| `DELETE`| `/api/items/:id` | Owner / Admin | Permanently delete item report |
