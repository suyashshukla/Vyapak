using Microsoft.EntityFrameworkCore;
using Vyapak.Models;

namespace Vyapak.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
}
