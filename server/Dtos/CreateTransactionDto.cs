using server.Models;

namespace server.Dtos
{
    public class CreateTransactionDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public TransactionType Type { get; set; }
        public int AccountId { get; set; }
        public int CategoryId { get; set; }
    }
}
