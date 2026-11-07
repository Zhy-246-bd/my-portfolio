from pathlib import Path
from PIL import Image

base = Path(r"C:\Users\hai'yan\.dsh\attachments\v1\objects")
out = Path(r"D:\数智编程\MyPortfolio\public\images\hobbies")
items = [
  ("ea/eab33f15dbb18b983c76957ef44c6d200e96fc5b4d1f2025cd600af31d871e9f", "walk-sunset-bikes"),
  ("d5/d517d9c338652ca1434c00f6eb17ffe3ff4c338635dd10c733e3841a42bdb1df", "cat-lazy"),
  ("59/595b552edda45e327d8ffd633fa6222abdb1eb81ce5fbea171a6cb163e967744", "walk-sky"),
  ("67/67d9b288df01f61fc5f17e5ff2566ba912748ef168c2663b6fdf70e05abc4538", "food-bbq"),
  ("4c/4c2288d54c78afffa5fd9d11840ca4536c3ccef74cd37c2a7d113b912ad8fe99", "food-chicken-pot"),
  ("b1/b1bfe62f2eaf299fd64651cf9aa1cdf7d50c218cc19942fab24a23129e5a5c8a", "food-tofu-pot"),
  ("73/73bb8470774cb315b12520c16b63944763e13d7c7fc950becd87eaf0913c7844", "food-beef-noodles"),
  ("f1/f16fc6c7669b2dd4ed69243b9cb3651d29e04cd8b7fd6aafba51e2ce59e61bdd", "drink-matcha"),
  ("b2/b25deec8fda9e2a0f7c430a10a3e2f1aba9ee7818fdb99406420ca641f191a46", "food-tofu"),
  ("27/2787e09a8f99cd15e223120dd0729b44744bab3ca4a93f72af94065f1b37b2e7", "food-fish-pot"),
  ("ea/eab56e9aec896f244aa3ae063718ed8f30c869b764675b8b057c8813086e9e5c", "city-night"),
  ("bc/bcbc215a69b4228066f28eb2ff5a80bd7dc00feb2a325b504187dc8f3a888461", "theater"),
  ("57/5726085caa5208d9b3184def1ca4bfd5b77d157e99c617fc749ff7956037655f", "food-hotpot"),
  ("fa/fa93a3fda770ced1f45f55b3785c0b2852da4e9fde0bd3ec145a37bdbcaf499f", "walk-old-street"),
  ("3f/3f4e1ce8b3a01dc8ab5c32994eacdf5d2c0714f7f3b9df68c82d857bfdd4e6e7", "walk-historic-room"),
  ("96/96d799bde54be6f81204b54c75b173b221e7c521f9c9f2ca32aa05b08934f271", "walk-sunset-street"),
  ("f6/f6e5b6718b2c667afe3123ff8f98ef880f053e95f9da82d2a3d6333cafd5934c", "walk-beach"),
  ("84/84b1c57a3f483919f786c88cbf506ff44da6ef47b73341eb3b03e25afd415bd7", "food-rice-bowl"),
]
for rel, name in items:
    src = base / rel
    img = Image.open(src).convert("RGB")
    img.thumbnail((1000, 1000), Image.LANCZOS)
    img.save(out / f"{name}.webp", "WEBP", quality=82, method=6)
    print(name, img.size)
