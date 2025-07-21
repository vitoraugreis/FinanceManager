namespace server.Models
{
    public enum AccountType
    {
        Debit,
        Credit
    }

    public class Account
    {
        public int Id {  get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public AccountType Type { get; set; }
        public decimal InitialBalance { get; set; }
        // Dia de fechamento da fatura ( conta de crédito )
        public int? ClosingDay { get; set; }
        // Dia de vencimento da fatura ( conta de crédito )
        public int? DueDay { get; set; }
    }
}
