# Lost & Found Management System

A full-stack app where users report lost or found items, and an admin can manage every report.

## Features

- Register and login with JWT authentication
- Roles: Admin and User
- Users can create, view, edit, and delete their own reports
- Admin can view, update the status of, and delete any report
- Filter reports by type (`LOST` / `FOUND`) and status (`OPEN` / `CLAIMED` / `CLOSED`)

## Tech stack

- Frontend: React.js, Vite, React Router
- Backend: Node.js, Express.js
- Database: MongoDB Atlas, Mongoose
- Auth: JWT, bcrypt

## Team members

- Team lead: Kavya — roll number
- Anshika — roll number
- Bannsal — roll number

## API endpoints

| Method | Path | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/items` | Logged-in user |
| GET | `/api/items/mine` | Logged-in user |
| GET | `/api/items/:id` | Owner or Admin |
| PUT | `/api/items/:id` | Owner |
| DELETE | `/api/items/:id` | Owner or Admin |
| GET | `/api/items` | Admin |
| PUT | `/api/items/:id/status` | Admin |

## Setup instructions

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`. The backend runs at `http://localhost:5000`.

## Environment variables

Backend (`backend/.env`):

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection
JWT_SECRET=your_secret
```

Frontend (`frontend/.env`):

```
VITE_API_URL=http://localhost:5000/api
```

Never commit a real `.env` file. Commit only `.env.example`.

## Screenshots

Add screenshots after the pages are working.

## Deployment links

- Frontend:
- Backend:
