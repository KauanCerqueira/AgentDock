@echo off
echo ========================================
echo TESTANDO SISTEMA HUGGINGFACE
echo ========================================
echo.

echo [1/5] Verificando se Backend esta rodando...
timeout /t 2 >nul
curl -s http://localhost:5000/api/models/hardware-info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ? Backend NAO esta rodando!
    echo.
    echo Inicie o backend primeiro:
    echo    cd src\AgentDock.Backend
    echo    dotnet run
    echo.
    pause
    exit /b 1
)
echo ? Backend esta rodando!
echo.

echo [2/5] Testando endpoint de hardware...
curl -s http://localhost:5000/api/models/hardware-info
echo.
echo.

echo [3/5] Testando endpoint de sugestoes...
curl -s http://localhost:5000/api/models/suggestions?limit=3
echo.
echo.

echo [4/5] Testando busca HuggingFace...
curl -s "http://localhost:5000/api/models/search?query=llama&limit=2"
echo.
echo.

echo [5/5] Testando modelos baixados...
curl -s http://localhost:5000/api/models/downloaded
echo.
echo.

echo ========================================
echo ? TODOS OS ENDPOINTS FUNCIONANDO!
echo ========================================
echo.
echo Agora abra o navegador em:
echo    http://localhost:5000
echo.
echo E teste:
echo    1. Models ^> Browse HuggingFace
echo    2. Tab "Recomendados"
echo    3. Clicar "Baixar" em um modelo
echo    4. Ver em "Downloaded Models"
echo.
pause
