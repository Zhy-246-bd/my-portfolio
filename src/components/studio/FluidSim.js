const N = 192;
const M = 108;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const index = (x, y) => x + y * N;

export default class FluidSim {
  constructor() {
    this.n = N;
    this.m = M;
    this.u = new Float32Array(N * M);
    this.v = new Float32Array(N * M);
    this.u0 = new Float32Array(N * M);
    this.v0 = new Float32Array(N * M);
    this.teal = new Float32Array(N * M);
    this.teal0 = new Float32Array(N * M);
    this.pink = new Float32Array(N * M);
    this.pink0 = new Float32Array(N * M);
    this.div = new Float32Array(N * M);
    this.curl = new Float32Array(N * M);
    this.pressure = new Float32Array(N * M);
    this.pixels = new Uint8Array(N * M * 4);
    this.time = 0;
    this.last = null;
  }

  addSource(x, y, fx, fy, pinkAmount, tealAmount, radius = 4) {
    const cx = clamp(Math.floor(x * N), 1, N - 2);
    const cy = clamp(Math.floor(y * M), 1, M - 2);
    const r = Math.max(1, Math.floor(radius));

    for (let oy = -r; oy <= r; oy += 1) {
      const gy = cy + oy;
      if (gy < 1 || gy >= M - 1) continue;
      for (let ox = -r; ox <= r; ox += 1) {
        const gx = cx + ox;
        if (gx < 1 || gx >= N - 1) continue;
        const distance = (ox * ox + oy * oy) / (r * r);
        const falloff = Math.exp(-distance * 2.2);
        const i = index(gx, gy);
        this.u[i] += fx * falloff;
        this.v[i] += fy * falloff;
        this.pink[i] = clamp(
          this.pink[i] + pinkAmount * falloff,
          0,
          1.5,
        );
        this.teal[i] = clamp(
          this.teal[i] + tealAmount * falloff,
          0,
          1.5,
        );
      }
    }
  }

  pointer(x, y) {
    if (this.last) {
      const dx = x - this.last.x;
      const dy = y - this.last.y;
      if (Math.abs(dx) + Math.abs(dy) > 0.0005) {
        this.addSource(
          x,
          y,
          dx * N * 24,
          dy * M * 24,
          0.9,
          0,
          5,
        );
      }
    }
    this.last = { x, y };
  }

  sample(field, x, y) {
    const clampedX = clamp(x, 1, N - 2);
    const clampedY = clamp(y, 1, M - 2);
    const x0 = Math.floor(clampedX);
    const y0 = Math.floor(clampedY);
    const x1 = Math.min(x0 + 1, N - 1);
    const y1 = Math.min(y0 + 1, M - 1);
    const tx = clampedX - x0;
    const ty = clampedY - y0;

    const a = field[index(x0, y0)];
    const b = field[index(x1, y0)];
    const c = field[index(x0, y1)];
    const d = field[index(x1, y1)];

    return (
      a * (1 - tx) * (1 - ty) +
      b * tx * (1 - ty) +
      c * (1 - tx) * ty +
      d * tx * ty
    );
  }

  computeCurl() {
    for (let y = 1; y < M - 1; y += 1) {
      for (let x = 1; x < N - 1; x += 1) {
        const i = index(x, y);
        this.curl[i] =
          0.5 *
          (this.v[index(x + 1, y)] -
            this.v[index(x - 1, y)] -
            (this.u[index(x, y + 1)] -
              this.u[index(x, y - 1)]));
      }
    }
  }

  applyVorticity(dt) {
    const epsilon = 18;
    for (let y = 2; y < M - 2; y += 1) {
      for (let x = 2; x < N - 2; x += 1) {
        const i = index(x, y);
        const dx =
          Math.abs(this.curl[index(x + 1, y)]) -
          Math.abs(this.curl[index(x - 1, y)]);
        const dy =
          Math.abs(this.curl[index(x, y + 1)]) -
          Math.abs(this.curl[index(x, y - 1)]);
        const length = Math.hypot(dx, dy) + 0.0001;
        const force = this.curl[i] * epsilon * dt;
        this.u[i] += (dy / length) * force;
        this.v[i] -= (dx / length) * force;
      }
    }
  }

  advect(field, previous, dt) {
    for (let y = 1; y < M - 1; y += 1) {
      for (let x = 1; x < N - 1; x += 1) {
        const i = index(x, y);
        const px = x - this.u[i] * dt;
        const py = y - this.v[i] * dt;
        field[i] = this.sample(previous, px, py);
      }
    }
  }

  project() {
    for (let y = 1; y < M - 1; y += 1) {
      for (let x = 1; x < N - 1; x += 1) {
        const i = index(x, y);
        this.div[i] =
          -0.5 *
          (this.u[index(x + 1, y)] -
            this.u[index(x - 1, y)] +
            this.v[index(x, y + 1)] -
            this.v[index(x, y - 1)]);
        this.pressure[i] = 0;
      }
    }

    for (let iteration = 0; iteration < 16; iteration += 1) {
      for (let y = 1; y < M - 1; y += 1) {
        for (let x = 1; x < N - 1; x += 1) {
          const i = index(x, y);
          this.pressure[i] =
            (this.div[i] +
              this.pressure[index(x - 1, y)] +
              this.pressure[index(x + 1, y)] +
              this.pressure[index(x, y - 1)] +
              this.pressure[index(x, y + 1)]) /
            4;
        }
      }
    }

    for (let y = 1; y < M - 1; y += 1) {
      for (let x = 1; x < N - 1; x += 1) {
        const i = index(x, y);
        this.u[i] -=
          0.5 *
          (this.pressure[index(x + 1, y)] -
            this.pressure[index(x - 1, y)]);
        this.v[i] -=
          0.5 *
          (this.pressure[index(x, y + 1)] -
            this.pressure[index(x, y - 1)]);
      }
    }
  }

  step(dt) {
    this.time += dt;
    const t = this.time;

    this.addSource(
      0.18 + Math.sin(t * 0.24) * 0.04,
      0.82,
      0,
      4,
      0,
      0.09,
      8,
    );
    this.addSource(
      0.82 + Math.cos(t * 0.18) * 0.04,
      0.76,
      0,
      5,
      0,
      0.075,
      8,
    );

    this.u0.set(this.u);
    this.v0.set(this.v);
    this.advect(this.u, this.u0, dt);
    this.advect(this.v, this.v0, dt);

    for (let y = 1; y < M - 1; y += 1) {
      for (let x = 1; x < N - 1; x += 1) {
        const i = index(x, y);
        this.v[i] += this.teal[i] * 9 * dt;
      }
    }

    this.computeCurl();
    this.applyVorticity(dt);
    this.project();

    this.teal0.set(this.teal);
    this.pink0.set(this.pink);
    this.advect(this.teal, this.teal0, dt);
    this.advect(this.pink, this.pink0, dt);

    for (let y = 1; y < M - 1; y += 1) {
      for (let x = 1; x < N - 1; x += 1) {
        const i = index(x, y);
        this.u[i] *= 0.994;
        this.v[i] *= 0.994;
        this.teal[i] *= 0.995;
        this.pink[i] *= 0.994;
      }
    }

    for (let x = 0; x < N; x += 1) {
      this.u[index(x, 0)] = 0;
      this.v[index(x, 0)] = 0;
      this.u[index(x, M - 1)] = 0;
      this.v[index(x, M - 1)] = 0;
    }
    for (let y = 0; y < M; y += 1) {
      this.u[index(0, y)] = 0;
      this.v[index(0, y)] = 0;
      this.u[index(N - 1, y)] = 0;
      this.v[index(N - 1, y)] = 0;
    }
  }

  getPixels() {
    const pixels = this.pixels;
    for (let i = 0; i < N * M; i += 1) {
      const offset = i * 4;
      pixels[offset] = clamp(this.teal[i] * 255, 0, 255);
      pixels[offset + 1] = clamp(this.pink[i] * 255, 0, 255);
      pixels[offset + 2] = clamp(
        (this.u[i] / 36 + 0.5) * 255,
        0,
        255,
      );
      pixels[offset + 3] = clamp(
        (this.v[i] / 36 + 0.5) * 255,
        0,
        255,
      );
    }
    return pixels;
  }
}
