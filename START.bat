@echo off
title PANEL ABUELO BITCOIN
color 0A
echo ======================================
echo   PANEL DE TRADING - ABUELO BITCOIN
echo ======================================
echo.

:: Verificar Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] No tienes Node.js instalado.
    echo.
    echo Descargalo desde: https://nodejs.org/
    echo Instala la version LTS (recomendada).
    echo.
    pause
    exit /b
)

:: Instalar dependencias si no existen
if not exist "node_modules\" (
    echo Instalando dependencias (puede tardar 1-2 minutos)...
    echo.
    call npm install
    echo.
    echo Instalacion completada.
    echo.
)

:: Liberar puerto 3000 si está ocupado
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [AVISO] Puerto 3000 ocupado. Liberando...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 >nul
)

:: Abrir navegador y lanzar
echo.
echo Abriendo el panel en tu navegador...
echo (NO CIERRES ESTA VENTANA mientras uses el panel)
echo.
echo Panel abierto en: http://localhost:3000
echo.
start http://localhost:3000
call npm run dev

pause