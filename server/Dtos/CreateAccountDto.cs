using server.Models;

namespace server.Dtos
{
    public class CreateAccountDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public AccountType Type { get; set; }
        public decimal InitialBalance { get; set; }
        public int? ClosingDay { get; set; }
        public int? DueDay { get; set; }
    }
}
