# 📚 Book Library API

A RESTful API for managing a personal book library, built with Node.js, Express, and MongoDB. Features JWT-based authentication and ownership-based authorization — users can only edit or delete the books they created.

<!-- TODO: once deployed, add a live link here, e.g.: -->
<!-- **Live API:** https://your-deployed-url.com/api/books -->

---

## ✨ Features

- **Full CRUD** for books (create, read, update, delete)
- **JWT authentication** — register, log in, and receive a signed token
- **Ownership authorization** — only the user who created a book can update or delete it
- **Password security** — passwords are hashed with bcrypt, never stored in plain text
- **Centralized error handling** — one middleware translates errors (invalid IDs, validation failures) into clean HTTP responses
- **Input hardening** — field whitelisting on writes to prevent mass-assignment
- **Data relationships** — books reference their owner; users reference their books (Mongoose `populate`)

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| **Node.js** | Runtime |
| **Express** | Web framework / routing |
| **MongoDB** | Database |
| **Mongoose** | ODM (schemas, validation, queries) |
| **bcrypt** | Password hashing |
| **jsonwebtoken** | JWT auth tokens |
| **dotenv** | Environment variables |

<!-- TODO: remove any you don't actually use, add anything missing (e.g. a testing library once you add tests) -->

---

## 📡 API Endpoints

Base path: `/api/books` and `/api/users` <!-- TODO: confirm your actual mount paths from app.js -->

### Books

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|:-------------:|
| `GET` | `/api/books` | Get all books | No |
| `GET` | `/api/books/:id` | Get a single book | No |
| `POST` | `/api/books` | Create a new book | ✅ Yes |
| `PUT` | `/api/books/:id` | Replace a book (all fields) | ✅ Yes (owner only) |
| `PATCH` | `/api/books/:id` | Update part of a book | ✅ Yes (owner only) |
| `DELETE` | `/api/books/:id` | Delete a book | ✅ Yes (owner only) |

### Users & Auth

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|:-------------:|
| `POST` | `/api/users` | Register a new user | No |
| `GET` | `/api/users` | List users (with their books) | No |
| `POST` | `/api/login` | Log in, receive a JWT | No |

<!-- TODO: adjust if you added/removed any routes -->

**Authenticated requests** must include the token in the header:

```
Authorization: Bearer <your-token>
```

---

## 📖 Data Model

**Book**
```
title    String   (required)
author   String   (required)
year     String   (required)
genre    String   (required)
read     Boolean  (default: false)
user     ObjectId (reference to the owning User)
```

**User**
```
username      String   (required, unique)
name          String
passwordHash  String   (never the raw password)
books         [ObjectId]  (references to the user's books)
```

<!-- TODO: tweak field details to match your schemas exactly (e.g. year as Number if you change it) -->

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended) <!-- TODO: confirm your version -->
- A MongoDB database (local, or a free MongoDB Atlas cluster)

### Installation

```bash
# Clone the repo
git clone https://github.com/RAMSEYC4/Book-Library-Api.git
cd Book-Library-Api

# Install dependencies
npm install
```

### Environment variables

Create a `.env` file in the project root:

```
MONGODB_URI=your_mongodb_connection_string
SECRET=your_jwt_secret
PORT=3000
```

<!-- TODO: match these names EXACTLY to what your code reads (process.env.SECRET, etc.) -->

> ⚠️ Never commit your `.env` file. It's already in `.gitignore`.

### Running the app

```bash
npm run dev     # development (with auto-reload)   TODO: confirm your scripts
npm start       # production
```

The API will be available at `http://localhost:3000`. <!-- TODO: match your PORT -->

---

## 🧪 Example Requests

**Register a user**
```bash
POST /api/users
Content-Type: application/json

{
  "username": "ramsey",
  "name": "Cedou Ramsey",
  "password": "yourpassword"
}
```

**Log in**
```bash
POST /api/login
Content-Type: application/json

{
  "username": "ramsey",
  "password": "yourpassword"
}
# → returns { token, username, name }
```

**Create a book (authenticated)**
```bash
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "year": "2008",
  "genre": "Programming",
  "read": false
}
```

---

## 🗺️ Roadmap

- [ ] Automated tests
- [ ] Deployment (live URL)
- [ ] Pagination / filtering on `GET /api/books`
<!-- TODO: add or remove — this shows interviewers you know what's next -->

---

## 👤 Author

**Cedou Ramsey**
- GitHub: [@RAMSEYC4](https://github.com/RAMSEYC4)
<!-- TODO: add LinkedIn / portfolio if you want -->

---

<!-- Optional: add a license section if you want one, e.g. MIT -->

