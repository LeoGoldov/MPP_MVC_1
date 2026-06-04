using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MPP_MVC_1.Data;
using MPP_MVC_1.Models;
using MPP_MVC_1.Services;
using System.Security.Claims;

namespace MPP_MVC_1.Controllers
{
    [Authorize]
    public class HabitController : Controller
    {
        private readonly IHabitService _habitService;
        private readonly ApplicationDbContext _context;

        public HabitController(IHabitService habitService, ApplicationDbContext context)
        {
            _habitService = habitService;
            _context = context;
        }

        // GET: /Habit
        public async Task<IActionResult> Index()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var habits = await _habitService.GetUserHabitsAsync(userId);
            return View(habits);
        }

        // GET: /Habit/Details/5
        public async Task<IActionResult> Details(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var habit = await _habitService.GetHabitByIdAsync(id, userId);
            if (habit == null) return NotFound();
            return View(habit);
        }

        // GET: /Habit/Create
        public async Task<IActionResult> Create()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await LoadViewBags(userId);
            return View();
        }

        // POST: /Habit/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Habit habit, int[] selectedTagIds)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            habit.UserId = userId;

            await _habitService.CreateHabitAsync(habit, userId, selectedTagIds ?? Array.Empty<int>());

            return Redirect("http://localhost:3000");
        }

        // GET: /Habit/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var habit = await _habitService.GetHabitByIdAsync(id, userId);
            if (habit == null) return NotFound();

            await LoadViewBags(userId);
            ViewBag.SelectedTagIds = habit.HabitTags.Select(ht => ht.TagId).ToArray();
            return View(habit);
        }

        // POST: /Habit/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Habit habit, int[] selectedTagIds)
        {
            if (id != habit.Id) return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            habit.UserId = userId;

            var updated = await _habitService.UpdateHabitAsync(habit, userId, selectedTagIds ?? Array.Empty<int>());
            if (updated == null) return NotFound();
            return RedirectToAction(nameof(Index));
        }

        // POST: /Habit/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var success = await _habitService.DeleteHabitAsync(id, userId);
            if (!success) return NotFound();
            return RedirectToAction(nameof(Index));
        }

        // POST: /Habit/ToggleLog/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleLog(int id, DateTime date)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _habitService.ToggleHabitLogAsync(id, userId, date);
            return RedirectToAction(nameof(Details), new { id });
        }

        private async Task LoadViewBags(string userId, int? selectedTagId = null)
        {
            ViewBag.Tags = new SelectList(
                await _context.Tags.Where(t => t.UserId == userId).ToListAsync(),
                "Id", "Name");
        }
        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "API works!" });
        }
    }
}