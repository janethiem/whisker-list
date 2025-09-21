using Microsoft.EntityFrameworkCore;
using WhiskerList.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add Entity Framework and SQLite
builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add controllers
builder.Services.AddControllers();

// Add CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // React common ports
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add Swagger UI
builder.Services.AddEndpointsApiExplorer(); 
builder.Services.AddSwaggerGen(o => 
{
    o.SwaggerDoc("v1", new() { Title = "WhiskerList API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();                        // 3. serve JSON spec at /swagger/v1/swagger.json
    app.UseSwaggerUI();                      // 4. serve UI at /swagger
}

app.UseHttpsRedirection();

// Map controllers
app.UseCors("AllowFrontend");
app.MapControllers();

app.Run();

