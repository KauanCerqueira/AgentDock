using System.Diagnostics;
using System.IO;
using System.Text;

namespace AgentDock.DesktopHost.Services;

public class BackendService
{
    private Process? _backendProcess;
    private readonly string _backendPath;
    private readonly string _solutionRoot;
    private readonly string _uiPath;

    public BackendService()
    {
        _solutionRoot = GetSolutionRoot();
        _backendPath = Path.Combine(_solutionRoot, "src", "AgentDock.Backend");
        _uiPath = Path.Combine(_solutionRoot, "src", "AgentDock.UI");
        
        if (!Directory.Exists(_backendPath))
        {
            throw new DirectoryNotFoundException($"Backend nao encontrado em: {_backendPath}");
        }
    }

    public void Start()
    {
        try
        {
            // Sempre compila o frontend antes de iniciar
            BuildFrontendIfNeeded();
            
            if (_backendProcess == null || _backendProcess.HasExited)
            {
                var startInfo = new ProcessStartInfo
                {
                    FileName = "dotnet",
                    Arguments = "run",
                    WorkingDirectory = _backendPath,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    StandardOutputEncoding = Encoding.UTF8,
                    StandardErrorEncoding = Encoding.UTF8
                };

                _backendProcess = Process.Start(startInfo);
                
                if (_backendProcess == null)
                {
                    throw new InvalidOperationException("Falha ao iniciar processo do backend");
                }
                
                // Aguarda o backend inicializar
                System.Threading.Thread.Sleep(3000);
            }
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Erro ao iniciar backend: {ex.Message}", ex);
        }
    }

    private void BuildFrontendIfNeeded()
    {
        try
        {
            if (!Directory.Exists(_uiPath))
            {
                System.Diagnostics.Debug.WriteLine("UI nao encontrada, pulando build do frontend");
                return;
            }

            var wwwrootPath = Path.Combine(_backendPath, "wwwroot");
            var indexPath = Path.Combine(wwwrootPath, "index.html");
            
            // Verifica se ja existe build recente (menos de 1 dia)
            if (File.Exists(indexPath))
            {
                var lastModified = File.GetLastWriteTime(indexPath);
                if ((DateTime.Now - lastModified).TotalHours < 24)
                {
                    System.Diagnostics.Debug.WriteLine("Frontend ja compilado recentemente (menos de 24h)");
                    return;
                }
            }

            System.Diagnostics.Debug.WriteLine("Compilando frontend React...");
            
            var buildScript = Path.Combine(_solutionRoot, "build-frontend.ps1");
            if (!File.Exists(buildScript))
            {
                System.Diagnostics.Debug.WriteLine("Script de build nao encontrado");
                return;
            }

            var startInfo = new ProcessStartInfo
            {
                FileName = "powershell.exe",
                Arguments = $"-ExecutionPolicy Bypass -File \"{buildScript}\"",
                WorkingDirectory = _solutionRoot,
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                StandardOutputEncoding = Encoding.UTF8,
                StandardErrorEncoding = Encoding.UTF8
            };

            using var buildProcess = Process.Start(startInfo);
            if (buildProcess != null)
            {
                buildProcess.WaitForExit(120000); // Timeout de 2 minutos
                if (buildProcess.ExitCode == 0)
                {
                    System.Diagnostics.Debug.WriteLine("Frontend compilado com sucesso!");
                }
                else
                {
                    var error = buildProcess.StandardError.ReadToEnd();
                    System.Diagnostics.Debug.WriteLine($"Build do frontend falhou: {error}");
                }
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Aviso: Nao foi possivel compilar o frontend: {ex.Message}");
        }
    }

    public void Stop()
    {
        try
        {
            if (_backendProcess != null && !_backendProcess.HasExited)
            {
                _backendProcess.Kill();
                _backendProcess.WaitForExit(2000);
                _backendProcess.Dispose();
                _backendProcess = null;
            }
        }
        catch (Exception)
        {
            // Ignora erros ao parar o processo
        }
    }

    public bool IsRunning => _backendProcess != null && !_backendProcess.HasExited;

    private string GetSolutionRoot()
    {
        var current = AppDomain.CurrentDomain.BaseDirectory;
        var maxLevels = 10;
        var level = 0;
        
        while (level < maxLevels)
        {
            if (File.Exists(Path.Combine(current, "AgentDock.sln")))
            {
                return current;
            }
            
            var parent = Directory.GetParent(current)?.FullName;
            if (parent == null || parent == current)
            {
                break;
            }
            
            current = parent;
            level++;
        }
        
        throw new FileNotFoundException("Arquivo AgentDock.sln nao encontrado na hierarquia de diretorios");
    }
}
