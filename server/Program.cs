using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore;
using server.Models;
using server.Data;
using server.Dtos;

var builder = WebApplication.CreateBuilder(args);

// Configura o DbContext para usar o drive do PostgreSQL.
builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("FinanceDbConnection"))
);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options => {
    options.AddPolicy(name: "MyPolicy",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                .AllowAnyHeader().AllowAnyMethod();
        });
});

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("MyPolicy");

// Pega todas as linhas da tabela Categories e retorna no formato de lista.
app.MapGet("/api/categories", async (ApiDbContext context) =>
{
    var categories = await context.Categories.ToListAsync();
    return Results.Ok(categories);
});

// Cria uma nova categoria.
app.MapPost("/api/categories", async (ApiDbContext context, CreateCategoryDto category) =>
{
    // Verifica se já existe categoria com o mesmo nome informado.
    if (await context.Categories.AnyAsync(c => c.Name.ToLower() == category.Name.ToLower()))
        return Results.Conflict("Uma categoria com este nome já existe.");

    var newCategory = new Category
    {
        Name = category.Name,
        Color = category.Color
    };

    context.Categories.Add(newCategory);
    await context.SaveChangesAsync();

    return Results.Created($"/api/categories/{newCategory.Id}", newCategory);
});

// Deleta uma categoria.
app.MapDelete("/api/categories/{id:int}", async (ApiDbContext context, int id) =>
{
    var categoryToDelete = await context.Categories.FindAsync(id);

    if (categoryToDelete == null)
        return Results.NotFound();

    context.Categories.Remove(categoryToDelete);
    await context.SaveChangesAsync();

    // Retorna Status 204 -> Delete bem sucedido.
    return Results.NoContent();
});

// Retorna todas as contas criadas.
app.MapGet("/api/accounts", async (ApiDbContext context) =>
{
    var accounts = await context.Accounts.ToListAsync();
    return Results.Ok(accounts);
});

// Cria uma nova conta.
app.MapPost("/api/accounts", async (ApiDbContext context, CreateAccountDto account) =>
{
    // Verifica se já existe conta com o mesmo nome informado.
    if (await context.Accounts.AnyAsync(a => a.Name.ToLower() == account.Name.ToLower()))
        return Results.Conflict("Uma conta com este nome já existe.");

    var newAccount = new Account
    {
        Name = account.Name,
        Description = account.Description,
        Type = account.Type,
        InitialBalance = account.InitialBalance,
        ClosingDay = account.ClosingDay,
        DueDay = account.DueDay
    };

    context.Accounts.Add(newAccount);
    await context.SaveChangesAsync();

    return Results.Created($"/api/accounts/{newAccount.Id}", newAccount);
});

// Deleta conta existente.
app.MapDelete("/api/accounts/{id:int}", async (ApiDbContext context, int id) =>
{
    var accountToDelete = await context.Accounts.FindAsync(id);

    if (accountToDelete == null)
        return Results.NotFound();

    context.Accounts.Remove(accountToDelete);
    await context.SaveChangesAsync();

    // Retorna Status 204 -> Delete bem sucedido.
    return Results.NoContent();
});

// Lista todas as transações.
app.MapGet("/api/transactions", async (ApiDbContext context) =>
{
    var transactions = await context.Transactions
                                    .Include(t => t.Account)
                                    .Include(t => t.Category)
                                    .ToListAsync();
    return Results.Ok(transactions);
});

// Cria uma nova transação.
app.MapPost("/api/transactions", async (ApiDbContext context, CreateTransactionDto transaction) =>
{
    var accountExist = await context.Accounts.AnyAsync(a => a.Id == transaction.AccountId);
    var categoryExist = await context.Categories.AnyAsync(c => c.Id == transaction.CategoryId);
    if (!accountExist)
        return Results.BadRequest("A conta informada não existe.");
    if (!categoryExist)
        return Results.BadRequest("A categoria informada não existe.");

    var newTransaction = new Transaction
    {
        Name = transaction.Name,
        Description = transaction.Description,
        Amount = transaction.Amount,
        Date = transaction.Date.ToUniversalTime(),
        Type = transaction.Type,
        AccountId = transaction.AccountId,
        CategoryId = transaction.CategoryId
    };
    context.Transactions.Add(newTransaction);
    await context.SaveChangesAsync();

    return Results.Created($"/api/transactions/{newTransaction.Id}", newTransaction);
});

app.MapDelete("api/transactions/{id:int}", async (ApiDbContext context, int id) =>
{
    var transactionToDelete = await context.Transactions.FindAsync(id);
    if (transactionToDelete is null)
        return Results.NotFound("A transação informada não existe.");

    context.Transactions.Remove(transactionToDelete);
    await context.SaveChangesAsync();

    return Results.NoContent();
});

app.MapGet("api/dashboard/summary", async (ApiDbContext context, int year, int month, int? accountId) =>
{
    var query = context.Transactions.Where(t => t.Date.Year == year && t.Date.Month == month);
    if (accountId.HasValue)
        query = query.Where(t => t.AccountId == accountId);

    var expensesByCategory = await query
                                    .Where(t => t.Type == TransactionType.Expense)
                                    .GroupBy(t => new { t.CategoryId, t.Category.Name, t.Category.Color })
                                    .Select(g => new CategorySummaryDto
                                    {
                                        CategoryId = g.Key.CategoryId,
                                        CategoryName = g.Key.Name,
                                        CategoryColor = g.Key.Color,
                                        TotalAmount = g.Sum(t => t.Amount)
                                    })
                                    .ToListAsync();

    var incomesByCategory = await query
                                    .Where(t => t.Type == TransactionType.Income)
                                    .GroupBy(t => new { t.CategoryId, t.Category.Name, t.Category.Color })
                                    .Select(g => new CategorySummaryDto
                                    {
                                        CategoryId = g.Key.CategoryId,
                                        CategoryName = g.Key.Name,
                                        CategoryColor = g.Key.Color,
                                        TotalAmount = g.Sum(t => t.Amount)
                                    })
                                    .ToListAsync();

    var totalExpenses = await query
                                .Where(t => t.Type == TransactionType.Expense)
                                .SumAsync(t => t.Amount);

    var totalIncomes = await query
                                .Where(t => t.Type == TransactionType.Income)
                                .SumAsync(t => t.Amount);

    var summary = new DashboardSummaryDto
    {
        TotalExpenses = totalExpenses,
        TotalIncomes = totalIncomes,
        ExpensesByCategory = expensesByCategory,
        IncomesByCategory = incomesByCategory
    };

    return Results.Ok(summary);
});

app.Run();
