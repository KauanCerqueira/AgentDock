using AgentDock.Backend.Services;
using AgentDock.Backend.Core.Interfaces;
using AgentDock.Backend.Infrastructure.Llama;
using AgentDock.Backend.Infrastructure.HuggingFace;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

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

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

// Log todas as requisições para debug
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
        logger.LogWarning("?? index.html NÃO encontrado!");
    }
}
else
{
    logger.LogWarning("?? wwwroot NÃO encontrado!");
}

app.MapControllers();

app.MapFallbackToFile("index.html");

logger.LogInformation("? AgentDock Backend PRONTO em http://localhost:5000");
logger.LogInformation("========================================");

app.Run("http://localhost:5000");
