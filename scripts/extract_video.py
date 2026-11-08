import imageio.v3 as iio
from pathlib import Path
src = Path(r"E:\hai'yan\Videos\屏幕录制\屏幕录制 2026-11-08 155452.mp4")
out = Path(r"C:\Users\hai'yan\Documents\deepseek-harness\default-workspace\video-frames")
out.mkdir(exist_ok=True)
meta = iio.immeta(src, plugin="FFMPEG")
print(meta)
fps = meta.get("fps",30)
dur = meta.get("duration",0)
print("duration",dur,"fps",fps)
for i in range(12):
    t = dur * i / 11 if dur else i
    try:
        frame = iio.imread(src, index=int(t*fps), plugin="FFMPEG")
        iio.imwrite(out / f"frame-{i:02d}.jpg", frame)
        print(i, round(t,2), frame.shape)
    except Exception as e:
        print("err", i, t, e)
