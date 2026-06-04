using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MPP_MVC_1.Models
{
    public class Tag
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Название тега обязательно")]
        [StringLength(50, ErrorMessage = "Название тега не может превышать 50 символов")]
        public string Name { get; set; }

        public string UserId { get; set; }

        // Навигационные свойства
        [ForeignKey("UserId")]
        public User User { get; set; }

        public ICollection<HabitTag> HabitTags { get; set; } = new List<HabitTag>();
    }
}