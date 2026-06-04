using Microsoft.EntityFrameworkCore;
using MPP_MVC_1.Data;
using MPP_MVC_1.Models;

namespace MPP_MVC_1.Services
{
    public class HabitService : IHabitService
    {
        private readonly ApplicationDbContext _context;

        public HabitService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Habit>> GetUserHabitsAsync(string userId)
        {
            return await _context.Habits
                .Include(h => h.Logs)
                .Include(h => h.HabitTags)
                    .ThenInclude(ht => ht.Tag)
                .OrderByDescending(h => h.CreatedAt)
                .ToListAsync();  // ← убрали фильтр по userId
        }

        public async Task<Habit?> GetHabitByIdAsync(int id, string userId)
        {
            return await _context.Habits
                .Include(h => h.Logs)
                .Include(h => h.HabitTags)
                    .ThenInclude(ht => ht.Tag)
                .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
        }

        public async Task<Habit> CreateHabitAsync(Habit habit, string userId, int[] selectedTagIds)
        {
            habit.UserId = userId;
            habit.CreatedAt = DateTime.UtcNow;
            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            if (selectedTagIds != null && selectedTagIds.Any())
            {
                foreach (var tagId in selectedTagIds)
                {
                    _context.HabitTags.Add(new HabitTag { HabitId = habit.Id, TagId = tagId });
                }
                await _context.SaveChangesAsync();
            }

            return habit;
        }

        public async Task<Habit?> UpdateHabitAsync(Habit habit, string userId, int[] selectedTagIds)
        {
            var existingHabit = await _context.Habits
                .Include(h => h.HabitTags)
                .FirstOrDefaultAsync(h => h.Id == habit.Id && h.UserId == userId);

            if (existingHabit == null) return null;

            existingHabit.Title = habit.Title;
            existingHabit.Description = habit.Description;
            existingHabit.Color = habit.Color;
            existingHabit.Difficulty = habit.Difficulty;
            existingHabit.IsArchived = habit.IsArchived;
            existingHabit.UserId = userId; // Убедись, что UserId установлен

            // Обновление тегов
            existingHabit.HabitTags.Clear();
            if (selectedTagIds != null && selectedTagIds.Any())
            {
                foreach (var tagId in selectedTagIds)
                {
                    existingHabit.HabitTags.Add(new HabitTag { HabitId = habit.Id, TagId = tagId });
                }
            }

            await _context.SaveChangesAsync();
            return existingHabit;
        }

        public async Task<bool> DeleteHabitAsync(int id, string userId)
        {
            var habit = await _context.Habits
                .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
            if (habit == null) return false;

            _context.Habits.Remove(habit);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleHabitLogAsync(int habitId, string userId, DateTime date)
        {
            var habit = await _context.Habits
                .FirstOrDefaultAsync(h => h.Id == habitId && h.UserId == userId);
            if (habit == null) return false;

            var log = await _context.HabitLogs
                .FirstOrDefaultAsync(l => l.HabitId == habitId && l.Date.Date == date.Date);

            if (log != null)
            {
                _context.HabitLogs.Remove(log);
            }
            else
            {
                _context.HabitLogs.Add(new HabitLog
                {
                    HabitId = habitId,
                    Date = date.Date,
                    IsCompleted = true,
                    Note = "Выполнено"
                });
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}