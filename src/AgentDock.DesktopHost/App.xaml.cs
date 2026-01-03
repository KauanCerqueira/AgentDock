using System.Windows;
using System.Windows.Threading;
using System.IO;
using AgentDock.DesktopHost.Services;

namespace AgentDock.DesktopHost;

public partial class App : Application
{
    private BackendService? _backendService;
    private readonly string _logFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "startup-error.log");

    public App()
    {
        // Handlers globais para capturar exceções não tratadas
        this.DispatcherUnhandledException += App_DispatcherUnhandledException;
        AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;
        TaskScheduler.UnobservedTaskException += TaskScheduler_UnobservedTaskException;
    }

    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        try
        {
            _backendService = new BackendService();
            _backendService.Start();
            
            // Informa a MainWindow qual URL usar (sempre localhost:5000)
            this.Properties["BackendUrl"] = "http://localhost:5000";
        }
        catch (Exception ex)
        {
            LogException("OnStartup", ex);
            MessageBox.Show($"Erro ao iniciar o backend: {ex.Message}\n\nVeja {_logFile} para detalhes.", 
                "Erro de Inicialização", MessageBoxButton.OK, MessageBoxImage.Error);
            Shutdown(1);
        }
    }

    protected override void OnExit(ExitEventArgs e)
    {
        _backendService?.Stop();
        base.OnExit(e);
    }

    private void App_DispatcherUnhandledException(object sender, DispatcherUnhandledExceptionEventArgs e)
    {
        LogException("UI Thread", e.Exception);
        MessageBox.Show($"Erro na interface: {e.Exception.Message}\n\nVeja {_logFile} para detalhes.", 
            "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
        e.Handled = true; // Evita que a aplicação feche
    }

    private void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
    {
        var ex = e.ExceptionObject as Exception;
        LogException("Domain", ex ?? new Exception(e.ExceptionObject?.ToString() ?? "Unknown"));
    }

    private void TaskScheduler_UnobservedTaskException(object? sender, UnobservedTaskExceptionEventArgs e)
    {
        LogException("Task", e.Exception);
        e.SetObserved();
    }

    private void LogException(string source, Exception ex)
    {
        try
        {
            var logEntry = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] [{source}] {ex}\n{new string('-', 80)}\n";
            File.AppendAllText(_logFile, logEntry);
        }
        catch
        {
            // Ignora erros ao logar
        }
    }

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
        
        throw new FileNotFoundException("AgentDock.sln não encontrado");
    }
}
