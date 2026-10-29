@echo off
chcp 65001 >nul
title X/Twitter Screenshoter Server

cd /d "%~dp0"

set PYTHONDONTWRITEBYTECODE=1
if exist "__pycache__" rmdir /s /q "__pycache__" >nul 2>&1

echo ========================================================
echo  X/Twitter Post Screenshoter - Processing Server
echo  Local server for image stitching and video conversion
echo ========================================================
echo.

:: 1. Check Python installation
python --version >nul 2>&1
if %errorlevel% neq 0 goto :no_python

:: 2. Check and install Pillow
python -c "import PIL" >nul 2>&1
if %errorlevel% neq 0 goto :install_deps
goto :check_ffmpeg

:install_deps
echo [*] Installing required packages from requirements.txt...
pip install -r requirements.txt
if %errorlevel% neq 0 goto :retry_pillow
goto :check_ffmpeg

:retry_pillow
echo [*] Retrying Pillow installation directly...
pip install pillow
goto :check_ffmpeg

:check_ffmpeg
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 goto :no_ffmpeg

echo [*] FFmpeg: Available in PATH - MP4 conversion enabled.
goto :start_server

:no_ffmpeg
echo [*] FFmpeg: Not found in PATH.
echo     Screenshot stitching works via Pillow.
echo     Video conversion to MP4 requires FFmpeg in PATH.
goto :start_server

:start_server
echo.
echo ========================================================
echo  Server is listening on http://127.0.0.1:5678
echo  Leave this window open while using the extension.
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
goto :eof

:no_python
echo [ERROR] Python is not installed or not added to PATH.
echo Please install Python 3.8+ from https://www.python.org/
echo Make sure to check Add Python to PATH during installation.
echo.
pause
exit /b 1

:eof
