using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MPP_MVC_1.Models
{
    public enum Difficulty
    {
        Easy,
        Medium,
        Hard
    }

    public class Habit
    {
        [Key]
        public int Id { get; set; }

        //[Required(ErrorMessage = "Название привычки обязательно")]
        //[StringLength(100, MinimumLength = 2, ErrorMessage = "Название должно быть от 2 до 100 символов")]
        public string Title { get; set; }

        public string? Description { get; set; }

        [Required]
        
        public string Color { get; set; } = "808080";

        [Required]
        public Difficulty Difficulty { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsArchived { get; set; } = false;

        // Внешний ключ (string, потому что IdentityUser использует string)
        public string UserId { get; set; } 

        // Навигационные свойства
        [ForeignKey("UserId")]
        public User User { get; set; }

        public ICollection<HabitLog> Logs { get; set; } = new List<HabitLog>();
        public ICollection<HabitTag> HabitTags { get; set; } = new List<HabitTag>();
    }
}