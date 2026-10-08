@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to run this local server.
  echo Install the current Node.js LTS release, then double-click this file again.
  pause
  exit /b 1
)

node start-local.js
pause