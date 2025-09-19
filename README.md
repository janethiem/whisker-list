# Whisker List 🐾
A minimal full-stack To-Do application built with **.NET Core**, **SQLite**, and **React**. The goal is to demonstrate clean API design, simple data persistence, and a lightweight frontend that communicate seamlessly.

---

## ✨ Core MVP Features
1. **Task Creation**  
   • `POST /api/tasks` – add a new task (title required, description optional).  
2. **Task Listing**  
   • `GET /api/tasks` – return all tasks with id, title, description, and completion status.  
3. **Task Update**  
   • `PUT /api/tasks/{id}` – update title, description, or mark as completed.  
4. **Task Deletion**  
   • `DELETE /api/tasks/{id}` – remove a task.  
5. **Data Persistence**  
   • SQLite file-based DB.  
6. **Frontend UI**  
   • React SPA: list view, add/edit form, complete & delete buttons.  
7. **Validation & UX**  
   • Basic input validation on both client (required title) and server (model attributes).  
   • Loading states & error messages surfaced in the UI.
