using System.ComponentModel.DataAnnotations;

namespace WhiskerList.Api.Models.DTOs.Requests
{
    public class CreateTodoTaskRequest
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public DateTime? DueDate { get; set; }

        public int Priority { get; set; } = 1;
    }
}