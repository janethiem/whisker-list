using System.ComponentModel.DataAnnotations;

namespace WhiskerList.Api.Models
{
    public class TodoTask
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public bool IsCompleted { get; set; } = false;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public DateTime? DueDate { get; set; }

        public int Priority { get; set; } = 1;
    }
}