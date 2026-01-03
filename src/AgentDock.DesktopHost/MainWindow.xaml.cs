using System.Windows;
using System.Windows.Controls;
using Microsoft.Web.WebView2.Wpf;
using Microsoft.Web.WebView2.Core;

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
            // Obtém URL do backend
            if (Application.Current.Properties.Contains("BackendUrl"))
            {
                _url = (string)Application.Current.Properties["BackendUrl"];
            }

            _webView = new WebView2();
            // Fundo preto para evitar flash branco
            _webView.DefaultBackgroundColor = System.Drawing.Color.Black;
            
            var container = (ContentControl)FindName("WebViewContainer");
            container.Content = _webView;

            await _webView.EnsureCoreWebView2Async();
            
            // Habilita DevTools
            _webView.CoreWebView2.Settings.AreDevToolsEnabled = true;
            _webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false; // Menu nativo desativado para imersão
            _webView.CoreWebView2.Settings.IsStatusBarEnabled = false;

            _webView.CoreWebView2.Navigate(_url);
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Erro ao inicializar WebView2: {ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void ReloadButton_Click(object sender, RoutedEventArgs e)
    {
        _webView?.Reload();
    }

    private void DevToolsButton_Click(object sender, RoutedEventArgs e)
    {
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
        Close();
    }
}
