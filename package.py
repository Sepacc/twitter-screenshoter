#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Package Twitter Screenshoter extension into clean .zip and .xpi archives for Firefox, Zen Browser, and Chrome.
Ensures manifest.json is strictly at the root of the archive.
"""

import os
import sys
import shutil
import zipfile
from pathlib import Path

sys.dont_write_bytecode = True

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def package_extension():
    src_dir = Path(__file__).parent.resolve()
    manifest_path = src_dir / 'manifest.json'
    
    if not manifest_path.exists():
        print(f"Error: manifest.json not found in {src_dir}")
        return False

    output_zip = src_dir / 'twitter-screenshoter.zip'
    output_xpi = src_dir / 'twitter-screenshoter.xpi'

    exclude_dirs = {'.git', '__pycache__', 'screenshots', '.vscode', '.idea'}
    exclude_files = {
        'twitter-screenshoter.zip',
        'twitter-screenshoter.xpi',
        'package.py',
        'stitcher.py',
        'requirements.txt',
        'run_server.bat',
        'package.bat'
    }
    exclude_exts = {'.pyc', '.pyo', '.pyd', '.tmp', '.log'}

    for out_path in [output_zip, output_xpi]:
        if out_path.exists():
            try:
                out_path.unlink()
            except Exception:
                pass

        with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            for root, dirs, files in os.walk(src_dir):
                dirs[:] = [d for d in dirs if d not in exclude_dirs]
                for file in files:
                    if file in exclude_files:
                        continue
                    file_ext = os.path.splitext(file)[1].lower()
                    if file_ext in exclude_exts:
                        continue
                    full_path = Path(root) / file
                    rel_path = full_path.relative_to(src_dir)
                    zf.write(full_path, arcname=str(rel_path).replace('\\', '/'))

    zip_size_kb = output_zip.stat().st_size // 1024
    xpi_size_kb = output_xpi.stat().st_size // 1024
    print("Extension packaged successfully:")
    print(f"  [ZIP] {output_zip.name} ({zip_size_kb} KB)")
    print(f"  [XPI] {output_xpi.name} ({xpi_size_kb} KB)")
    return True

if __name__ == '__main__':
    package_extension()
