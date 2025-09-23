[33mcommit bfe049c6460c92ebcbb4c50e693d3b28244de77d[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m)[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Tue Sep 23 12:25:04 2025 -0700

    Implemented client side filtering/sorting and memoization

[33mcommit 534004206a017fdf2336ec697399a1ca62fcf2dc[m[33m ([m[1;31morigin/main[m[33m)[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Mon Sep 22 19:30:21 2025 -0700

    Removed innacurate comment

[33mcommit 00e82a73551e2dbd36cf6bca47dd064a1b4204cc[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Mon Sep 22 19:24:03 2025 -0700

    Update README with info on tests

[33mcommit 1cc8c88052d5be22d58b40c5e6294db2ee2ffec4[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Mon Sep 22 19:13:31 2025 -0700

    Updated README and removed vite boilerplace readme from frontend folder

[33mcommit a96eeb62101d6024f9a5a699c7819f03a6c620fa[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Mon Sep 22 13:40:12 2025 -0700

    README update for accuracy and clarity

[33mcommit d6e02e95dd6122125d4c00236ffd87899cbaf60b[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Mon Sep 22 13:07:08 2025 -0700

    Updated README with detailed instructions and info

[33mcommit 60bd9c0cc5f42ab8f2e709ba90a0d4bf29ee6c16[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Mon Sep 22 12:53:33 2025 -0700

    Added comprehensive frontend unit test suite

[33mcommit afe6f940533bd39d0979afa511526f55f4398d34[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Mon Sep 22 12:08:36 2025 -0700

    Update favicon icon and remove redundant API

[33mcommit 613f9c2f4ac149f7d656ae7ae4e9ce5881d86942[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Mon Sep 22 12:02:51 2025 -0700

    Big UI Update and Reorganize components into simplified structure
    
    - Update frontend layout and colour palette
    - Move generic UI components (Button, FormField, Icon) to ui/ folder
    - Move all todo-specific components to todo/ folder
    - Keep specific component names (EditModal, PriorityBadge, etc.)
    - Update all import paths to work with new structure
    - Maintain clean exports through index files
    - All tests passing and build successful

[33mcommit aab911656d791be8f8965a970b2e64c9dc70b94e[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Sun Sep 21 16:04:18 2025 -0700

    Implement complete React frontend with todo management UI
    
    - Add TodoList component with loading, error, and empty states
    - Add TodoItem component with priority badges and action buttons
    - Add TodoForm modal for creating/editing todos with validation
    - Add TodoFilters component with search and advanced filtering
    - Update App.tsx with responsive layout and cat-themed header
    - Enhance styling with gradient background and WhiskerList branding
    - Update cat-themed icon assets for consistent UI
    - Export all new components in index.ts

[33mcommit 9a46ed20f75b80076a1681f1e538890599a98084[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Sun Sep 21 15:24:41 2025 -0700

    Add comprehensive test suite for todo service and hooks
    
    - Add Vitest configuration and test setup with jsdom environment
    - Create unit tests for todoService HTTP functions with axios mocking
    - Add integration tests for React Query hooks (useTodos, mutations)
    - Configure co-located test structure following modern best practices
    - Add test scripts to package.json (test, test:run, test:ui)
    - Set up proper JSX support for component testing

[33mcommit 71f2a69fbaa0503754e93a4c238e5acb5e2771d3[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Sun Sep 21 12:48:59 2025 -0700

    Implement comprehensive frontend data management
    
    - Add React Query for server state management with devtools
    - Create API service layer with axios interceptors and error handling
    - Implement custom hooks: useTodos, useCreateTodo, useUpdateTodo, etc.
    - Add complete TypeScript type definitions for API contracts
    - Configure intelligent caching, optimistic updates, and query invalidation

[33mcommit b94b05769eb89954d9c8e7844d1f913d0215bf9b[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Sun Sep 21 12:16:32 2025 -0700

    Add cat-themed icon system with reusable Icon component
    
    - Add 10 cat-themed PNG icons for todo app actions
    - Create Icon component with semantic name mapping
    - Add TypeScript declarations for image imports
    - Update App.tsx with icon gallery demo
    - Set up component export structure

[33mcommit 591ea8fd9ca6a9582e97614192ca61cd58674b82[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Sun Sep 21 11:10:28 2025 -0700

    Reorganize project structure and add frontend
    
    - Move .NET API from src/ to backend/WhiskerList.Api/
    - Add React + TypeScript frontend with Vite

[33mcommit 48ae62df6937e722832c4e0abec8d39d56eb4534[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Sun Sep 21 10:21:07 2025 -0700

    Added CORS middleware to allow frontend

[33mcommit 0b6e9514b512ba5dec4b2f24ea56397228edba5f[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Sun Sep 21 10:10:46 2025 -0700

    Added API controllers, http tests, and updated README
    
    - Added CRUD API controllers with optional sorting and filtering
    - Updated README with quickstart instructions and updated feature list

[33mcommit 50183e7c183667eac270a84d35533cc74e80781f[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Sat Sep 20 10:09:46 2025 -0700

    Added initial db migrations and DTO files

[33mcommit cc930e7371fb6a74d4471a43bc7e0fcb859e23fa[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Sat Sep 20 09:23:16 2025 -0700

    Configure db connections and add db connection str
    
    - updated Program.cs to register the db context and config sqllite
    - updated appsettings.json to include the sqllite connection string

[33mcommit ca21fb007b0dc62769cd9ea25425568b58ccc258[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Sat Sep 20 09:07:33 2025 -0700

    Created todo task model and db context
    
    - In C#, models are classes that represent your data structure
    
    Key C# Concepts Explained:
    - public int Id { get; set; } - This is a property with automatic getter/setter.
    Entity Framework recognizes Id as the primary key
    - [Required] and [MaxLength] - These are data annotations that add validation rules
    - string? - The ? means the string can be null (nullable reference type)
    - = string.Empty - Default value assignment
    - DateTime.UtcNow - Gets current UTC time
    
    - The db context is like a bridge between your C# models and the
    db. It manages database connections and tracks changes.
    
    DbContext Concepts Explained:
    - DbSet<TodoTask> - Represents a table of TodoTask entities
    - OnModelCreating - Method where you configure how your models map to database tables
    - HasDefaultValueSql - Sets database-level default values
    - HasIndex - Creates database indexes for better query performance

[33mcommit a93215466f1158b6e843fb4436c517ec28517280[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Sat Sep 20 08:56:06 2025 -0700

    Updated directory structure to be more in line with best practices

[33mcommit 665d0eb789d6ee320402d26a7d299c3eb5ff6451[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Sat Sep 20 08:28:17 2025 -0700

    Remove bin/obj from repo and ignore them going forward

[33mcommit ff3b45872f392446c4a408a2b03a907fd777da13[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Fri Sep 19 17:37:22 2025 -0700

    Added Swagger UI and git ignore

[33mcommit 188dd16275ee15100c64c30d94236cc0c5867b96[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Fri Sep 19 17:10:16 2025 -0700

    Initial backend scaffold with ASP.NET Core Web API
    - Generated solution WhiskerList.sln and project WhiskerList.Api
    (minimal-API template, .NET 9).
    - Added Microsoft.AspNetCore.OpenApi package, registered AddOpenApi
    and MapOpenApi() so the service exposes an OpenAPI spec at /openapi/v1.{json|yaml}.
    - Kept default WeatherForecast sample endpoint to confirm the pipeline works
    (/weatherforecast returns JSON).
    - Configured launch profiles (http://localhost:5280)
    and verified the app starts in Development mode with dotnet run.
    - Confirmed basic health: HTTP 200 on /weatherforecast;
    404 on root is expected until a landing route or Swagger-UI is added.

[33mcommit 2bc98c884623e3d659b00ccadca7c2bf37defae2[m
Author: Jane Thiem <janethiem7@gmail.com>
Date:   Fri Sep 19 14:52:24 2025 -0700

    Initial commit with readme file containing core MVP features.
