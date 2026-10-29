@echo off
chcp 65001 >nul
title X/Twitter Screenshoter Server (Pillow + FFmpeg MP4)
echo ========================================================
echo  Starting X/Twitter Screenshoter Local Server...
echo  Supports: Pillow Screenshot Stitching + FFmpeg Lossless MP4
echo ========================================================
echo.
cd /d "%~dp0"
python -B stitcher.py --server
pause
