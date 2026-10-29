@echo off
setlocal
title Package Twitter Screenshoter

cd /d "%~dp0"
echo ========================================================
echo   Packaging Twitter Screenshoter for Firefox / Zen / Chrome
echo ========================================================
echo.

set PYTHONDONTWRITEBYTECODE=1

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not found in PATH.
    echo Please install Python 3.8+ to create the package archive.
    pause
    exit /b 1
)

python package.py
if %errorlevel% neq 0 (
    echo [ERROR] Packaging failed.
    pause
    exit /b 1
)

echo.
echo Packaging complete. You can now load twitter-screenshoter.zip or .xpi in about:debugging.
pause
