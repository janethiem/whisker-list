# WhiskerList 🐾

A clean, RESTful todo list API built with **ASP.NET Core** and **SQLite**. Demonstrates modern API design patterns, CRUD operations, and comprehensive error handling.

---

## 🚀 Quick Start (For Interviewers)

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download)

### Running the API
1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd whisker-list/src/WhiskerList.Api
   ```

2. **Run the application:**
   ```bash
   dotnet run
   ```

3. **API is now available at:**
   - **Base URL**: `http://localhost:5280/todo-tasks`
   - **Swagger UI**: `http://localhost:5280/swagger`

### Testing the API
- Use the included `WhiskerList.Api.http` file with REST Client extension
- Or test via Swagger UI at `http://localhost:5280/swagger`

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/todo-tasks` | Get all todo tasks (with filtering & sorting) |
| `GET` | `/todo-tasks/{id}` | Get a specific todo task |
| `POST` | `/todo-tasks` | Create a new todo task |
| `PUT` | `/todo-tasks/{id}` | Update an existing todo task |
| `PATCH` | `/todo-tasks/{id}/complete` | Toggle completion status |
| `DELETE` | `/todo-tasks/{id}` | Delete a todo task |
| `GET` | `/todo-tasks/stats` | Get todo statistics |

### Query Parameters (GET /todo-tasks)
- `isCompleted` (bool) - Filter by completion status
- `priority` (int) - Filter by priority (1=Low, 2=Medium, 3=High)
- `search` (string) - Search in title and description
- `sortBy` (string) - Sort by: title, createdAt, dueDate, priority
- `sortDescending` (bool) - Sort direction

### Example Requests
```http
# Get all completed tasks
GET /todo-tasks?isCompleted=true

# Search for tasks
GET /todo-tasks?search=documentation

# Get high priority tasks, sorted by due date
GET /todo-tasks?priority=3&sortBy=dueDate

# Create a new task
POST /todo-tasks
Content-Type: application/json

{
    "title": "Complete interview project",
    "description": "Build a clean REST API",
    "dueDate": "2025-09-25T10:00:00Z",
    "priority": 3
}
```

---

## 🏗️ Architecture & Design Decisions

### API Design
- **RESTful conventions** with clean, intuitive endpoints
- **Kebab-case URLs** (`/todo-tasks`) for consistency
- **Comprehensive CRUD operations** with partial updates
- **Rich filtering and sorting** capabilities

### Data Model
- **Integer IDs** for simplicity and performance
- **Timestamps** for audit trail (createdAt, updatedAt)
- **Priority levels** (1-3) for task organization
- **Optional due dates** for deadline tracking

### Technology Stack
- **ASP.NET Core 9.0** - Modern web framework
- **Entity Framework Core** - Clean data access
- **SQLite** - Zero-config database
- **Swagger/OpenAPI** - Interactive documentation

### Error Handling
- **Comprehensive exception handling** with logging
- **Proper HTTP status codes** (200, 201, 404, 500)
- **User-friendly error messages**
- **Input validation** with data annotations

---

## 🛠️ Features Implemented

✅ **Full CRUD Operations** - Create, Read, Update, Delete  
✅ **Advanced Filtering** - By status, priority, search terms  
✅ **Flexible Sorting** - Multiple fields, ascending/descending  
✅ **Partial Updates** - Only modify provided fields  
✅ **Quick Actions** - Toggle completion with PATCH  
✅ **Statistics Endpoint** - Overview of todo metrics  
✅ **Comprehensive Logging** - Request tracking and error logging  
✅ **API Documentation** - Interactive Swagger UI  
✅ **Request Validation** - Server-side input validation  
✅ **Clean Architecture** - Separation of concerns with DTOs
