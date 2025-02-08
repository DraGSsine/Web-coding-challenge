# To-Do List

A simple to-do list application built with Next.js for the frontend, Express.js for the backend, and MongoDB Atlas for database storage.

## Features
- Add, update, and delete tasks
- Mark tasks as completed
- Persistent data storage using MongoDB Atlas

## Tech Stack
- **Frontend:** Next.js (React)
- **Backend:** Express.js (Node.js)
- **Database:** MongoDB Atlas

## Setup Instructions

### Prerequisites
.env

### Installation

1. **Clone the repository:**
   ```sh
   clone the repo
   cd todo-list
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```

4. **Run the backend server:**
   ```sh
   cd backend
   node server.js
   ```
   The backend will run on `http://localhost:9090`

5. **Run the frontend:**
   ```sh
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

## API Endpoints
| Method | Endpoint     | Description            |
|--------|-------------|------------------------|
| GET    | `/tasks`    | Fetch all tasks        |
| POST   | `/tasks`    | Add a new task         |
| PUT    | `/tasks/:id` | Update a task         |
| DELETE | `/tasks/:id` | Delete a task         |

## License
This project is licensed under the MIT License.
