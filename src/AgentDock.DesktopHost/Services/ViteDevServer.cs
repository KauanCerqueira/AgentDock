using System.Diagnostics;
using System.IO;

namespace AgentDock.DesktopHost.Services;

public class ViteDevServer
{
    private Process? _viteProcess;
    private readonly string _uiPath;
    private const int VitePort = 5173;

    public ViteDevServer(string uiPath)
    {
        _uiPath = uiPath;
    }

    public async Task<bool> StartAsync()
    {
        try
        {
            if (!Directory.Exists(_uiPath))
            {
                System.Diagnostics.Debug.WriteLine($"UI path not found: {_uiPath}");
                return false;
            }

            // Verifica se node_modules existe
            var nodeModulesPath = Path.Combine(_uiPath, "node_modules");
            if (!Directory.Exists(nodeModulesPath))
            {
                System.Diagnostics.Debug.WriteLine("Installing npm dependencies...");
                await RunNpmCommand("install");
            }

            // Inicia Vite dev server
            System.Diagnostics.Debug.WriteLine("Starting Vite dev server...");
            
            var startInfo = new ProcessStartInfo
            {
                FileName = "npm",
                Arguments = "run dev",
                WorkingDirectory = _uiPath,
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };

            _viteProcess = Process.Start(startInfo);
            
            if (_viteProcess == null)
            {
                return false;
            }

            // Aguarda servidor inicializar (máximo 10 segundos)
            var timeout = DateTime.Now.AddSeconds(10);
            while (DateTime.Now < timeout)
            {
                if (await IsServerRunning())
                {
                    System.Diagnostics.Debug.WriteLine($"Vite dev server running on http://localhost:{VitePort}");
                    return true;
                }
                await Task.Delay(500);
            }

            System.Diagnostics.Debug.WriteLine("Vite dev server timeout");
            return false;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to start Vite dev server: {ex.Message}");
            return false;
        }
    }

    public void Stop()
    {
        try
        {
            if (_viteProcess != null && !_viteProcess.HasExited)
            {
                _viteProcess.Kill(true); // Kill entire process tree
                _viteProcess.WaitForExit(2000);
                _viteProcess.Dispose();
                _viteProcess = null;
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error stopping Vite: {ex.Message}");
        }
    }

    public bool IsRunning => _viteProcess != null && !_viteProcess.HasExited;

    public string Url => $"http://localhost:{VitePort}";

    private async Task RunNpmCommand(string command)
    {
        var startInfo = new ProcessStartInfo
        {
            FileName = "npm",
            Arguments = command,
            WorkingDirectory = _uiPath,
            UseShellExecute = false,
            CreateNoWindow = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true
        };

        using var process = Process.Start(startInfo);
        if (process != null)
        {
            await process.WaitForExitAsync();
        }
    }

    private async Task<bool> IsServerRunning()
    {
        try
        {
            using var client = new System.Net.Http.HttpClient();
            client.Timeout = TimeSpan.FromSeconds(1);
            var response = await client.GetAsync($"http://localhost:{VitePort}");
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }
}
