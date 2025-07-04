# Todo MERN Application

A full-stack Todo application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Screenshots & Demo

### Demo Video
[📹 Watch Demo Video](https://drive.google.com/file/d/1VXkRQlkTgNsguHIJTLSR2ieuelFNrEVN/view?usp=sharing)

### Application Screenshots

#### Dark Theme

<div align="center">
  <img src="https://raw.githubusercontent.com/subu0106/Stock-Market-Dashboard/main/assets/DT-1.png" alt="Dark Theme View 1" width="45%">
</div>

####  Light Theme

<div align="center">
  <img src="https://raw.githubusercontent.com/subu0106/Stock-Market-Dashboard/main/assets/LT-1.png" alt="Light Theme View 1" width="45%">
</div>

## Features

- Full CRUD operations (Create, Read, Update, Delete)
- Real-time todo management with MongoDB
- Responsive Bootstrap UI
- Form validation and error handling
- Edit mode with cancel functionality

## Tech Stack

- Frontend: React.js + Bootstrap CSS
- Backend: Node.js + Express.js
- Database: MongoDB with Mongoose
- API: RESTful endpoints with CORS support

## Project Structure

```
TODO-MERN/
├── frontend/          # React application
│   ├── src/
│   │   └── Todo.js   # Main Todo component
│   └── package.json
├── backend/           # Express server
│   ├── server.js     # Main server file
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd TODO-MERN
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start MongoDB**
   - Make sure MongoDB is running on `mongodb://localhost:27017`

2. **Start the Backend Server**
   ```bash
   cd backend
   node server.js
   ```
   Server will run on `http://localhost:8000`

3. **Start the Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/todos` | Get all todos |
| POST   | `/todos` | Create a new todo |
| PUT    | `/todos/:id` | Update a todo |
| DELETE | `/todos/:id` | Delete a todo |

## Usage

1. **Add Todo**: Enter title and description, then click "Submit"
2. **Edit Todo**: Click "Edit" button, modify fields, then click "Update"
3. **Delete Todo**: Click "Delete" button and confirm
4. **Cancel Edit**: Click "Cancel" to exit edit mode

## Dependencies

### Backend
- express
- mongoose
- cors

### Frontend
- react
- react-dom
- react-scripts


## License

This project is open source and available under the [MIT License](LICENSE).
