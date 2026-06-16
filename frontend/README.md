# EventHub – Event Registration Platform

## Overview

EventHub is a full-stack event registration platform built with React and Django REST Framework.

Users can:

* Register and log in using JWT authentication
* Browse available events
* View event details
* Register for events
* View their registered events
* Search and paginate events
* Switch between light and dark mode

---

## Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios

### Backend

* Django
* Django REST Framework
* JWT Authentication (SimpleJWT)

### Database

* SQLite

### DevOps

* Docker
* Docker Compose

---

## Features

### Authentication

* User Registration
* User Login
* User Logout
* JWT-based Authentication
* Password Hashing

### Event Management

* Event Listing
* Event Details
* Event Registration
* Duplicate Registration Prevention
* My Registrations

### Bonus Features

* Search Events
* Pagination
* Dark Mode
* Docker Setup
* Registration Confirmation Modal

---

## Project Structure

```text
backend/
├── api/
├── event_registration/
├── manage.py
├── requirements.txt

frontend/
├── src/
├── public/
├── package.json

docker-compose.yml
```

---

## Backend Setup

### 1. Navigate to backend

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

### 3. Activate Virtual Environment

Windows:

```bash
venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Run Migrations

```bash
python manage.py migrate
```

### 6. Seed Sample Events

```bash
python seed_events.py
```

### 7. Start Backend Server

```bash
python manage.py runserver
```

Backend URL:

```text
http://127.0.0.1:8000
```

---

## Frontend Setup

### 1. Navigate to frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## Docker Setup

Run the entire application using Docker:

```bash
docker-compose up --build
```

---

## Database Setup

Default database:

```text
SQLite
```

Database file:

```text
backend/db.sqlite3
```

Apply migrations:

```bash
python manage.py migrate
```

---

## API Documentation

### Register User

```http
POST /api/register
```

### Login User

```http
POST /api/login
```

### Get All Events

```http
GET /api/events
```

### Get Event Details

```http
GET /api/events/:id
```

### Register for Event

```http
POST /api/events/:id/register
```

### Get My Registrations

```http
GET /api/my-registrations
```

---

## Responsive Design

The application is responsive and optimized for:

* Mobile Devices
* Tablets
* Desktop Screens

---

## Assignment Requirements Covered

* Authentication
* Event Listing
* Event Registration
* My Registrations
* JWT Authentication
* Responsive Design
* Form Validation
* Loading States
* Error Handling
* Search
* Pagination
* Dark Mode
* Docker Setup

---

## Author

Full Stack Developer Intern Assessment Submission
