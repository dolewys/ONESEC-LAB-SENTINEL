@echo off
title ONESEC Security Lab - Servidor Local
color 0A
echo.
echo  ===================================================
echo     ONESEC SECURITY LAB - Demo Interactivo
echo  ===================================================
echo.
echo  Iniciando servidor local...
echo.

:: Intentar con Python primero (mas rapido)
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  [OK] Python detectado. Iniciando servidor...
    echo.
    echo  -----------------------------------------------
    echo   Abre tu navegador en:
    echo   http://localhost:8080/index.html
    echo  -----------------------------------------------
    echo.
    echo  Presiona Ctrl+C para detener el servidor.
    echo.
    start "" "http://localhost:8080/index.html"
    python -m http.server 8080
    goto :end
)

:: Intentar con Python3
where python3 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  [OK] Python3 detectado. Iniciando servidor...
    echo.
    echo  -----------------------------------------------
    echo   Abre tu navegador en:
    echo   http://localhost:8080/index.html
    echo  -----------------------------------------------
    echo.
    echo  Presiona Ctrl+C para detener el servidor.
    echo.
    start "" "http://localhost:8080/index.html"
    python3 -m http.server 8080
    goto :end
)

:: Fallback: PowerShell (disponible en todo Windows 10/11)
echo  [OK] Usando PowerShell como servidor...
echo.
echo  -----------------------------------------------
echo   Abre tu navegador en:
echo   http://localhost:8080/index.html
echo  -----------------------------------------------
echo.
echo  Presiona Ctrl+C para detener el servidor.
echo.
start "" "http://localhost:8080/index.html"
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"

:end
pause
