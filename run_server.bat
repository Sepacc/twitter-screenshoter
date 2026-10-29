@echo off
chcp 65001 >nul
title X/Twitter Screenshoter Server (Pillow + FFmpeg MP4)

cd /d "%~dp0"

:: Prevent Python from creating __pycache__ folders (which breaks Chrome/Firefox extension loading)
set PYTHONDONTWRITEBYTECODE=1
if exist "__pycache__" rmdir /s /q "__pycache__" >nul 2>&1

echo ========================================================
echo  X/Twitter Post Screenshoter - Local Processing Server
echo  Локальный сервер склейки и конвертации
echo ========================================================
echo.

:: 1. Check Python installation
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not added to PATH.
    echo [ОШИБКА] Python не найден в системе или не добавлен в PATH.
    echo.
    echo Please install Python 3.8+ from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

:: 2. Check and install Python dependencies
echo [*] Checking Python dependencies (Pillow)...
python -c "import PIL" >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Installing required packages from requirements.txt...
    echo [*] Установка зависимостей (Pillow)...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo.
        echo [WARNING] Failed to install requirements automatically.
        echo [ВНИМАНИЕ] Не удалось установить зависимости автоматически.
        echo Try running: pip install pillow
        echo.
    )
)

:: 3. Check FFmpeg in PATH
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] FFmpeg: Not found in PATH.
    echo     Note: Video conversion to H.264 MP4 requires FFmpeg.
    echo     (Склейка скриншотов работает через Pillow; для конвертации видео в MP4 нужен FFmpeg).
) else (
    echo [*] FFmpeg: Found in PATH (Lossless MP4 conversion enabled).
)

echo.
echo ========================================================
echo  Server is listening on http://127.0.0.1:5678
echo  Leave this window open while using the extension.
echo  Оставьте это окно открытым во время работы с расширением.
echo  Press Ctrl+C to stop the server.
echo ========================================================
echo.

python -B stitcher.py --server
if exist "__pycache__" rmdir /s /q "__pycache__" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Server terminated with exit code %errorlevel%.
    pause
)
