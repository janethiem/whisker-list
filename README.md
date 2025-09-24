# WhiskerList 🐾

A full-stack todo list application with a **React TypeScript** frontend and **ASP.NET Core** backend. Demonstrates modern web development practices, clean architecture, and comprehensive testing.

---

## 🚀 Quick Start (For Interviewers)

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/) and npm

### macOS (Homebrew) quick install
```bash
brew update
brew install dotnet@9
# If you have multiple .NET versions installed, you may need to link:
brew link --force dotnet@9
```

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd whisker-list
   ```

2. **Setup and Start the Backend API:**
   ```bash
   cd backend/WhiskerList.Api
   
   # Install EF Core tools if not already installed
   dotnet tool install --global dotnet-ef
   
   # Create database and apply migrations
   dotnet ef database update
   
   # Start the API
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

## 🧪 Running Tests

### Frontend Tests
```bash
cd frontend
npm test          # Interactive mode
npm run test:run  # Single run
npm run test:coverage  # With coverage report
```

### API Testing
Manual API testing collection available in `tests/WhiskerList.Api.http` - use with REST Client extension in VS Code or any HTTP client.

---

## 🛠️ Features Implemented

### Core Functionality
- ✅ **Full CRUD Operations** - Create, read, update, delete tasks
- ✅ **Task Management** - Mark complete/incomplete, set priorities (1-3)
- ✅ **Due Dates** - Optional deadline tracking

### Advanced Features
- ✅ **Search & Filtering** - By completion status, priority, and text search
- ✅ **Flexible Sorting** - By creation date, title, due date, priority
- ✅ **Instant Performance** - Client-side filtering/sorting without extraneous API calls
- ✅ **React Memoization** - Optimized rendering with React.memo, useMemo and useCallback
- ✅ **Custom Icons** - Cat-themed icons (Compliments of Nano Banana)

### Developer Experience
- ✅ **Comprehensive Testing** - Frontend unit tests and HTTP API test collection
- ✅ **Type Safety** - TypeScript & C# implementation
- ✅ **API Documentation** - Interactive Swagger/OpenAPI docs
- ✅ **Separation of concerns** – DTOs at the API edge, EF Core for data access, explicit mapping to isolate transport models from domain entities.
- ✅ **Error Handling** - Graceful error states and user feedback
- ✅ **Loading States** - Visual feedback during operations

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
- **React 19** with TypeScript - Type-safe component library
- **Vite** - Fast build tool and dev server
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first CSS framework

---

## 📝 Assumptions and Implementation Notes

### Data Model Assumptions
- **Task IDs**: Auto-incrementing integers (appropriate for personal task management)
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
- **Performance Optimization**: Client-side filtering/sorting without extraneous API calls
- **Styling**: Tailwind utility classes with custom inline styles for theming

---

## 📈 Scalability Considerations

### Current Architecture Strengths
- **Clean API Design**: RESTful endpoints with proper HTTP semantics
- **React Memoization** - Optimized rendering with React.memo, useMemo, and useCallback
- **Database Migrations**: Schema versioning for safe deployments
- **Component Reusability**: Modular frontend architecture
- **Server-Side Filtering and Sorting**: Database-level sorting and filtering already implemented for future improved performance with large datasets

### Known Limitations
- **SQLite**: File-level locking limits high-concurrency scenarios
- **No Pagination**: All matching results loaded at once (acceptable for MVP scale)
- **No Authentication**: Single-user application model

---

## 🚀 Future Enhancements

### Performance & Scale
- **Pagination Implementation**: Server-side pagination for large datasets
- **Database Migration**: PostgreSQL or SQL Server for production workloads
- **Caching Layer**: Redis for session management and frequently accessed data
- **Database Optimization**: Indexing and query optimization

### User Experience
- **Statistics Dashboard**: Utilize existing `/todo-tasks/stats` endpoint for productivity insights
- **Soft Delete System**: Allow users to undo task deletion with recovery period
- **Bulk Operations**: Multi-select and batch actions for task management
- **Drag & Drop**: Visual task reordering and priority management
- **Sort by Updated At**: Use existing infrastructure to sort by Updated time

### Security & Authentication
- **JWT Authentication**: User registration, login, and session management
- **Role-Based Access**: Admin features and user permissions
- **API Rate Limiting**: Prevent abuse and ensure service stability

### Testing & Quality Assurance
- **Backend Unit Testing**: Controller and service layer test coverage
- **Integration Testing**: End-to-end API testing for critical workflows
- **E2E Testing**: Browser automation for complete user journeys
- **Performance Testing**: Load testing and response time optimization

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