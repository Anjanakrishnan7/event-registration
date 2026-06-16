# EventHub — Event Registration Platform

A full stack event registration platform built with Django REST Framework and React.

## Tech Stack
- **Backend:** Django 4, Django REST Framework, Simple JWT, SQLite
- **Frontend:** React (Vite), React Router, Axios
- **Auth:** JWT (access + refresh tokens)

## Features
- User registration and login with JWT auth
- Browse and search events
- Register for events (no duplicates)
- My Registrations page
- Pagination (6 events per page)
- Dark mode toggle (persisted)
- Docker support

## Quick Start (Local)

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker
```bash
docker-compose up --build
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | No | Register user |
| POST | /api/login | No | Login user |
| GET | /api/events | No | List all events |
| GET | /api/events/:id | No | Event detail |
| POST | /api/events/:id/register | Yes | Register for event |
| GET | /api/my-registrations | Yes | My registrations |

## Environment
No `.env` required for local dev. SQLite is used by default.
