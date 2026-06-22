## Screenshots

### Add Course Form
![Add Course Form](image/2026-06-22 (2).png)

### Home page 
![home page] (image/2026-06-22 (3).png

###
![search bar](image/2026-06-22 (3).png)

###
![edit page] (image/2026-06-22 (2).png)



# CourseManagerApp

A full-stack Course Management application built with **React** (frontend) and **Express + MongoDB** (backend). Supports complete CRUD operations on courses, thumbnail image upload, and search/filter — matching the SDAC ReactJS test specification.

- **Database name:** `Test`
- **Collection name:** `sub`

---

## Project Structure

```
CourseManagerApp/
├── client/              # React frontend (Create React App)
│   ├── public/
│   └── src/
│       ├── api.js               # Axios calls to backend
│       ├── App.js                # Main app logic & state
│       ├── App.css               # Styling
│       ├── index.js / index.css
│       └── components/
│           ├── CourseList.js     # Course cards + thumbnails
│           ├── CourseForm.js     # Add/Edit form with image upload
│           ├── SearchBar.js      # Bonus: search/filter
│           └── Toast.js          # Success/error notifications
│
└── server/              # Express backend
    ├── server.js              # App entry point, connects to MongoDB
    ├── models/Course.js       # Mongoose schema (collection: "sub")
    ├── routes/courseRoutes.js # CRUD + image upload (multer)
    ├── uploads/               # Uploaded thumbnail images stored here
    └── .env                   # MONGO_URI, PORT
```

---

## Features Implemented

| Requirement | Status |
|---|---|
| Display course list (thumbnail, name, instructor, category, duration, level) | ✅ |
| Edit / Delete buttons per course | ✅ |
| Add Course form (all fields + file upload) | ✅ |
| New course + thumbnail appear immediately in the list | ✅ |
| Edit Course — loads existing data into form | ✅ |
| Keep existing thumbnail OR upload a new one while editing | ✅ |
| Save Changes updates the course | ✅ |
| Delete Course removes it from the list (and deletes the image file) | ✅ |
| **Bonus:** Search/filter by Course Name, Instructor, Category, Level | ✅ |

---

## Prerequisites

- **Node.js** (v16 or later recommended)
- **MongoDB** running locally, or a MongoDB Atlas connection string
  - Local default: `mongodb://127.0.0.1:27017/Test`
  - The app will automatically create the **`Test`** database and the **`sub`** collection the first time you add a course.

---

## Setup & Run

### 1. Backend (Express + MongoDB)

```bash
cd server
npm install
```

Check the `.env` file (already created) — edit `MONGO_URI` only if your MongoDB isn't running locally on the default port:

```
MONGO_URI=mongodb://127.0.0.1:27017/Test
PORT=5000
```

Start the server:

```bash
npm start
```

You should see:

```
✅ MongoDB connected -> Database: Test, Collection: sub
🚀 Server running on http://localhost:5000
```

### 2. Frontend (React)

In a separate terminal:

```bash
cd client
npm install
npm start
```

This opens the app at **http://localhost:3000**. The React dev server proxies `/api/...` calls to the backend on port 5000 automatically (configured via `"proxy"` in `client/package.json`).

---

## API Reference (for reference / testing with Postman)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | List all courses. Supports `?search=term` |
| GET | `/api/courses/:id` | Get a single course |
| POST | `/api/courses` | Create a course (multipart/form-data, field `thumbnail` for the file) |
| PUT | `/api/courses/:id` | Update a course (multipart/form-data). Send `existingThumbnail` to keep current image, or a new `thumbnail` file to replace it |
| DELETE | `/api/courses/:id` | Delete a course |

Course fields: `courseName`, `instructor`, `category`, `duration`, `level` (`Beginner` / `Intermediate` / `Advanced`), `thumbnail`.

---

## Notes

- Uploaded thumbnails are stored on disk in `server/uploads/` and served statically at `/uploads/<filename>`. The image path is saved in MongoDB.
- The Mongoose model explicitly pins the collection name to `sub` (third argument of `mongoose.model()`), so even though the model is named `Course`, MongoDB will store documents in `Test.sub`.
- Search is server-side: the search bar queries `/api/courses?search=...` and matches against course name, instructor, category, and level (case-insensitive).
- If MongoDB isn't running, the backend will log a connection error and exit — start MongoDB first (`mongod`) before `npm start` in the `server` folder.
