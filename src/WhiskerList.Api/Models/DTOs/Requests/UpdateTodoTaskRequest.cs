using System.ComponentModel.DataAnnotations;

namespace WhiskerList.Api.Models.DTOs.Requests
{
    public class UpdateTodoTaskRequest
    {
        [MaxLength(200)]
        public string? Title { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        public bool? IsCompleted { get; set; }

        public DateTime? DueDate { get; set; }

        public int? Priority { get; set; }
    }
}