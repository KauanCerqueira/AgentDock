using AgentDock.Backend.Services;
using AgentDock.Backend.Core.Interfaces;
using Microsoft.OpenApi.Models;
using AgentDock.Backend.Infrastructure.Llama;
using AgentDock.Backend.Infrastructure.HuggingFace;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowElectron", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader()
              .WithExposedHeaders("Content-Disposition", "Content-Length");
    });
});

builder.Services.AddControllers()
    .AddApplicationPart(typeof(Program).Assembly)
    .AddControllersAsServices();

// Register llama.cpp services
builder.Services.AddHostedService<LlamaLifecycleService>();
builder.Services.AddHttpClient<ILlamaService, LlamaCppService>()
    .SetHandlerLifetime(TimeSpan.FromMinutes(5));

// Register HuggingFace services
builder.Services.AddHttpClient<HuggingFaceService>()
    .SetHandlerLifetime(TimeSpan.FromMinutes(10));
builder.Services.AddSingleton<ModelDownloadManager>();
builder.Services.AddSingleton<ModelRecommendationService>();

// Register other services
builder.Services.AddSingleton<SystemMonitorService>();
builder.Services.AddSingleton<LogsService>();
builder.Services.AddSingleton<SettingsService>();
builder.Services.AddSingleton<AgentPresetsService>();
builder.Services.AddSingleton<DownloadSettingsService>();
builder.Services.AddSingleton<DashboardStatsService>();  // Dashboard stats
builder.Services.AddSingleton<MockDataService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "AgentDock API", 
        Version = "v1",
        Description = "OpenAI-compatible API for local LLM inference."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

    c.DocInclusionPredicate((docName, apiDesc) =>
    {
        return apiDesc.RelativePath != null && apiDesc.RelativePath.StartsWith("v1");
    });
});

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("========================================");
logger.LogInformation("?? AgentDock Backend Starting");
logger.LogInformation("========================================");
logger.LogInformation("llama.cpp URL: {Url}", builder.Configuration["Llama:BaseUrl"]);

// Initialize background service to collect performance metrics
var logsService = app.Services.GetRequiredService<LogsService>();
var systemMonitor = app.Services.GetRequiredService<SystemMonitorService>();

_ = Task.Run(async () =>
{
    while (true)
    {
        try
        {
            var stats = systemMonitor.GetSystemStats();
            logsService.AddPerformanceMetric(new PerformanceMetric
            {
                CpuUsage = stats.CpuUsagePercent,
                MemoryUsage = stats.UsedMemoryGb,
                GpuUsage = stats.GpuInfo?.UsagePercent ?? 0,
                NetworkDownload = stats.NetworkInfo?.DownloadSpeedMbps ?? 0,
                NetworkUpload = stats.NetworkInfo?.UploadSpeedMbps ?? 0,
                ActiveTasks = 0
            });
        }
        catch { }
        
        await Task.Delay(TimeSpan.FromSeconds(5));
    }
});

// Enable Swagger in all environments for this local tool
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AgentDock API v1");
    c.RoutePrefix = "swagger";
    c.InjectStylesheet("/swagger-ui/custom.css");
    c.DocumentTitle = "AgentDock API";
});

app.UseCors("AllowElectron");
// Add API Key Middleware for OpenAI endpoints
app.UseMiddleware<AgentDock.Backend.Infrastructure.Middleware.ApiKeyMiddleware>();
// Log todas as requisi��es para debug
app.Use(async (context, next) =>
{
    logger.LogInformation("?? {Method} {Path}", context.Request.Method, context.Request.Path);
    await next();
    logger.LogInformation("?? {Method} {Path} -> {StatusCode}", 
        context.Request.Method, 
        context.Request.Path, 
        context.Response.StatusCode);
});

app.UseDefaultFiles();
app.UseStaticFiles();

// Verificar se wwwroot existe
var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
if (Directory.Exists(wwwrootPath))
{
    logger.LogInformation("? wwwroot encontrado em: {Path}", wwwrootPath);
    var indexPath = Path.Combine(wwwrootPath, "index.html");
    if (File.Exists(indexPath))
    {
        logger.LogInformation("? index.html encontrado");
    }
    else
    {
        logger.LogWarning("?? index.html N�O encontrado!");
    }
}
else
{
    logger.LogWarning("?? wwwroot N�O encontrado!");
}

app.MapControllers();

// Log todas as rotas registradas
var endpointDataSource = app.Services.GetRequiredService<EndpointDataSource>();
logger.LogInformation("========================================");
logger.LogInformation("?? ROTAS REGISTRADAS:");
foreach (var endpoint in endpointDataSource.Endpoints)
{
    if (endpoint is RouteEndpoint routeEndpoint)
    {
        var httpMethods = routeEndpoint.Metadata
            .OfType<HttpMethodMetadata>()
            .FirstOrDefault()?.HttpMethods ?? new[] { "ANY" };
        
        logger.LogInformation("  {Methods} {Pattern}", 
            string.Join(", ", httpMethods), 
            routeEndpoint.RoutePattern.RawText);
    }
}
logger.LogInformation("========================================");

app.MapFallbackToFile("index.html");

logger.LogInformation("? AgentDock Backend PRONTO em http://0.0.0.0:5000");
logger.LogInformation("========================================");

Console.WriteLine("Application started");
await app.RunAsync("http://0.0.0.0:5000");
