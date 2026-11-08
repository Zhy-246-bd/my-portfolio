from pathlib import Path
from PIL import Image
src = Path(r"C:\Users\hai'yan\.dsh\attachments\v1\objects\86\8647dc6d64fd4ecd28992bcceeaf7dffdac5873ff5be782cacdfc42d3eaaba71")
out = Path(r"D:\数智编程\MyPortfolio\public\images\project-8.webp")
img = Image.open(src).convert("RGB")
img = img.crop((0, 0, 1389, 870))
img.thumbnail((1200, 900), Image.LANCZOS)
img.save(out, "WEBP", quality=85, method=6)
print(img.size)
