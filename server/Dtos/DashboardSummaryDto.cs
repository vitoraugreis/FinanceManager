public class DashboardSummaryDto
{
    public decimal TotalExpenses { get; set; }
    public decimal TotalIncomes { get; set; }
    public List<CategorySummaryDto> ExpensesByCategory { get; set; }
    public List<CategorySummaryDto> IncomesByCategory { get; set; }
}