using Microsoft.AspNetCore.Mvc;
using MPP_MVC_1.Models;
using MPP_MVC_1.Services;

namespace MPP_MVC_1.Controllers
{
    // [Authorize]  ← временно отключено
    [ApiController]
    [Route("api/[controller]")]
    public class HabitApiController : ControllerBase
    {
        private readonly IHabitService _habitService;

        public HabitApiController(IHabitService habitService)
        {
            _habitService = habitService;
        }

        [HttpGet]
        public async Task<IActionResult> GetHabits()
        {
            var habits = await _habitService.GetUserHabitsAsync(null);
            return Ok(habits);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetHabit(int id)
        {
            var habit = await _habitService.GetHabitByIdAsync(id, null);
            if (habit == null) return NotFound();
            return Ok(habit);
        }

        [HttpPost]
        public async Task<IActionResult> CreateHabit([FromBody] CreateHabitRequest request)
        {
            var habit = new Habit
            {
                Title = request.Title,
                Description = request.Description,
                Color = request.Color,
                Difficulty = request.Difficulty,
                UserId = "temp-user", // временный ID
                CreatedAt = DateTime.UtcNow,
                IsArchived = false
            };
            var created = await _habitService.CreateHabitAsync(habit, "temp-user", request.SelectedTagIds ?? new int[0]);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHabit(int id, [FromBody] UpdateHabitRequest request)
        {
            var habit = new Habit
            {
                Id = id,
                Title = request.Title,
                Description = request.Description,
                Color = request.Color,
                Difficulty = request.Difficulty,
                IsArchived = request.IsArchived
            };
            var updated = await _habitService.UpdateHabitAsync(habit, "temp-user", request.SelectedTagIds ?? new int[0]);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHabit(int id)
        {
            var success = await _habitService.DeleteHabitAsync(id, "temp-user");
            if (!success) return NotFound();
            return NoContent();
        }
    }

    public class CreateHabitRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Color { get; set; } = "#808080";
        public Difficulty Difficulty { get; set; }
        public int[]? SelectedTagIds { get; set; }
    }

    public class UpdateHabitRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Color { get; set; } = "#808080";
        public Difficulty Difficulty { get; set; }
        public bool IsArchived { get; set; }
        public int[]? SelectedTagIds { get; set; }
    }
}