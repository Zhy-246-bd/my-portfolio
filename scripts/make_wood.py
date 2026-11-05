import numpy as np
from PIL import Image, ImageFilter

W, H = 1800, 1200
rng = np.random.default_rng(23)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

# broad, soft noise
base_noise = rng.normal(0, 1, (H // 12 + 1, W // 12 + 1)).astype(np.float32)
base_img = Image.fromarray(((base_noise - base_noise.min()) / (np.ptp(base_noise) + 1e-6) * 255).astype(np.uint8))
base_img = base_img.resize((W, H), Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(9))
broad = np.asarray(base_img, dtype=np.float32) / 255.0
broad = (broad - 0.5) * 2

image = np.zeros((H, W, 3), dtype=np.float32)
plank_h = H / 5.0
seam = 5.0

for i in range(5):
    y0 = i * plank_h
    y1 = (i + 1) * plank_h
    mask = (yy >= y0) & (yy < y1)
    local_y = yy - y0

    tone = 0.82 + 0.16 * rng.random()
    base = np.array([116, 76, 47], dtype=np.float32) * tone
    base = base[None, None, :] + np.array([12, 6, 2], dtype=np.float32) * broad[..., None]

    # long grain following x with gentle wave
    wave = (
        np.sin(xx * 0.009 + local_y * 0.021 + broad * 2.4) * 0.5
        + np.sin(xx * 0.031 - local_y * 0.012 + broad * 1.2) * 0.28
        + np.sin(xx * 0.071 + local_y * 0.04) * 0.12
    )
    fine = rng.normal(0, 0.18, (H, W)).astype(np.float32)
    fine_img = Image.fromarray(((fine - fine.min()) / (np.ptp(fine) + 1e-6) * 255).astype(np.uint8))
    fine_img = fine_img.filter(ImageFilter.GaussianBlur(0.6))
    fine = (np.asarray(fine_img, dtype=np.float32) / 255.0 - 0.5) * 2

    grain = (wave * 0.16 + fine * 0.075)[..., None]
    color = base * (1 + grain)
    color += np.array([0, -5, -3], dtype=np.float32)[None, None, :] * (wave[..., None] * 0.12)

    image[mask] = color[mask]

# plank seams and highlights
for i in range(1, 5):
    y = int(i * plank_h)
    image[max(0, y - 3):y + 3, :, :] *= 0.42
    image[max(0, y + 3):y + 6, :, :] *= 0.68
    image[max(0, y - 9):y - 3, :, :] *= 1.12

# knots
for cx, cy, rx, ry in [(330, 250, 60, 35), (1320, 820, 74, 42), (860, 430, 38, 23)]:
    d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    knot = np.exp(-d * 2.2)
    rings = np.sin(np.sqrt(d) * 15.0) * 0.5 + 0.5
    shade = knot * (0.55 + 0.28 * rings)
    image *= (1 - 0.55 * shade[..., None])
    image += np.array([22, 10, 3], dtype=np.float32)[None, None, :] * (knot * 0.3)[..., None]

# vignette and warm light from top
vx = (xx - W / 2) / (W / 2)
vy = (yy - H / 2) / (H / 2)
vignette = np.clip(1.0 - 0.16 * (vx ** 2 + vy ** 2), 0.65, 1.0)
light = np.clip(1.08 - yy / H * 0.3, 0.78, 1.04)
image *= (vignette * light)[..., None]

image = np.clip(image, 0, 255).astype(np.uint8)
Image.fromarray(image).save("public/images/wood-board.jpg", quality=88, optimize=True)
print("saved", W, H)
