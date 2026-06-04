using Microsoft.AspNetCore.Identity;

namespace MPP_MVC_1.Models
{
    public class User : IdentityUser
    {
        public string? AvatarPath { get; set; }
        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        public string? Settings { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        // Навигационные свойства
        public ICollection<Habit> Habits { get; set; } = new List<Habit>();
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
    }
}