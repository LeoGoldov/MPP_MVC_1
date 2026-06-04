using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MPP_MVC_1.Models
{
    public class HabitLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int HabitId { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        public bool IsCompleted { get; set; } = true;

        [StringLength(500)]
        public string? Note { get; set; }

        // Навигационное свойство
        [ForeignKey("HabitId")]
        public Habit Habit { get; set; }
    }
}