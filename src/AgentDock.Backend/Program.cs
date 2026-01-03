using AgentDock.Backend.Services;
using AgentDock.Backend.Core.Interfaces;
using AgentDock.Backend.Infrastructure.Llama;

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

// Register llama.cpp Lifecycle Service (auto-start llama-server)
builder.Services.AddHostedService<LlamaLifecycleService>();

// Register HttpClient for LlamaCppService
builder.Services.AddHttpClient<ILlamaService, LlamaCppService>()
    .SetHandlerLifetime(TimeSpan.FromMinutes(5));

// Register other services
builder.Services.AddSingleton<SystemMonitorService>();
builder.Services.AddSingleton<LogsService>();
builder.Services.AddSingleton<SettingsService>();
builder.Services.AddSingleton<AgentPresetsService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("AgentDock Backend starting...");
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
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.MapFallbackToFile("index.html");

logger.LogInformation("AgentDock Backend ready on http://localhost:5000");

app.Run("http://localhost:5000");
