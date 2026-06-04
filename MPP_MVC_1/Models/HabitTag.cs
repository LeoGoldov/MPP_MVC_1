using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace MPP_MVC_1.Models
{
    [PrimaryKey(nameof(HabitId), nameof(TagId))]
    public class HabitTag
    {
        public int HabitId { get; set; }

        public int TagId { get; set; }

        // Навигационные свойства
        [ForeignKey("HabitId")]
        public Habit Habit { get; set; }

        [ForeignKey("TagId")]
        public Tag Tag { get; set; }
    }
}