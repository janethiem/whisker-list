var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();  // 1. include endpoint metadata
builder.Services.AddSwaggerGen(o => // 2. generate OpenAPI/Swagger
{
    o.SwaggerDoc("v1", new() { Title = "WhiskerList API", Version = "v1" });
});            // 2. generate OpenAPI/Swagger

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();                        // 3. serve JSON spec at /swagger/v1/swagger.json
    app.UseSwaggerUI();                      // 4. serve UI at /swagger
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
