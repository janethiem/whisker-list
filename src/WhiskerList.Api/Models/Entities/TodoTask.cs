using System.ComponentModel.DataAnnotations;

namespace WhiskerList.Api.Models
{
    public class TodoTask
    {
        // Primary key - Entity Framework will auto-generate this
        public int Id { get; set; }

        // Task title - required field with max length
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        // Optional description
        [MaxLength(1000)]
        public string? Description { get; set; }

        // Task completion status
        public bool IsCompleted { get; set; } = false;

        // When the task was created
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // When the task was last updated
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Optional due date
        public DateTime? DueDate { get; set; }

        // Priority level (1 = Low, 2 = Medium, 3 = High)
        public int Priority { get; set; } = 1;
    }
}