from pathlib import Path
from PIL import Image
out = Path(r"D:\数智编程\MyPortfolio\public\images\about")
for name in ["profile-1", "profile-2", "profile-3"]:
    src = out / f"{name}.jpg"
    img = Image.open(src).convert("RGB")
    img.thumbnail((900, 900), Image.LANCZOS)
    img.save(out / f"{name}.webp", "WEBP", quality=84, method=6)
    print(name, img.size)
