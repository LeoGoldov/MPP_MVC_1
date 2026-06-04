
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MPP_MVC_1.Models;

namespace MPP_MVC_1.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Habit> Habits { get; set; }
        public DbSet<HabitLog> HabitLogs { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<HabitTag> HabitTags { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Уникальность тега в рамках одного пользователя
            builder.Entity<Tag>()
                .HasIndex(t => new { t.Name, t.UserId })
                .IsUnique();

            // Связь User → Habit
            builder.Entity<Habit>()
                .HasOne(h => h.User)
                .WithMany(u => u.Habits)
                .HasForeignKey(h => h.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Связь User → Tag
            builder.Entity<Tag>()
                .HasOne(t => t.User)
                .WithMany(u => u.Tags)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Связь Habit → HabitLog
            builder.Entity<HabitLog>()
                .HasOne(hl => hl.Habit)
                .WithMany(h => h.Logs)
                .HasForeignKey(hl => hl.HabitId)
                .OnDelete(DeleteBehavior.Cascade);

            // Составной ключ для HabitTag
            builder.Entity<HabitTag>()
                .HasKey(ht => new { ht.HabitId, ht.TagId });

            builder.Entity<HabitTag>()
                .HasOne(ht => ht.Habit)
                .WithMany(h => h.HabitTags)
                .HasForeignKey(ht => ht.HabitId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<HabitTag>()
                .HasOne(ht => ht.Tag)
                .WithMany(t => t.HabitTags)
                .HasForeignKey(ht => ht.TagId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}