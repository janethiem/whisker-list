# WhiskerList 🐾

A full-stack todo list application with a **React TypeScript** frontend and **ASP.NET Core** backend. Demonstrates modern web development practices, clean architecture, and comprehensive testing.

---

## 🚀 Quick Start (For Interviewers)

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/) and npm

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd whisker-list
   ```

2. **Start the Backend API:**
   ```bash
   cd backend/WhiskerList.Api
   dotnet run
   # API runs at http://localhost:5280
   ```

3. **Start the Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   # Frontend runs at http://localhost:5173
   ```

4. **Access the application:**
   - **Frontend UI**: http://localhost:5173
   - **API Documentation**: http://localhost:5280/swagger

---

## 🛠️ Features Implemented

### Core Functionality
✅ **Full CRUD Operations** - Create, read, update, delete tasks  
✅ **Task Management** - Mark complete/incomplete, set priorities (1-3)  
✅ **Due Dates** - Optional deadline tracking  
✅ **Real-time Updates** - Optimistic UI updates with React Query  

### Advanced Features
✅ **Search & Filtering** - By completion status, priority, and text search  
✅ **Flexible Sorting** - By creation date, title, due date, priority, updated date  
✅ **Statistics API** - Task completion metrics endpoint  
✅ **Custom Icons** - Cat-themed icon set for UI elements  

### Developer Experience
✅ **Comprehensive Testing** - Unit tests for both frontend and backend  
✅ **Type Safety** - Full TypeScript implementation  
✅ **API Documentation** - Interactive Swagger/OpenAPI docs  
✅ **Clean Architecture** - Proper separation with DTOs  
✅ **Error Handling** - Graceful error states and user feedback  
✅ **Loading States** - Visual feedback during operations  

---

## 📋 API Documentation

All API endpoints are documented with Swagger/OpenAPI. Visit `http://localhost:5280/swagger` after starting the backend to explore the interactive documentation.

---

## 🏗️ Architecture & Design Decisions

### Technology Stack
**Backend:**
- **ASP.NET Core 9.0** - Modern web framework
- **Entity Framework Core** - ORM with migrations
- **SQLite** - Zero-config embedded database

**Frontend:**
- **React 18** with TypeScript - Type-safe component library
- **Vite** - Fast build tool and dev server
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first CSS framework

### Key Design Principles
- **Clean Architecture** - Separation of concerns with DTOs
- **RESTful API Design** - Intuitive endpoints and HTTP semantics
- **Type Safety** - Full TypeScript coverage
- **Performance** - Optimistic updates and efficient caching

### UI Design
- **Custom Icon System** - Cat-themed PNG icons with semantic mapping
- **Inline Styling** - Custom CSS-in-JS for theme consistency
- **Component Structure** - Organized by feature (todo/) and reusable UI components

---

## 📝 Assumptions and Implementation Notes

### Data Model Assumptions
- **Task IDs**: Auto-incrementing integers (sufficient for MVP scale)
- **Priority System**: Simple 1-3 scale (Low, Medium, High) for user simplicity
- **Due Dates**: Optional to support both deadline-driven and casual task management
- **Soft Delete**: Not implemented in MVP - tasks are permanently deleted

### API Design Choices
- **PATCH for Updates**: Partial updates only modify provided fields
- **Query Parameters**: Kept simple and intuitive for filtering/sorting
- **Error Handling**: Standardized HTTP status codes with descriptive messages
- **No Authentication**: Omitted for MVP simplicity - single user assumed

### Frontend Architecture
- **Component Structure**: Feature-based organization with reusable UI components
- **State Management**: React Query for server state, local React state for UI
- **Styling**: Tailwind utility classes with custom inline styles for theming
- **Form Handling**: Controlled components with client-side validation

---

## 📈 Scalability Considerations

### Current Architecture Strengths
- **Stateless API**: Horizontally scalable backend design
- **Database Migrations**: Schema versioning for safe deployments
- **Component Reusability**: Modular frontend architecture
- **Query Optimization**: React Query provides client-side caching

### Known Limitations
- **SQLite**: Single-file database limits concurrent access in production
- **No Pagination**: All tasks loaded at once (acceptable for MVP user loads)
- **No Authentication**: Single-user application model
- **Client-side Filtering**: Full dataset transferred for search/filter operations

---

## 🚀 Future Enhancements

### Performance & Scale
- **Pagination Implementation**: Server-side pagination or infinite scroll for large datasets
- **Database Migration**: PostgreSQL or SQL Server for production workloads
- **Caching Layer**: Redis for session management and frequently accessed data
- **CDN Integration**: Static asset optimization and global distribution

### User Experience
- **Statistics Dashboard**: Utilize existing `/todo-tasks/stats` endpoint for productivity insights
- **Soft Delete System**: Allow users to undo task deletion with recovery period
- **Bulk Operations**: Multi-select and batch actions for task management
- **Drag & Drop**: Visual task reordering and priority management

### Security & Authentication
- **JWT Authentication**: User registration, login, and session management
- **Role-Based Access**: Admin features and user permissions
- **API Rate Limiting**: Prevent abuse and ensure service stability
- **Input Sanitization**: XSS protection and SQL injection prevention

### DevOps & Monitoring
- **Dockerization**: Container-based deployment with docker-compose
- **Analytics Integration**: Prometheus metrics collection and Grafana dashboards
- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Health Checks**: Application monitoring and alerting systems

### Additional Features
- **Task Categories/Tags**: Enhanced organization and filtering
- **Recurring Tasks**: Automated task creation for repeated activities
- **Collaboration**: Task sharing and assignment features
- **Mobile App**: Native iOS/Android applications
- **Offline Support**: Progressive Web App with sync capabilities