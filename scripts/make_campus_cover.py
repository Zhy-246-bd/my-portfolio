from pathlib import Path
from PIL import Image
src = Path(r"C:\Users\hai'yan\Documents\deepseek-harness\default-workspace\campus-food-login.png")
out = Path(r"D:\数智编程\MyPortfolio\public\images\project-8.webp")
img = Image.open(src).convert("RGB")
img = img.crop((0, 0, 1440, 960)).resize((1200, 800), Image.LANCZOS)
img.save(out, "WEBP", quality=85, method=6)
print(img.size)
