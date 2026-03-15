@echo off
REM Script para iniciar todos los servicios necesarios para notificaciones en tiempo real
REM Este script abre 3 ventanas de terminal ejecutando en paralelo

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  INICIANDO SISTEMA DE NOTIFICACIONES EN TIEMPO REAL        ║
echo ║  Se abrirán 3 ventanas de terminal automaticamente         ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Terminal 1: Servidor Laravel
start "Laravel Server" cmd /k "php artisan serve --host=127.0.0.1 --port=8000"
timeout /t 2

REM Terminal 2: Reverb (WebSocket)
start "Reverb WebSocket" cmd /k "php artisan reverb:start --port=8080"
timeout /t 2

REM Terminal 3: Queue Worker
start "Queue Worker" cmd /k "php artisan queue:work database"

echo.
echo ✅ Los 3 servicios están iniciandose...
echo.
echo 📋 Servicios en ejecución:
echo   • Servidor Laravel: http://127.0.0.1:8000
echo   • Reverb WebSocket: localhost:8080
echo   • Queue Worker: Procesando notificaciones
echo.
echo 🧪 Probar notificaciones:
echo   1. En otra terminal: php artisan notification:test
echo   2. O accede a: http://127.0.0.1:8000/test-notification
echo.
echo ⚠️  Mantén estas 3 ventanas abiertas mientras uses la aplicación
echo.
pause
