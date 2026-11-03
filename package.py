#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Package Twitter Screenshoter extension into clean releases for Chrome and Firefox / Zen Browser.
Ensures manifest.json is strictly at the root of every archive.
Saves versioned archives into the 'releases' directory.
"""

import json
import os
import sys
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

    try:
        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest_data = json.load(f)
        version = manifest_data.get('version', '1.0.0')
    except Exception as e:
        print(f"Error reading manifest.json: {e}")
        version = '1.0.0'

    releases_dir = src_dir / 'releases'
    releases_dir.mkdir(parents=True, exist_ok=True)

    # Clean legacy root archives if present
    for legacy_name in ['twitter-screenshoter.zip', 'twitter-screenshoter.xpi']:
        legacy_path = src_dir / legacy_name
        if legacy_path.exists():
            try:
                legacy_path.unlink()
            except Exception:
                pass

    chrome_zip = releases_dir / f"twitter-screenshoter-v{version}-chrome.zip"
    firefox_xpi = releases_dir / f"twitter-screenshoter-v{version}-firefox.xpi"

    target_packages = [chrome_zip, firefox_xpi]

    exclude_dirs = {
        '.git',
        '__pycache__',
        'screenshots',
        'releases',
        'output',
        'scratch',
        '.vscode',
        '.idea'
    }
    exclude_files = {
        'package.py',
        'package.bat',
        'stitcher.py',
        'requirements.txt',
        'run_server.bat',
        '.gitattributes',
        '.gitignore'
    }
    exclude_exts = {'.pyc', '.pyo', '.pyd', '.tmp', '.log', '.bak'}

    # Collect files to pack
    files_to_pack = []
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
            files_to_pack.append((full_path, str(rel_path).replace('\\', '/')))

    # Ensure manifest.json is at root
    has_manifest_at_root = any(arc == 'manifest.json' for _, arc in files_to_pack)
    if not has_manifest_at_root:
        print("Error: manifest.json is missing from package file list!")
        return False

    for target in target_packages:
        if target.exists():
            try:
                target.unlink()
            except Exception:
                pass

        with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED) as zf:
            for full_path, arc_name in files_to_pack:
                zf.write(full_path, arcname=arc_name)

        size_kb = target.stat().st_size // 1024
        print(f"  [{target.suffix.upper().replace('.', '')}] {target.name} ({size_kb} KB)")

    print(f"\nSuccessfully packaged {len(target_packages)} release archives into releases/ directory for v{version}.")
    return True

if __name__ == '__main__':
    package_extension()
