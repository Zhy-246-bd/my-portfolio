from pathlib import Path
from PIL import Image, ImageOps
src_root = Path(r"C:\Users\hai'yan\.dsh\attachments\v1\objects")
out = Path(r"D:\数智编程\MyPortfolio\public\images\hobbies")
files = {
    "walk-cat-street.webp": r"41\415a5f5912e91615f3609d44b332b0e820b2c912f1cc79868870bbe072ce17f5",
    "walk-goldfish.webp": r"a3\a33b7f063b9c91551960ae649f0a4ed90a2b6732de8bfcaa71113624e95e0643",
    "walk-cat-bag.webp": r"7c\7cd304c11a37a74b4e5e4f5b17d7e5c1b2afcc16dc231350851b7171561c971b",
    "walk-pavilion.webp": r"55\5596b94d261616d922b479c03e0758d05799b55d932daa9760dca06f67f88502",
    "walk-dog.webp": r"0c\0c19d29477e31d0ed97f72938285ecb6fe9813668d047db780cc01759dc85270",
    "hobby-badminton.webp": r"73\73474c3edd665f0e73c8f0aebd885014e53aee16402196f012a07761aab3e664",
    "walk-bikes-sunset.webp": r"1a\1a221fa0d4b2e247d8efa9cc3a21021d01bde2a813567ef69b74b93b69b8b15c",
    "food-feast.webp": r"c4\c449fe4c70962d992bb6ec45ee060eaa2d7f65ae8eff74195ff0a8a662e9e656",
    "walk-river-sunset.webp": r"50\50767a8c5f421ac3a6c20f3a0dfe2318577654dd85f55043298601f3895ab71f",
    "walk-city-dusk.webp": r"88\881680af76f2afc721bd3e915b89f01ff3b3ad65cb2e0f4a2942ca2318ae9d3a",
}
for name, rel in files.items():
    src = src_root / rel
    img = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    img.thumbnail((900, 900), Image.LANCZOS)
    img.save(out / name, "WEBP", quality=82, method=6)
    print(name, img.size)
