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
app.MapGet("/api/categories", (ApiDbContext context) =>
{
    var categories = context.Categories.ToList();
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
        Name = category.Name
    };
    context.Categories.Add(newCategory);
    context.SaveChanges();

    return Results.Created($"/api/categories/{newCategory.Id}", newCategory);
});

app.Run();
