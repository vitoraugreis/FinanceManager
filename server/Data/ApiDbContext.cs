using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data
{
    class ApiDbContext : DbContext
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options) { }
        public DbSet<Category> Categories { get; set; }
    }
}
