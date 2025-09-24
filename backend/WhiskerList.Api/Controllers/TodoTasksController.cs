using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WhiskerList.Api.Data;
using WhiskerList.Api.Models;
using WhiskerList.Api.Models.DTOs.Requests;
using WhiskerList.Api.Models.DTOs.Responses;

namespace WhiskerList.Api.Controllers
{
    [ApiController]
    [Route("todo-tasks")]  // ← Clean kebab-case URL: /todo-tasks
    public class TodoTasksController : ControllerBase
    {
        private readonly TodoDbContext _context;
        private readonly ILogger<TodoTasksController> _logger;

        public TodoTasksController(TodoDbContext context, ILogger<TodoTasksController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all todo tasks with optional filtering and sorting
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoTaskResponse>>> GetTodoTasks(
            bool? isCompleted = null,
            int? priority = null,
            string? search = null,
            string sortBy = "createdAt",
            bool sortDescending = true)
        {
            try
            {
                var query = _context.TodoTasks.AsQueryable();

                // Apply filters
                if (isCompleted.HasValue)
                    query = query.Where(t => t.IsCompleted == isCompleted.Value);

                if (priority.HasValue)
                    query = query.Where(t => t.Priority == priority.Value);

                if (!string.IsNullOrWhiteSpace(search))
                    query = query.Where(t => t.Title.Contains(search) || 
                                           (t.Description != null && t.Description.Contains(search)));

                // Apply sorting
                query = sortBy.ToLower() switch
                {
                    "title" => sortDescending ? query.OrderByDescending(t => t.Title) : query.OrderBy(t => t.Title),
                    "duedate" => sortDescending ? query.OrderByDescending(t => t.DueDate) : query.OrderBy(t => t.DueDate),
                    "priority" => sortDescending ? query.OrderByDescending(t => t.Priority) : query.OrderBy(t => t.Priority),
                    "updatedat" => sortDescending ? query.OrderByDescending(t => t.UpdatedAt) : query.OrderBy(t => t.UpdatedAt),
                    _ => sortDescending ? query.OrderByDescending(t => t.CreatedAt) : query.OrderBy(t => t.CreatedAt)
                };

                var todoTasks = await query.ToListAsync();
                var response = todoTasks.Select(MapToResponse).ToList();
                
                _logger.LogInformation("Retrieved {Count} todo tasks", response.Count);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving todo tasks");
                return StatusCode(500, "An error occurred while retrieving todo tasks");
            }
        }

        /// <summary>
        /// Get a specific todo task by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoTaskResponse>> GetTodoTask(int id)
        {
            try
            {
                var todoTask = await _context.TodoTasks.FindAsync(id);

                if (todoTask == null)
                {
                    _logger.LogWarning("Todo task with ID {Id} not found", id);
                    return NotFound($"Todo task with ID {id} not found");
                }

                _logger.LogInformation("Retrieved todo task with ID {Id}", id);
                return Ok(MapToResponse(todoTask));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving todo task with ID {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the todo task");
            }
        }

        /// <summary>
        /// Create a new todo task
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<TodoTaskResponse>> CreateTodoTask(CreateTodoTaskRequest request)
        {
            try
            {
                var todoTask = new TodoTask
                {
                    Title = request.Title,
                    Description = request.Description,
                    DueDate = request.DueDate,
                    Priority = request.Priority,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.TodoTasks.Add(todoTask);
                await _context.SaveChangesAsync();

                var response = MapToResponse(todoTask);
                
                _logger.LogInformation("Created new todo task with ID {Id}", todoTask.Id);
                return CreatedAtAction(nameof(GetTodoTask), new { id = todoTask.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating todo task");
                return StatusCode(500, "An error occurred while creating the todo task");
            }
        }

        /// <summary>
        /// Update an existing todo task (partial update)
        /// </summary>
        [HttpPatch("{id}")]
        public async Task<ActionResult<TodoTaskResponse>> UpdateTodoTask(int id, UpdateTodoTaskRequest request)
        {
            try
            {
                var todoTask = await _context.TodoTasks.FindAsync(id);

                if (todoTask == null)
                {
                    _logger.LogWarning("Todo task with ID {Id} not found for update", id);
                    return NotFound($"Todo task with ID {id} not found");
                }

                // Update only provided fields
                if (request.Title != null)
                    todoTask.Title = request.Title;

                if (request.Description != null)
                    todoTask.Description = request.Description;

                if (request.IsCompleted.HasValue)
                    todoTask.IsCompleted = request.IsCompleted.Value;

                if (request.DueDate.HasValue)
                    todoTask.DueDate = request.DueDate.Value;

                if (request.Priority.HasValue)
                    todoTask.Priority = request.Priority.Value;

                todoTask.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var response = MapToResponse(todoTask);
                
                _logger.LogInformation("Updated todo task with ID {Id}", id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating todo task with ID {Id}", id);
                return StatusCode(500, "An error occurred while updating the todo task");
            }
        }


        /// <summary>
        /// Delete a todo task
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoTask(int id)
        {
            try
            {
                var todoTask = await _context.TodoTasks.FindAsync(id);

                if (todoTask == null)
                {
                    _logger.LogWarning("Todo task with ID {Id} not found for deletion", id);
                    return NotFound($"Todo task with ID {id} not found");
                }

                _context.TodoTasks.Remove(todoTask);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Deleted todo task with ID {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting todo task with ID {Id}", id);
                return StatusCode(500, "An error occurred while deleting the todo task");
            }
        }


        private static TodoTaskResponse MapToResponse(TodoTask todoTask)
        {
            return new TodoTaskResponse
            {
                Id = todoTask.Id,
                Title = todoTask.Title,
                Description = todoTask.Description,
                IsCompleted = todoTask.IsCompleted,
                CreatedAt = todoTask.CreatedAt,
                UpdatedAt = todoTask.UpdatedAt,
                DueDate = todoTask.DueDate,
                Priority = todoTask.Priority
            };
        }
    }
}
