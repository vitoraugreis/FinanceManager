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
    // Verifica se j� existe categoria com o mesmo nome informado.
    if (await context.Categories.AnyAsync(c => c.Name.ToLower() == category.Name.ToLower()))
        return Results.Conflict("Uma categoria com este nome j� existe.");

    var newCategory = new Category
    {
        Name = category.Name
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
    // Verifica se j� existe conta com o mesmo nome informado.
    if (await context.Accounts.AnyAsync(a => a.Name.ToLower() == account.Name.ToLower()))
        return Results.Conflict("Uma conta com este nome j� existe.");

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

// Lista todas as transa��es.
app.MapGet("/api/transactions", async (ApiDbContext context) =>
{
    var transactions = await context.Transactions
                                    .Include(t => t.Account)
                                    .Include(t => t.Category)
                                    .ToListAsync();
    return Results.Ok(transactions);
});

// Cria uma nova transa��o.
app.MapPost("/api/transactions", async (ApiDbContext context, CreateTransactionDto transaction) =>
{
    var accountExist = await context.Accounts.AnyAsync(a => a.Id == transaction.AccountId);
    var categoryExist = await context.Categories.AnyAsync(c => c.Id == transaction.CategoryId);
    if (!accountExist)
        return Results.BadRequest("A conta informada n�o existe.");
    if (!categoryExist)
        return Results.BadRequest("A categoria informada n�o existe.");

    var newTransaction = new Transaction
    {
        Name = transaction.Name,
        Description = transaction.Description,
        Amount = transaction.Amount,
        Date = transaction.Date,
        Type = transaction.Type,
        AccountId = transaction.AccountId,
        CategoryId = transaction.CategoryId
    };
    context.Transactions.Add(newTransaction);
    await context.SaveChangesAsync();

    return Results.Created($"/api/transactions/{newTransaction.Id}", newTransaction);
});

app.Run();
