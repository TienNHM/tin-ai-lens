"""Pad popup screenshots to Chrome Web Store size 1280x800."""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "store" / "screenshots"
OUT = ROOT / "store" / "screenshots"
TARGET = (1280, 800)
BG = (247, 246, 243, 255)  # TinAiLens --bg
ACCENT = (15, 92, 76, 255)


def pad_to_store(src: Path, dest: Path) -> None:
    img = Image.open(src).convert("RGBA")
    canvas = Image.new("RGBA", TARGET, BG)
    draw = ImageDraw.Draw(canvas)
    # soft accent wash
    draw.ellipse([-200, -240, 520, 480], fill=(231, 242, 239, 255))
    draw.ellipse([900, 400, 1500, 1000], fill=(231, 242, 239, 180))

    # scale popup to fit with margin
    max_w, max_h = 980, 680
    ratio = min(max_w / img.width, max_h / img.height, 1.0)
    # allow upscale a bit for readability on store
    ratio = min(max_w / img.width, max_h / img.height)
    new_size = (max(1, int(img.width * ratio)), max(1, int(img.height * ratio)))
    resized = img.resize(new_size, Image.Resampling.LANCZOS)

    # card shadow + white frame
    x = (TARGET[0] - new_size[0]) // 2
    y = (TARGET[1] - new_size[1]) // 2
    pad = 16
    frame = Image.new(
        "RGBA",
        (new_size[0] + pad * 2, new_size[1] + pad * 2),
        (255, 255, 255, 255),
    )
    # simple drop shadow
    shadow = Image.new(
        "RGBA",
        (frame.width + 12, frame.height + 12),
        (0, 0, 0, 0),
    )
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle(
        [6, 6, shadow.width - 1, shadow.height - 1],
        radius=18,
        fill=(28, 27, 25, 40),
    )
    canvas.alpha_composite(shadow, (x - pad - 2, y - pad + 4))
    fdraw = ImageDraw.Draw(frame)
    fdraw.rounded_rectangle(
        [0, 0, frame.width - 1, frame.height - 1],
        radius=14,
        outline=(228, 225, 218, 255),
        width=2,
    )
    frame.paste(resized, (pad, pad), resized)
    canvas.alpha_composite(frame, (x - pad, y - pad))

    # accent bar
    draw.rectangle([0, 0, TARGET[0], 6], fill=ACCENT)

    canvas.convert("RGB").save(dest, format="PNG", optimize=True)
    print(f"{dest.name}: {TARGET[0]}x{TARGET[1]}")


def main() -> None:
    mapping = [
        ("01-popup-en.png", "store-01-popup-en.png"),
        ("02-popup-vi.png", "store-02-popup-vi.png"),
        ("03-settings-vi.png", "store-03-settings-vi.png"),
        ("04-history-vi.png", "store-04-history-vi.png"),
        ("05-report-score-vi.png", "store-05-report-score-vi.png"),
        ("06-report-signals-vi.png", "store-06-report-signals-vi.png"),
        ("07-report-suggestions-vi.png", "store-07-report-suggestions-vi.png"),
    ]
    for src_name, out_name in mapping:
        pad_to_store(SRC / src_name, OUT / out_name)


if __name__ == "__main__":
    main()
