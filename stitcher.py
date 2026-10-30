#!/usr/bin/env python3
"""
stitcher.py - Скрипт склейки скриншотов длинных твитов и цитат (Pillow / FFmpeg)

Использование:
1. Как локальный сервер для браузерного расширения:
   python stitcher.py --server [--port 5678]

2. Как консольная утилита (CLI):
   python stitcher.py --input-folder ./slices/ --output full_tweet.png [--method pillow|ffmpeg]
"""

import sys
import os

# Prevent creating __pycache__ folders which Chromium extensions disallow
sys.dont_write_bytecode = True

import io
import json
import base64
import argparse
import subprocess
import shutil
import time
import tempfile
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# Check Pillow
try:
    from PIL import Image
    HAS_PILLOW = True
except ImportError:
    HAS_PILLOW = False

# Check FFmpeg
HAS_FFMPEG = shutil.which("ffmpeg") is not None


def check_dependencies():
    print(f"[*] Pillow status: {'Available (v' + Image.__version__ + ')' if HAS_PILLOW else 'NOT INSTALLED'}")
    print(f"[*] FFmpeg status: {'Available in PATH' if HAS_FFMPEG else 'NOT FOUND'}")
    if not HAS_PILLOW and not HAS_FFMPEG:
        print("[!] Warning: Pillow (pip install pillow) or FFmpeg is required.")


def decode_base64_image(data_url_or_base64):
    """Декодирует data:image/png;base64,... или чистый base64 в PIL.Image"""
    if not HAS_PILLOW:
        raise RuntimeError("Pillow не установлен. Выполните: pip install pillow")
    
    if "," in data_url_or_base64:
        data_url_or_base64 = data_url_or_base64.split(",", 1)[1]
    raw_bytes = base64.b64decode(data_url_or_base64)
    return Image.open(io.BytesIO(raw_bytes)).convert("RGBA")


def stitch_slices_pillow(slices, total_width=None, total_height=None, bg_color=(0, 0, 0, 255)):
    """
    Склейка фрагментов по точным координатам с использованием Pillow.
    slices: список dict с { dataUrl, sliceTop, visibleH, rectLeft, rectWidth, destY }
    """
    if not HAS_PILLOW:
        raise RuntimeError("Pillow не установлен.")

    if not slices:
        raise ValueError("Список фрагментов пуст.")

    # Декодируем изображения
    images = []
    for s in slices:
        img = decode_base64_image(s["dataUrl"])
        images.append((img, s))

    first_img, first_slice = images[0]
    # Масштаб между виртуальным viewport и реальными пикселями скриншота
    # Ожидаем, что rectWidth и rectLeft переданы из браузера
    img_w, img_h = first_img.size

    # Если общие размеры не переданы, вычисляем по фрагментам
    scale_x = img_w / (first_slice.get("viewportWidth") or (img_w / (first_slice.get("dpr") or 1))) if "viewportWidth" in first_slice else 1.0

    # Если destY и visibleH заданы, вычисляем итоговый размер
    max_w = 0
    max_h = 0
    for img, s in images:
        rect_w = int(s.get("rectWidth", img.width))
        vis_h = int(s.get("visibleH", img.height))
        dest_y = int(s.get("destY", 0))
        max_w = max(max_w, rect_w)
        max_h = max(max_h, dest_y + vis_h)

    # Итоговый размер холста
    canvas_w = int(total_width if total_width else max_w)
    canvas_h = int(total_height if total_height else max_h)

    # Защита от нулевого размера
    canvas_w = max(canvas_w, 100)
    canvas_h = max(canvas_h, 100)

    canvas = Image.new("RGBA", (canvas_w, canvas_h), bg_color)

    for img, s in images:
        # Вырезаем область твита из полноэкранного скриншота
        sx = int(s.get("rectLeft", 0))
        sy = int(s.get("sliceTop", 0))
        sw = int(s.get("rectWidth", img.width))
        sh = int(s.get("visibleH", img.height))

        # Ограничиваем границами исходной картинки
        box = (sx, sy, min(sx + sw, img.width), min(sy + sh, img.height))
        cropped = img.crop(box)

        # Координаты вставки на общий холст
        dx = 0
        dy = int(s.get("destY", 0))
        canvas.paste(cropped, (dx, dy), cropped)

    return canvas


def stitch_images_ffmpeg(image_paths, output_path):
    """
    Склейка списка файлов изображений вертикально через FFmpeg vstack.
    """
    if not HAS_FFMPEG:
        raise RuntimeError("FFmpeg не найден в PATH.")

    if not image_paths:
        raise ValueError("Список изображений пуст.")

    if len(image_paths) == 1:
        shutil.copyfile(image_paths[0], output_path)
        return output_path

    # Строим команду ffmpeg vstack
    # ffmpeg -i slice1.png -i slice2.png -filter_complex "[0:v][1:v]...vstack=inputs=N" output.png
    inputs = []
    filter_inputs = ""
    for idx, path in enumerate(image_paths):
        inputs.extend(["-i", path])
        filter_inputs += f"[{idx}:v]"

    filter_complex = f"{filter_inputs}vstack=inputs={len(image_paths)}"
    cmd = ["ffmpeg", "-y"] + inputs + ["-filter_complex", filter_complex, output_path]

    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"FFmpeg ошибка:\n{proc.stderr}")

    return output_path


# --- HTTP Microservice Server ---

class StitcherHTTPHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_cors_headers(200)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/status":
            self._set_cors_headers(200)
            res = {
                "status": "ok",
                "has_pillow": HAS_PILLOW,
                "pillow_version": Image.__version__ if HAS_PILLOW else None,
                "has_ffmpeg": HAS_FFMPEG
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))
        else:
            self._set_cors_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode("utf-8"))

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/stitch":
            try:
                content_len = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(content_len).decode("utf-8")
                data = json.loads(body)

                slices = data.get("slices", [])
                meta = data.get("tweetInfo", {})
                dpr = float(data.get("dpr", 1.0))
                method = data.get("method", "pillow")

                total_w = meta.get("totalWidth")
                total_h = meta.get("totalHeight")
                if total_w: total_w = int(total_w * dpr)
                if total_h: total_h = int(total_h * dpr)

                os.makedirs("output", exist_ok=True)
                handle = meta.get("handle", "tweet")
                tweet_id = meta.get("tweetId", "post")
                date_str = meta.get("dateStr", time.strftime("%Y%m%d"))
                out_filename = f"output/{handle}-{tweet_id}-{date_str}.png"

                if method == "ffmpeg" and HAS_FFMPEG:
                    # Сохраняем временные слайсы для ffmpeg
                    temp_dir = f"output/temp_{tweet_id}"
                    os.makedirs(temp_dir, exist_ok=True)
                    slice_files = []
                    for idx, s in enumerate(slices):
                        temp_path = os.path.join(temp_dir, f"slice_{idx:03d}.png")
                        img = decode_base64_image(s["dataUrl"])
                        # Вырезаем область
                        sx = int(s.get("rectLeft", 0) * dpr)
                        sy = int(s.get("sliceTop", 0) * dpr)
                        sw = int(s.get("rectWidth", img.width) * dpr)
                        sh = int(s.get("visibleH", img.height) * dpr)
                        cropped = img.crop((sx, sy, min(sx + sw, img.width), min(sy + sh, img.height)))
                        cropped.save(temp_path)
                        slice_files.append(temp_path)

                    stitch_images_ffmpeg(slice_files, out_filename)
                    shutil.rmtree(temp_dir, ignore_errors=True)
                    with open(out_filename, "rb") as f:
                        b64_res = base64.b64encode(f.read()).decode("utf-8")
                else:
                    # Склейка через Pillow
                    canvas = stitch_slices_pillow(slices, total_w, total_h)
                    canvas.save(out_filename, "PNG")
                    buf = io.BytesIO()
                    canvas.save(buf, format="PNG")
                    b64_res = base64.b64encode(buf.getvalue()).decode("utf-8")

                data_url = f"data:image/png;base64,{b64_res}"
                self._set_cors_headers(200)
                resp_payload = {
                    "success": True,
                    "filepath": os.path.abspath(out_filename),
                    "dataUrl": data_url
                }
                self.wfile.write(json.dumps(resp_payload).encode("utf-8"))
                print(f"[+] Screenshot stitched and saved: {out_filename}")

            except Exception as e:
                print(f"[-] Stitching error / Ошибка склейки: {e}", file=sys.stderr)
                self._set_cors_headers(500)
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))

        elif parsed.path == "/convert":
            try:
                content_len = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(content_len).decode("utf-8")
                data = json.loads(body)

                video_data = data.get("videoData", "")
                filename = data.get("filename", "video.mp4")
                if not filename.endswith(".mp4"):
                    filename = os.path.splitext(filename)[0] + ".mp4"

                custom_folder = data.get("outputFolder", "")
                save_to_disk = bool(custom_folder and os.path.isabs(custom_folder))

                if "," in video_data:
                    video_data = video_data.split(",", 1)[1]
                raw_bytes = base64.b64decode(video_data)

                temp_dir = tempfile.gettempdir()
                temp_webm = os.path.join(temp_dir, f"tw_conv_{os.getpid()}_{int(time.time() * 1000)}.webm")
                temp_mp4 = os.path.join(temp_dir, f"tw_conv_{os.getpid()}_{int(time.time() * 1000)}.mp4")

                with open(temp_webm, "wb") as f:
                    f.write(raw_bytes)

                if not HAS_FFMPEG:
                    raise RuntimeError("FFmpeg не найден в PATH на этой машине.")

                # Convert to Telegram-compatible H.264 MP4 (yuv420p + faststart + AAC) with visually lossless CRF 17 and normalized 60 fps
                cmd = [
                    "ffmpeg", "-y",
                    "-i", temp_webm,
                    "-c:v", "libx264",
                    "-r", "60",
                    "-fps_mode", "cfr",
                    "-crf", "17",
                    "-preset", "fast",
                    "-pix_fmt", "yuv420p",
                    "-c:a", "aac",
                    "-b:a", "192k",
                    "-movflags", "+faststart",
                    temp_mp4
                ]
                res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                if res.returncode != 0:
                    err_msg = res.stderr.decode("utf-8", errors="ignore")
                    raise RuntimeError(f"FFmpeg error: {err_msg}")

                with open(temp_mp4, "rb") as f:
                    mp4_bytes = f.read()

                saved_filepath = ""
                if save_to_disk:
                    try:
                        os.makedirs(custom_folder, exist_ok=True)
                        saved_filepath = os.path.join(custom_folder, filename)
                        with open(saved_filepath, "wb") as f:
                            f.write(mp4_bytes)
                    except Exception as fe:
                        print(f"[-] Failed to save to {custom_folder}: {fe}")

                # Clean up temporary files immediately so no duplicate files are left on disk
                for p in (temp_webm, temp_mp4):
                    try:
                        if os.path.exists(p):
                            os.remove(p)
                    except OSError:
                        pass

                b64_mp4 = base64.b64encode(mp4_bytes).decode("utf-8")

                self._set_cors_headers(200)
                resp_payload = {
                    "success": True,
                    "filename": filename,
                    "filepath": saved_filepath,
                    "size": len(mp4_bytes),
                    "dataUrl": f"data:video/mp4;base64,{b64_mp4}"
                }
                self.wfile.write(json.dumps(resp_payload).encode("utf-8"))
                print(f"[+] MP4 video (H.264/AAC for TG) ready: {filename} ({len(mp4_bytes)/1024/1024:.2f} MB)")
            except Exception as e:
                print(f"[-] MP4 conversion error / Ошибка конвертации в MP4: {e}", file=sys.stderr)
                self._set_cors_headers(500)
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
        else:
            self._set_cors_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode("utf-8"))


def run_server(port=5678):
    server_address = ("127.0.0.1", port)
    httpd = HTTPServer(server_address, StitcherHTTPHandler)
    print("=" * 60)
    print(" [X/Twitter Screenshoter] Local Processing Server is running:")
    print(f" URL:            http://127.0.0.1:{port}")
    print(f" Status Check:   http://127.0.0.1:{port}/status")
    print(f" Stitch (POST):  http://127.0.0.1:{port}/stitch")
    print(f" Video (POST):   http://127.0.0.1:{port}/convert")
    print("=" * 60)
    print("Press Ctrl+C to stop the server / Нажмите Ctrl+C для остановки.\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped / Сервер остановлен.")
        httpd.server_close()


def run_cli(args):
    """CLI mode for stitching slice images from a folder"""
    if not os.path.isdir(args.input_folder):
        print(f"[-] Directory not found: {args.input_folder}", file=sys.stderr)
        sys.exit(1)

    # Valid image extensions
    valid_exts = {".png", ".jpg", ".jpeg", ".webp"}
    files = sorted([
        os.path.join(args.input_folder, f)
        for f in os.listdir(args.input_folder)
        if os.path.splitext(f.lower())[1] in valid_exts
    ])

    if not files:
        print(f"[-] No valid images found in {args.input_folder}", file=sys.stderr)
        sys.exit(1)

    print(f"[*] Found {len(files)} slice images to stitch.")

    if args.method == "ffmpeg":
        stitch_images_ffmpeg(files, args.output)
    else:
        # Pillow vertical stack
        images = [Image.open(f).convert("RGBA") for f in files]
        max_w = max(im.width for im in images)
        total_h = sum(im.height for im in images)

        canvas = Image.new("RGBA", (max_w, total_h), (0, 0, 0, 255))
        y_offset = 0
        for im in images:
            canvas.paste(im, (0, y_offset))
            y_offset += im.height
        canvas.save(args.output, "PNG")

    print(f"[+] Stitched successfully / Успешно сохранено: {args.output}")


def main():
    parser = argparse.ArgumentParser(
        description="High-Res Twitter/X Screenshot Stitcher & Video Converter (Pillow / FFmpeg)"
    )
    parser.add_argument("--server", action="store_true", help="Start local HTTP processing server for browser extension")
    parser.add_argument("--port", type=int, default=5678, help="Server port (default: 5678)")
    parser.add_argument("--input-folder", type=str, help="Folder containing slice images to stitch (CLI mode)")
    parser.add_argument("--output", type=str, default="full_stitched.png", help="Path to output PNG image")
    parser.add_argument("--method", choices=["pillow", "ffmpeg"], default="pillow", help="Stitching engine (pillow or ffmpeg)")

    args = parser.parse_args()

    check_dependencies()

    if args.server or (not args.input_folder):
        run_server(args.port)
    else:
        run_cli(args)


if __name__ == "__main__":
    main()
