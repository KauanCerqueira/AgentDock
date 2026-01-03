using System.Windows;
using System.Windows.Controls;
using Microsoft.Web.WebView2.Wpf;
using Microsoft.Web.WebView2.Core;
using System.Diagnostics;

namespace AgentDock.DesktopHost;

public partial class MainWindow : Window
{
    private WebView2? _webView;
    private string _url = "http://localhost:5000";

    public MainWindow()
    {
        InitializeComponent();
        Loaded += MainWindow_Loaded;
        
        // Ajusta borda quando maximizado para evitar corte de conteúdo
        StateChanged += (s, e) => 
        {
            var mainBorder = (Border)FindName("MainBorder");
            if (mainBorder != null)
            {
                if (WindowState == WindowState.Maximized)
                {
                    // Remove borda e adiciona margem para compensar o comportamento do WindowChrome maximizado
                    mainBorder.BorderThickness = new Thickness(0);
                    mainBorder.Margin = new Thickness(8); 
                }
                else
                {
                    // Restaura borda e remove margem
                    mainBorder.BorderThickness = new Thickness(1);
                    mainBorder.Margin = new Thickness(0);
                }
            }
        };
    }

    private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
    {
        try
        {
            Debug.WriteLine("========================================");
            Debug.WriteLine("?? AgentDock - Iniciando WebView2");
            Debug.WriteLine("========================================");
            
            // Obtém URL do backend
            if (Application.Current.Properties.Contains("BackendUrl"))
            {
                _url = (string)Application.Current.Properties["BackendUrl"];
            }
            
            Debug.WriteLine($"?? URL configurada: {_url}");

            _webView = new WebView2();
            // Fundo preto para evitar flash branco
            _webView.DefaultBackgroundColor = System.Drawing.Color.Black;
            
            var container = (ContentControl)FindName("WebViewContainer");
            container.Content = _webView;

            Debug.WriteLine("? Inicializando CoreWebView2...");
            await _webView.EnsureCoreWebView2Async();
            Debug.WriteLine("? CoreWebView2 inicializado com sucesso");
            
            // Habilita DevTools
            _webView.CoreWebView2.Settings.AreDevToolsEnabled = true;
            _webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
            _webView.CoreWebView2.Settings.IsStatusBarEnabled = false;

            // Adiciona handlers de navegação para debugging
            _webView.CoreWebView2.NavigationStarting += CoreWebView2_NavigationStarting;
            _webView.CoreWebView2.NavigationCompleted += CoreWebView2_NavigationCompleted;
            _webView.CoreWebView2.DOMContentLoaded += CoreWebView2_DOMContentLoaded;
            _webView.CoreWebView2.WebMessageReceived += CoreWebView2_WebMessageReceived;

            Debug.WriteLine("?? Configurando captura de console do navegador...");
            
            // Intercepta console.log, console.error, console.warn do React
            await _webView.CoreWebView2.ExecuteScriptAsync(@"
                (function() {
                    const originalLog = console.log;
                    const originalError = console.error;
                    const originalWarn = console.warn;
                    
                    console.log = function(...args) {
                        window.chrome.webview.postMessage({ type: 'LOG', message: args.join(' ') });
                        originalLog.apply(console, args);
                    };
                    
                    console.error = function(...args) {
                        window.chrome.webview.postMessage({ type: 'ERROR', message: args.join(' ') });
                        originalError.apply(console, args);
                    };
                    
                    console.warn = function(...args) {
                        window.chrome.webview.postMessage({ type: 'WARN', message: args.join(' ') });
                        originalWarn.apply(console, args);
                    };
                    
                    // Captura erros não tratados
                    window.addEventListener('error', function(e) {
                        window.chrome.webview.postMessage({ 
                            type: 'ERROR', 
                            message: 'Uncaught error: ' + e.message + ' at ' + e.filename + ':' + e.lineno 
                        });
                    });
                    
                    window.addEventListener('unhandledrejection', function(e) {
                        window.chrome.webview.postMessage({ 
                            type: 'ERROR', 
                            message: 'Unhandled promise rejection: ' + e.reason 
                        });
                    });
                })();
            ");

            Debug.WriteLine($"?? Navegando para: {_url}");
            _webView.CoreWebView2.Navigate(_url);
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"? ERRO CRÍTICO ao inicializar WebView2:");
            Debug.WriteLine($"   Mensagem: {ex.Message}");
            Debug.WriteLine($"   Stack: {ex.StackTrace}");
            
            MessageBox.Show(
                $"Erro ao inicializar WebView2:\n\n{ex.Message}\n\n" +
                $"Verifique:\n" +
                $"1. WebView2 Runtime está instalado\n" +
                $"2. Backend está rodando em {_url}\n" +
                $"3. Frontend foi compilado (npm run build)\n\n" +
                $"Veja a janela Output (Debug) para mais detalhes.",
                "Erro de Inicialização",
                MessageBoxButton.OK,
                MessageBoxImage.Error);
        }
    }

    private void CoreWebView2_NavigationStarting(object? sender, CoreWebView2NavigationStartingEventArgs e)
    {
        Debug.WriteLine($"?? Navegação iniciando para: {e.Uri}");
    }

    private void CoreWebView2_NavigationCompleted(object? sender, CoreWebView2NavigationCompletedEventArgs e)
    {
        if (e.IsSuccess)
        {
            Debug.WriteLine("? Navegação concluída com sucesso!");
            Debug.WriteLine("   A página foi carregada. Se a tela está preta:");
            Debug.WriteLine("   1. Pressione F12 para abrir DevTools e veja o Console");
            Debug.WriteLine("   2. Verifique se o backend está respondendo");
            Debug.WriteLine("   3. Verifique se o React está montando (veja mensagens abaixo)");
        }
        else
        {
            Debug.WriteLine($"? Navegação FALHOU!");
            Debug.WriteLine($"   Status de erro: {e.WebErrorStatus}");
            Debug.WriteLine($"   HTTP Status Code: {e.HttpStatusCode}");
            
            string errorDetails = e.WebErrorStatus switch
            {
                CoreWebView2WebErrorStatus.ConnectionAborted => "Conexão abortada - Backend não está respondendo",
                CoreWebView2WebErrorStatus.ConnectionReset => "Conexão resetada - Backend pode ter caído",
                CoreWebView2WebErrorStatus.Disconnected => "Desconectado - Verifique sua rede",
                CoreWebView2WebErrorStatus.CannotConnect => "Não foi possível conectar - Backend não está rodando?",
                CoreWebView2WebErrorStatus.HostNameNotResolved => "Host não encontrado - URL incorreta?",
                CoreWebView2WebErrorStatus.Timeout => "Timeout - Backend demorou muito para responder",
                CoreWebView2WebErrorStatus.ErrorHttpInvalidServerResponse => "Resposta HTTP inválida do servidor",
                _ => $"Erro desconhecido: {e.WebErrorStatus}"
            };
            
            Debug.WriteLine($"   Detalhes: {errorDetails}");
            
            MessageBox.Show(
                $"Falha ao carregar a aplicação.\n\n" +
                $"Status: {e.WebErrorStatus}\n" +
                $"HTTP: {e.HttpStatusCode}\n\n" +
                $"{errorDetails}\n\n" +
                $"Possíveis soluções:\n" +
                $"• Verifique se o backend está rodando em {_url}\n" +
                $"• Rode 'dotnet run' manualmente na pasta AgentDock.Backend\n" +
                $"• Verifique se a porta 5000 não está bloqueada\n" +
                $"• Veja a janela Output (Debug) para mais detalhes",
                "Erro de Carregamento",
                MessageBoxButton.OK,
                MessageBoxImage.Warning);
        }
    }

    private void CoreWebView2_DOMContentLoaded(object? sender, CoreWebView2DOMContentLoadedEventArgs e)
    {
        Debug.WriteLine("?? DOM Content Loaded - HTML foi parseado");
        Debug.WriteLine("   React deveria estar montando agora...");
    }

    private void CoreWebView2_WebMessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        try
        {
            var messageJson = e.WebMessageAsJson;
            var message = System.Text.Json.JsonDocument.Parse(messageJson);
            
            if (message.RootElement.TryGetProperty("type", out var typeElement) &&
                message.RootElement.TryGetProperty("message", out var msgElement))
            {
                var type = typeElement.GetString();
                var msg = msgElement.GetString();
                
                switch (type)
                {
                    case "ERROR":
                        Debug.WriteLine($"?? Console Error: {msg}");
                        break;
                    case "WARN":
                        Debug.WriteLine($"?? Console Warning: {msg}");
                        break;
                    case "LOG":
                        Debug.WriteLine($"?? Console Log: {msg}");
                        break;
                    default:
                        Debug.WriteLine($"?? WebView Message: {msg}");
                        break;
                }
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"?? Erro ao processar mensagem do WebView: {ex.Message}");
        }
    }

    private void ReloadButton_Click(object sender, RoutedEventArgs e)
    {
        Debug.WriteLine("?? Recarregando página...");
        _webView?.Reload();
    }

    private void DevToolsButton_Click(object sender, RoutedEventArgs e)
    {
        Debug.WriteLine("?? Abrindo DevTools...");
        _webView?.CoreWebView2.OpenDevToolsWindow();
    }

    private void MinimizeButton_Click(object sender, RoutedEventArgs e)
    {
        WindowState = WindowState.Minimized;
    }

    private void MaximizeButton_Click(object sender, RoutedEventArgs e)
    {
        WindowState = WindowState == WindowState.Maximized ? WindowState.Normal : WindowState.Maximized;
    }

    private void CloseButton_Click(object sender, RoutedEventArgs e)
    {
        Debug.WriteLine("?? Fechando aplicação...");
        Close();
    }
}
