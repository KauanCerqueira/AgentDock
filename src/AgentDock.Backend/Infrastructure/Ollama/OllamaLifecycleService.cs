using System.Diagnostics;

namespace AgentDock.Backend.Infrastructure.Ollama;

/// <summary>
/// Gerencia o ciclo de vida do processo Ollama embutido
/// </summary>
public class OllamaLifecycleService : IHostedService, IDisposable
{
    private readonly ILogger<OllamaLifecycleService> _logger;
    private readonly IConfiguration _configuration;
    private Process? _ollamaProcess;
    private readonly string _ollamaPath;
    private readonly string _ollamaDataPath;
    private readonly int _port;

    public OllamaLifecycleService(
        ILogger<OllamaLifecycleService> logger,
        IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;

        // Caminho do Ollama embutido
        var basePath = AppDomain.CurrentDomain.BaseDirectory;
        _ollamaPath = Path.Combine(basePath, "bin", "ollama", GetOllamaExecutableName());
        _ollamaDataPath = Path.Combine(basePath, "data", "ollama");
        _port = configuration.GetValue<int>("Ollama:Port", 11434);

        // Criar diretório de dados se não existir
        Directory.CreateDirectory(_ollamaDataPath);
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting Ollama lifecycle service...");

        // Verificar se já existe um Ollama rodando
        if (await IsOllamaRunningAsync())
        {
            _logger.LogInformation("Ollama already running on port {Port}, using existing instance", _port);
            return;
        }

        // Verificar se o binário existe
        if (!File.Exists(_ollamaPath))
        {
            _logger.LogWarning("Ollama binary not found at {Path}. Please ensure Ollama is bundled with the application.", _ollamaPath);
            _logger.LogWarning("Attempting to use system-installed Ollama instead...");
            return;
        }

        try
        {
            _logger.LogInformation("Starting bundled Ollama from {Path}", _ollamaPath);

            var startInfo = new ProcessStartInfo
            {
                FileName = _ollamaPath,
                Arguments = $"serve",
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true,
                WorkingDirectory = Path.GetDirectoryName(_ollamaPath)
            };

            // Configurar variáveis de ambiente para dados locais
            startInfo.Environment["OLLAMA_HOST"] = $"127.0.0.1:{_port}";
            startInfo.Environment["OLLAMA_MODELS"] = Path.Combine(_ollamaDataPath, "models");

            _ollamaProcess = Process.Start(startInfo);

            if (_ollamaProcess != null)
            {
                _ollamaProcess.OutputDataReceived += (sender, e) =>
                {
                    if (!string.IsNullOrEmpty(e.Data))
                        _logger.LogDebug("Ollama: {Output}", e.Data);
                };

                _ollamaProcess.ErrorDataReceived += (sender, e) =>
                {
                    if (!string.IsNullOrEmpty(e.Data))
                        _logger.LogWarning("Ollama Error: {Error}", e.Data);
                };

                _ollamaProcess.BeginOutputReadLine();
                _ollamaProcess.BeginErrorReadLine();

                _logger.LogInformation("Ollama process started with PID {ProcessId}", _ollamaProcess.Id);

                // Aguardar Ollama iniciar (com retry)
                await WaitForOllamaHealthyAsync(cancellationToken);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to start Ollama process");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Stopping Ollama lifecycle service...");

        if (_ollamaProcess != null && !_ollamaProcess.HasExited)
        {
            try
            {
                _logger.LogInformation("Terminating Ollama process {ProcessId}", _ollamaProcess.Id);
                _ollamaProcess.Kill(entireProcessTree: true);
                _ollamaProcess.WaitForExit(5000); // Aguardar até 5 segundos
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error stopping Ollama process");
            }
        }

        return Task.CompletedTask;
    }

    private async Task<bool> IsOllamaRunningAsync()
    {
        try
        {
            using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(2) };
            var response = await client.GetAsync($"http://127.0.0.1:{_port}/");
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    private async Task WaitForOllamaHealthyAsync(CancellationToken cancellationToken)
    {
        const int maxRetries = 30; // 30 segundos de timeout
        var retryCount = 0;

        while (retryCount < maxRetries && !cancellationToken.IsCancellationRequested)
        {
            if (await IsOllamaRunningAsync())
            {
                _logger.LogInformation("Ollama is healthy and ready to accept requests");
                return;
            }

            retryCount++;
            _logger.LogDebug("Waiting for Ollama to be ready... ({Retry}/{MaxRetries})", retryCount, maxRetries);
            await Task.Delay(1000, cancellationToken);
        }

        if (retryCount >= maxRetries)
        {
            _logger.LogWarning("Ollama did not become healthy within the timeout period");
        }
    }

    private static string GetOllamaExecutableName()
    {
        return OperatingSystem.IsWindows() ? "ollama.exe" : "ollama";
    }

    public void Dispose()
    {
        _ollamaProcess?.Dispose();
    }
}
