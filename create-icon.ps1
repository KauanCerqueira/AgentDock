# Script para criar um ícone 256x256 simples para o AgentDock

$iconPath = "resources\icon-256.png"

# Criar uma imagem PNG 256x256 simples usando .NET
Add-Type -AssemblyName System.Drawing

$bitmap = New-Object System.Drawing.Bitmap 256, 256
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

# Fundo transparente
$graphics.Clear([System.Drawing.Color]::Transparent)

# Gradiente azul-roxo
$rect = New-Object System.Drawing.Rectangle 0, 0, 256, 256
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [System.Drawing.Color]::FromArgb(255, 59, 130, 246),  # #3B82F6
    [System.Drawing.Color]::FromArgb(255, 139, 92, 246),  # #8B5CF6
    45
)

# Desenhar círculo de fundo
$graphics.FillEllipse($brush, 20, 20, 216, 216)

# Desenhar "AD" no centro (AgentDock)
$font = New-Object System.Drawing.Font("Arial", 80, [System.Drawing.FontStyle]::Bold)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$stringFormat = New-Object System.Drawing.StringFormat
$stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
$stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center

$graphics.DrawString("AD", $font, $textBrush, 128, 128, $stringFormat)

# Salvar
$bitmap.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bitmap.Dispose()
$brush.Dispose()
$textBrush.Dispose()
$font.Dispose()

Write-Host "✓ Icon created at $iconPath"
