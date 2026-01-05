@echo off
title SyMAH - Launcher

echo ===============================
echo Iniciando SyMAH
echo ===============================

REM Backend
echo Iniciando backend...
start "Backend" cmd /k "cd backend && npm start"

REM Espera breve
timeout /t 3 > nul

REM Frontend (Vite)
echo Iniciando frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 5 > nul
start http://localhost:5173

echo ===============================
echo Sistema iniciado correctamente
echo ===============================
