using System.Diagnostics;

namespace AgentDock.Backend.Infrastructure.Llama;

/// <summary>
/// Gerencia o ciclo de vida do llama-server.exe
/// </summary>
public class LlamaLifecycleService : IHostedService, IDisposable
{
    private readonly ILogger<LlamaLifecycleService> _logger;
    private readonly IConfiguration _configuration;
    private Process? _llamaProcess;
    private readonly string _llamaServerPath;
    private readonly string _modelsPath;
    private readonly int _port;

    public LlamaLifecycleService(ILogger<LlamaLifecycleService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;

        var basePath = AppDomain.CurrentDomain.BaseDirectory;
        _llamaServerPath = Path.Combine(basePath, "bin", "llama", "llama-server.exe");
        _modelsPath = Path.Combine(basePath, "models");
        _port = configuration.GetValue<int>("Llama:Port", 8080);

        Directory.CreateDirectory(_modelsPath);
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting llama.cpp server...");

        // Verificar se já está rodando
        if (await IsServerRunningAsync())
        {
            _logger.LogInformation("llama-server already running on port {Port}", _port);
            return;
        }

        // Verificar se binário existe
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

        var defaultModel = models[0]; // Usar primeiro modelo encontrado
        _logger.LogInformation("Using model: {Model}", Path.GetFileName(defaultModel));

        try
        {
            var startInfo = new ProcessStartInfo
            {
                FileName = _llamaServerPath,
                Arguments = $"--model \"{defaultModel}\" --port {_port} --host 127.0.0.1 --ctx-size 4096 --n-gpu-layers 35",
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
            var response = await client.GetAsync($"http://127.0.0.1:{_port}/health");
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

    public void Dispose()
    {
        _llamaProcess?.Dispose();
    }
}
