import numpy as np
from PIL import Image
rng = np.random.default_rng(8)
w = h = 512
n = rng.integers(0, 256, (h, w), dtype=np.uint8)
img = np.dstack([n, n, n, np.full((h, w), 255, dtype=np.uint8)])
Image.fromarray(img, "RGBA").save("public/images/wood-noise.png", optimize=True)
print("saved")
