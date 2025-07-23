namespace server.Models
{
    public enum TransactionType
    {
        Expense,
        Income
    }

    public class Transaction
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public TransactionType Type { get; set; }

        public int AccountId { get; set; }
        public Account Account { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }
}
