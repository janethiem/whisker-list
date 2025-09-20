using Microsoft.EntityFrameworkCore;
using WhiskerList.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add Entity Framework and SQLite
builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

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

app.Run();

