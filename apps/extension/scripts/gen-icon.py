from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    raise SystemExit("PIL_MISSING")

out = Path(__file__).resolve().parent.parent / "assets" / "icon.png"
im = Image.new("RGBA", (128, 128), (15, 92, 76, 255))
d = ImageDraw.Draw(im)
d.rounded_rectangle([0, 0, 127, 127], radius=28, fill=(15, 92, 76, 255))
d.ellipse([28, 28, 100, 100], outline=(247, 246, 243, 255), width=8)
d.ellipse([54, 54, 74, 74], fill=(247, 246, 243, 255))
im.save(out)
print(out)
