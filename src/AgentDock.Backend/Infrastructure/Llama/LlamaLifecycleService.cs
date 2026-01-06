using System.Diagnostics;
using Microsoft.Extensions.Hosting;

namespace AgentDock.Backend.Infrastructure.Llama;

/// <summary>
/// Gerencia o ciclo de vida do llama-server.exe
/// </summary>
public class LlamaLifecycleService : IHostedService, IDisposable
{
    private readonly ILogger<LlamaLifecycleService> _logger;
    private readonly IConfiguration _configuration;
    private readonly IHostEnvironment _environment;
    private Process? _llamaProcess;
    private readonly string _llamaServerPath;
    private readonly string _modelsPath;
    private readonly string? _defaultModelName;
    private readonly int _port;
    private readonly string _host;

    public LlamaLifecycleService(
        ILogger<LlamaLifecycleService> logger,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        _logger = logger;
        _configuration = configuration;
        _environment = environment;

        var configuredServerPath = configuration.GetValue<string>("Llama:ExecutablePath") ?? Path.Combine("bin", "llama", "llama-server.exe");
        var resolvedServerPath = ResolvePath(configuredServerPath, environment.ContentRootPath);
        if (!File.Exists(resolvedServerPath))
        {
            var runtimeServerPath = ResolvePath(configuredServerPath, AppDomain.CurrentDomain.BaseDirectory);
            if (File.Exists(runtimeServerPath))
            {
                resolvedServerPath = runtimeServerPath;
            }
        }
        _llamaServerPath = resolvedServerPath;

        var configuredModelsPath = configuration.GetValue<string>("Llama:ModelsPath") ?? "models";
        var resolvedModelsPath = ResolvePath(configuredModelsPath, environment.ContentRootPath);
        if (!Directory.Exists(resolvedModelsPath))
        {
            var runtimeModelsPath = ResolvePath(configuredModelsPath, AppDomain.CurrentDomain.BaseDirectory);
            if (Directory.Exists(runtimeModelsPath))
            {
                resolvedModelsPath = runtimeModelsPath;
            }
        }
        _modelsPath = resolvedModelsPath;

        _defaultModelName = configuration.GetValue<string>("Llama:DefaultModel");
        _port = configuration.GetValue<int>("Llama:Port", 8080);
        _host = configuration.GetValue<string>("Llama:Host", "127.0.0.1");

        Directory.CreateDirectory(_modelsPath);
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting llama.cpp server...");
        _logger.LogInformation("llama-server path: {Path}", _llamaServerPath);
        _logger.LogInformation("Models path: {ModelsPath}", _modelsPath);

        // Verificar se j� est� rodando
        if (await IsServerRunningAsync())
        {
            _logger.LogInformation("llama-server already running on port {Port}", _port);
            return;
        }

        // Verificar se bin�rio existe
        if (!File.Exists(_llamaServerPath))
        {
            _logger.LogWarning("llama-server.exe not found at {Path}", _llamaServerPath);
            _logger.LogWarning("Please download llama.cpp binaries and place them in bin/llama/");
            return;
        }

        // Verificar se existe algum modelo
        var models = Directory.GetFiles(_modelsPath, "*.gguf");
        if (models.Length == 0)
        {
            _logger.LogWarning("No GGUF models found in {ModelsPath}", _modelsPath);
            _logger.LogWarning("Please download a model and place it in the models/ folder");
            return;
        }

        string? selectedModel = null;
        if (!string.IsNullOrWhiteSpace(_defaultModelName))
        {
            selectedModel = models.FirstOrDefault(m =>
                string.Equals(Path.GetFileName(m), _defaultModelName, StringComparison.OrdinalIgnoreCase));

            if (selectedModel == null)
            {
                _logger.LogWarning("Configured default model {DefaultModel} not found in {ModelsPath}", _defaultModelName, _modelsPath);
            }
        }

        selectedModel ??= models[0]; // Usar primeiro modelo encontrado
        _logger.LogInformation("Using model: {Model}", Path.GetFileName(selectedModel));

        try
        {
            var ctxSize = _configuration.GetValue<int?>("Llama:ContextSize") ?? 4096;
            var gpuLayers = _configuration.GetValue<int?>("Llama:GpuLayers") ?? 35;

            var startInfo = new ProcessStartInfo
            {
                FileName = _llamaServerPath,
                Arguments = $"--model \"{selectedModel}\" --port {_port} --host {_host} --ctx-size {ctxSize} --n-gpu-layers {gpuLayers}",
                WorkingDirectory = Path.GetDirectoryName(_llamaServerPath) ?? AppDomain.CurrentDomain.BaseDirectory,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true
            };

            _llamaProcess = Process.Start(startInfo);

            if (_llamaProcess != null)
            {
                _llamaProcess.OutputDataReceived += (s, e) =>
                {
                    if (!string.IsNullOrEmpty(e.Data))
                        _logger.LogDebug("llama-server: {Output}", e.Data);
                };

                _llamaProcess.ErrorDataReceived += (s, e) =>
                {
                    if (!string.IsNullOrEmpty(e.Data))
                        _logger.LogWarning("llama-server: {Error}", e.Data);
                };

                _llamaProcess.BeginOutputReadLine();
                _llamaProcess.BeginErrorReadLine();

                _logger.LogInformation("llama-server started with PID {ProcessId}", _llamaProcess.Id);

                // Aguardar servidor ficar pronto
                await WaitForServerHealthyAsync(cancellationToken);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to start llama-server");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Stopping llama-server...");

        if (_llamaProcess != null && !_llamaProcess.HasExited)
        {
            try
            {
                _llamaProcess.Kill(entireProcessTree: true);
                _llamaProcess.WaitForExit(5000);
                _logger.LogInformation("llama-server stopped");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error stopping llama-server");
            }
        }

        return Task.CompletedTask;
    }

    private async Task<bool> IsServerRunningAsync()
    {
        try
        {
            using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(2) };
            var response = await client.GetAsync($"http://{_host}:{_port}/health");
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    private async Task WaitForServerHealthyAsync(CancellationToken cancellationToken)
    {
        const int maxRetries = 30;
        for (int i = 0; i < maxRetries && !cancellationToken.IsCancellationRequested; i++)
        {
            if (await IsServerRunningAsync())
            {
                _logger.LogInformation("llama-server is ready");
                return;
            }

            _logger.LogDebug("Waiting for llama-server... ({Retry}/{MaxRetries})", i + 1, maxRetries);
            await Task.Delay(1000, cancellationToken);
        }

        _logger.LogWarning("llama-server did not become ready within timeout");
    }

    private static string ResolvePath(string path, string contentRoot)
    {
        if (string.IsNullOrWhiteSpace(path))
            return Path.Combine(contentRoot, "models");

        return Path.IsPathRooted(path)
            ? path
            : Path.GetFullPath(Path.Combine(contentRoot, path));
    }

    public void Dispose()
    {
        _llamaProcess?.Dispose();
    }
}
