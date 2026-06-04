using MPP_MVC_1.Models;

namespace MPP_MVC_1.Services
{
    public interface IHabitService
    {
        Task<IEnumerable<Habit>> GetUserHabitsAsync(string userId);
        Task<Habit?> GetHabitByIdAsync(int id, string userId);
        Task<Habit> CreateHabitAsync(Habit habit, string userId, int[] selectedTagIds);
        Task<Habit?> UpdateHabitAsync(Habit habit, string userId, int[] selectedTagIds);
        Task<bool> DeleteHabitAsync(int id, string userId);
        Task<bool> ToggleHabitLogAsync(int habitId, string userId, DateTime date);
    }
}