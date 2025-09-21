using Microsoft.EntityFrameworkCore;
using WhiskerList.Api.Models;

namespace WhiskerList.Api.Data
{
    public class TodoDbContext : DbContext
    {
        public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options)
        {
        }

        // This represents the TodoTasks table in the database
        public DbSet<TodoTask> TodoTasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the TodoTask entity
            modelBuilder.Entity<TodoTask>(entity =>
            {
                // Set table name
                entity.ToTable("TodoTasks");

                // Configure primary key
                entity.HasKey(e => e.Id);

                // Configure properties
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Description)
                    .HasMaxLength(1000);

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("datetime('now')");

                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("datetime('now')");

                // Create an index on IsCompleted for faster queries
                entity.HasIndex(e => e.IsCompleted);
            });
        }
    }
}