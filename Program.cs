using Microsoft.EntityFrameworkCore;
using OllamaSharp;
using Vyapak.Data;
using Vyapak.Models;
using Vyapak.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SQLite Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=vyapak.db";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// Ollama Client
var ollamaHost = builder.Configuration["Ollama:Host"] ?? "http://localhost:11434";
builder.Services.AddSingleton<IOllamaApiClient>(new OllamaApiClient(ollamaHost));
builder.Services.AddScoped<OllamaService>();

// CORS for local development
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();
app.UseCors();
app.UseAuthorization();

// API Endpoints from Controllers
app.MapControllers();

// SPA Fallback
app.MapFallbackToFile("index.html");

// Auto-migrate database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.Run();
