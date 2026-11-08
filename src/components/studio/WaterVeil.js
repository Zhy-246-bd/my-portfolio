"use client";

import { useEffect, useRef } from "react";

const GRID = 84;
const DAMPING = 0.987;

function smoothstep(edge0, edge1, value) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export default function WaterVeil({ phase }) {
  const canvasRef = useRef(null);
  const phaseRef = useRef(phase);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const offscreen = document.createElement("canvas");
    offscreen.width = GRID;
    offscreen.height = GRID;
    const offscreenContext = offscreen.getContext("2d");
    if (!offscreenContext) return undefined;

    const current = new Float32Array(GRID * GRID);
    const previous = new Float32Array(GRID * GRID);
    const next = new Float32Array(GRID * GRID);
    const image = offscreenContext.createImageData(GRID, GRID);

    const drop = (cx, cy, strength) => {
      const x = Math.floor(cx * (GRID - 1));
      const y = Math.floor(cy * (GRID - 1));
      for (let oy = -3; oy <= 3; oy += 1) {
        for (let ox = -3; ox <= 3; ox += 1) {
          const px = x + ox;
          const py = y + oy;
          if (px < 1 || py < 1 || px >= GRID - 1 || py >= GRID - 1) {
            continue;
          }
          const dist = Math.hypot(ox, oy);
          if (dist > 3.4) continue;
          current[py * GRID + px] += strength * (1 - dist / 4);
        }
      }
    };

    drop(0.5, 0.44, 0.9);
    drop(0.46, 0.5, 0.35);
    for (let index = 0; index < 8; index += 1) {
      const angle = (index / 8) * Math.PI * 2;
      drop(
        0.5 + Math.cos(angle) * 0.045,
        0.44 + Math.sin(angle) * 0.045,
        0.3,
      );
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.imageSmoothingEnabled = true;
    };
    resize();
    window.addEventListener("resize", resize);

    let revealStarted = null;
    let animationFrame = 0;

    const render = (now) => {
      if (phaseRef.current === "reveal" && revealStarted === null) {
        revealStarted = now;
      }
      const revealProgress = revealStarted
        ? Math.min(1, (now - revealStarted) / 1200)
        : 0;
      const holeRadius = 0.06 + revealProgress * 1.5;

      for (let y = 1; y < GRID - 1; y += 1) {
        for (let x = 1; x < GRID - 1; x += 1) {
          const index = y * GRID + x;
          next[index] =
            ((current[index - 1] +
              current[index + 1] +
              current[index - GRID] +
              current[index + GRID]) /
              2 -
              previous[index]) *
            DAMPING;
        }
      }

      previous.set(current);
      current.set(next);

      const revealing = phaseRef.current === "reveal";
      canvas.style.mixBlendMode = revealing ? "normal" : "screen";
      canvas.style.backdropFilter = revealing ? "none" : "blur(2.5px)";
      canvas.style.webkitBackdropFilter = revealing ? "none" : "blur(2.5px)";
      const data = image.data;
      const centerX = 0.5;
      const centerY = 0.44;

      for (let y = 0; y < GRID; y += 1) {
        for (let x = 0; x < GRID; x += 1) {
          const index = y * GRID + x;
          const height = current[index];
          const dx = x / (GRID - 1) - centerX;
          const dy = y / (GRID - 1) - centerY;
          let distance = Math.hypot(dx, dy);
          distance += height * 0.22;

          const hole = revealing
            ? smoothstep(
                holeRadius - 0.075,
                holeRadius + 0.075,
                distance,
              )
            : 1;

          const gradientX =
            current[y * GRID + Math.min(GRID - 1, x + 1)] -
            current[y * GRID + Math.max(0, x - 1)];
          const gradientY =
            current[Math.min(GRID - 1, y + 1) * GRID + x] -
            current[Math.max(0, y - 1) * GRID + x];
          const light = Math.min(
            1,
            Math.max(0, 0.42 + gradientX * 18 + gradientY * 18),
          );
          const grain =
            Math.abs(Math.sin(x * 0.72 + y * 0.31 + now * 0.0022)) *
            Math.abs(Math.sin(y * 0.81 - now * 0.0016));
          const caustic =
            Math.max(0, light - 0.56) * (0.35 + grain * 0.95);
          const crest = Math.max(0, height);

          const offset = index * 4;
          const alpha = revealing
            ? hole * (0.9 + caustic * 0.1)
            : Math.min(0.2, caustic * 0.9 + crest * 0.12);

          if (revealing) {
            data[offset] = Math.min(255, 4 + caustic * 70);
            data[offset + 1] = Math.min(255, 14 + caustic * 95);
            data[offset + 2] = Math.min(255, 12 + caustic * 80);
          } else {
            data[offset] = Math.min(255, 160 + caustic * 95);
            data[offset + 1] = Math.min(255, 224 + caustic * 31);
            data[offset + 2] = Math.min(255, 208 + caustic * 47);
          }
          data[offset + 3] = Math.min(235, alpha * 255);
        }
      }

      offscreenContext.putImageData(image, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(offscreen, 0, 0, canvas.width, canvas.height);

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="water-veil" aria-hidden="true" />;
}
