# 🎬 IMovies — Cinema Ticket Booking System

IMovies is a full-stack cinema ticket booking web application built using the **MERN stack (MongoDB, Express.js, React.js, and Node.js)**. It provides a simple and user-friendly platform where users can explore movies, select seats, and book cinema tickets online.

## ✨ Features

- 🎥 **Movie Listing:** Browse available movies.
- 🔐 **User Authentication:** Register and log in securely.
- 💺 **Seat Selection:** Select seats for your preferred movie show.
- 🎟️ **Ticket Booking:** Book tickets and view booking confirmation.
- 🔄 **Real-Time Availability Checks:** Prevent duplicate bookings for the same seats through backend validation.
- 🗄️ **Database Integration:** Store movie, user, and booking information in MongoDB.
- 🔒 **Secure Authentication:** Use JSON Web Tokens (JWT) and password hashing.
- 🎨 **User-Friendly Interface:** A clean React-based interface for browsing and booking movies.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- CSS
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

## 📂 Project Structure

```text
imovies/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account or a local MongoDB server
- Git

### 1. Clone the repository

```bash
git clone https://github.com/AliAkbarkhan06/imovies-cinema-booking.git
cd imovies-cinema-booking
```

### 2. Configure and run the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Replace the placeholder values with your own credentials. Never upload your actual `.env` file to GitHub.

Start the backend server:

```bash
npm run dev
```

### 3. Configure and run the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in your terminal, usually:

http://localhost:5173

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/movies` | Fetch available movies |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/bookings` | Create a ticket booking |

## 🔮 Future Enhancements

- Online payment gateway integration
- Movie search and filtering
- Admin dashboard for managing movies and showtimes
- Email booking confirmations
- Deployment to a live hosting platform

## 👨‍💻 Author

**Ali Akbar Khan**

GitHub: [@AliAkbarkhan06](https://github.com/AliAkbarkhan06)

## 📌 Project Status

Developed as a full-stack web development project to practice frontend development, REST API integration, authentication, database management, and ticket-booking workflows.

---

⭐ If you like this project, consider giving the repository a star!