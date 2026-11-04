"use client";

import { useEffect, useRef } from "react";
import GpuFluid from "./GpuFluid";
import styles from "./studio.module.css";

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D uText;
uniform sampler2D uVelocity;
uniform sampler2D uDye;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uBreak;
uniform float uTime;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(13.7, 7.1);
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 p = uv * aspect;
  float t = uTime;

  vec4 dye = texture2D(uDye, uv);
  float tealDye = dye.r;
  float pinkDye = dye.g;
  vec2 velocity = texture2D(uVelocity, uv).xy;
  float density = tealDye + pinkDye;

  vec2 q = vec2(
    fbm(p * 1.4 + vec2(t * 0.02, 0.0)),
    fbm(p * 1.4 + vec2(4.7, -t * 0.015))
  );
  float n1 = fbm(p * 2.2 + q * 1.5 + vec2(t * 0.025, -t * 0.02));
  float n2 = fbm(p * 5.0 + q * 0.6 + vec2(-t * 0.03, t * 0.015));
  float filament = fbm(
    vec2(p.x * 8.0 + q.y * 3.0, p.y * 3.0 - t * 0.3)
  );
  float field = n1 * 0.55 + n2 * 0.3 + filament * 0.15;

  float breakArea = 1.0 - smoothstep(
    0.0,
    0.28,
    distance(uv, uPointer)
  );
  float scatter = breakArea * uBreak;
  vec2 outward = normalize(uv - uPointer + vec2(0.0001));
  vec2 shardNoise = vec2(
    fbm(uv * 32.0 + vec2(t * 0.55, 0.0)) - 0.5,
    fbm(uv * 32.0 + vec2(5.2, -t * 0.45)) - 0.5
  );
  vec2 textUv = clamp(
    uv +
      (outward * 0.045 + shardNoise * 0.1) * scatter +
      velocity * 0.004,
    vec2(0.0),
    vec2(1.0)
  );
  float text = texture2D(uText, textUv).a;
  float dissolveNoise = fbm(uv * 38.0 + vec2(t * 0.5, -t * 0.25));
  float textHole = smoothstep(
    0.5,
    0.9,
    scatter * (0.4 + 0.6 * dissolveNoise)
  );
  text *= 1.0 - textHole * 0.9;

  vec2 flowDirection = normalize(q - vec2(0.5) + vec2(0.0001));
  float bleed = 0.0;
  bleed += texture2D(uText, clamp(textUv + flowDirection * 0.007, 0.0, 1.0)).a;
  bleed += texture2D(uText, clamp(textUv + flowDirection * 0.014, 0.0, 1.0)).a;
  bleed += texture2D(uText, clamp(textUv - flowDirection * 0.007, 0.0, 1.0)).a;
  bleed /= 3.0;

  float inkNoise = fbm(textUv * 13.0 + vec2(t * 0.08, 0.0));
  float flowInk = fbm(
    vec2(
      p.x * 4.5 + q.y * 2.0 + t * 0.1,
      p.y * 12.0 - t * 0.35
    )
  );
  float grain = smoothstep(
    0.2,
    0.72,
    fbm(textUv * 24.0 + vec2(t * 0.18, -t * 0.1))
  );
  text = smoothstep(
    0.12,
    0.82,
    text + (inkNoise - 0.5) * 0.24 + (flowInk - 0.5) * 0.1
  );
  text = max(text, bleed * 0.38);
  text *= 0.88 + 0.12 * grain;

  float glow = 0.0;
  for (int i = 0; i < 6; i++) {
    float angle = float(i) * 1.047;
    vec2 offset = vec2(cos(angle), sin(angle)) * 0.012;
    glow += texture2D(uText, clamp(textUv + offset, 0.0, 1.0)).a;
  }
  glow /= 6.0;

  float pinkTexture = 0.4 + 0.6 * noise(p * 11.0 + vec2(t * 0.3));
  float pinkFilament = smoothstep(
    0.38,
    0.64,
    fbm(vec2(p.x * 14.0 + t * 0.32, p.y * 7.0 - t * 0.18))
  );
  float pinkMask = clamp(
    pinkDye * 1.6 * pinkTexture * pinkFilament,
    0.0,
    1.0
  );

  vec2 texel = 1.0 / uResolution;
  float densityL =
    texture2D(uDye, clamp(uv - vec2(texel.x, 0.0), 0.0, 1.0)).r +
    texture2D(uDye, clamp(uv - vec2(texel.x, 0.0), 0.0, 1.0)).g;
  float densityR =
    texture2D(uDye, clamp(uv + vec2(texel.x, 0.0), 0.0, 1.0)).r +
    texture2D(uDye, clamp(uv + vec2(texel.x, 0.0), 0.0, 1.0)).g;
  float densityT =
    texture2D(uDye, clamp(uv + vec2(0.0, texel.y), 0.0, 1.0)).r +
    texture2D(uDye, clamp(uv + vec2(0.0, texel.y), 0.0, 1.0)).g;
  float densityB =
    texture2D(uDye, clamp(uv - vec2(0.0, texel.y), 0.0, 1.0)).r +
    texture2D(uDye, clamp(uv - vec2(0.0, texel.y), 0.0, 1.0)).g;
  vec2 gradient = vec2(densityR - densityL, densityT - densityB);

  float fine = fbm(
    vec2(p.x * 7.0 + q.y * 2.0 + t * 0.2, p.y * 16.0 - t * 0.35)
  );
  float waterMask = smoothstep(0.02, 0.15, density);
  float stream = fbm(
    vec2(p.x * 16.0 + t * 0.4, p.y * 6.0 - t * 0.7)
  );
  waterMask *= smoothstep(0.55, 0.7, stream);
  waterMask = pow(waterMask, 1.25);
  waterMask *= 0.58 + 0.42 * smoothstep(0.32, 0.68, fine);
  float rim = smoothstep(0.04, 0.16, density) *
    (1.0 - smoothstep(0.16, 0.38, density));
  float specular = pow(clamp(length(gradient) * 7.0, 0.0, 1.0), 1.6);
  float caustic = pow(
    abs(sin(p.x * 24.0 + fine * 5.0 + t * 1.4)),
    7.0
  ) * waterMask;

  vec3 teal = vec3(0.56, 0.98, 0.9);
  vec3 pink = vec3(0.74, 0.38, 0.82);
  vec3 purple = vec3(0.7, 0.42, 0.86);
  vec3 waterColor = mix(
    teal,
    pink,
    clamp(pinkDye * 1.05, 0.0, 1.0)
  );
  waterColor = mix(
    waterColor,
    purple,
    clamp(density * 0.12, 0.0, 0.2)
  );

  vec3 textColor = mix(
    teal,
    pink,
    clamp(pinkMask * (0.5 + 0.4 * inkNoise), 0.0, 1.0)
  );
  float stir = fbm(
    vec2(p.x * 7.0 + t * 0.24, p.y * 11.0 - t * 0.2)
  );
  textColor = mix(
    textColor,
    pink,
    clamp(textHole * 0.32, 0.0, 0.32)
  );
  textColor = mix(
    textColor,
    waterColor,
    clamp(scatter * 0.1, 0.0, 0.1)
  );
  textColor = mix(
    textColor,
    waterColor,
    clamp(stir * 0.14, 0.0, 0.14)
  );
  textColor *= 0.92 + 0.1 * stir;

  float textAlpha = clamp(
    text * (0.95 + 0.05 * flowInk),
    0.0,
    1.0
  );

  vec3 color = waterColor * waterMask * 0.16;
  color += vec3(0.7, 1.0, 0.98) * rim * 0.14;
  color += vec3(0.82, 1.0, 1.0) * specular * 0.08;
  color += teal * caustic * 0.08;
  color = mix(color, textColor, textAlpha);
  color += textColor * glow * 0.02;

  color += pink * pinkMask * 0.03;

  float vignette = smoothstep(
    1.05,
    0.25,
    length((uv - 0.5) * vec2(aspect.x, 1.0))
  );
  color *= mix(0.6, 1.0, vignette);

  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function FluidTitle({ lines, onClick }) {
  const canvasRef = useRef(null);
  const particleRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const particleCanvas = particleRef.current;
    if (!canvas || !particleCanvas) return undefined;
    const particleCtx = particleCanvas.getContext("2d");

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return undefined;

    const colorBufferFloat = gl.getExtension("EXT_color_buffer_float");
    if (!colorBufferFloat) {
      console.error("EXT_color_buffer_float not supported");
      return undefined;
    }

    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      FRAGMENT_SHADER,
    );
    if (!vertex || !fragment) return undefined;

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return undefined;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(
      positionLocation,
      2,
      gl.FLOAT,
      false,
      0,
      0,
    );

    const fluid = new GpuFluid(gl);
    const fluidWidth = fluid.width;
    const fluidHeight = fluid.height;

    const textTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const uText = gl.getUniformLocation(program, "uText");
    const uVelocity = gl.getUniformLocation(program, "uVelocity");
    const uDye = gl.getUniformLocation(program, "uDye");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uPointer = gl.getUniformLocation(program, "uPointer");
    const uBreak = gl.getUniformLocation(program, "uBreak");
    const uTime = gl.getUniformLocation(program, "uTime");

    gl.uniform1i(uText, 0);
    gl.uniform1i(uVelocity, 1);
    gl.uniform1i(uDye, 2);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.1);
    let width = 0;
    let height = 0;
    let frame = 0;
    let disposed = false;
    let textPoints = [];
    let particles = [];
    let pointerCss = { x: 0, y: 0 };
    let active = false;

    const makeParticleSprite = (rgb) => {
      const sprite = document.createElement("canvas");
      sprite.width = 32;
      sprite.height = 32;
      const ctx = sprite.getContext("2d");
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, `rgba(${rgb},0.95)`);
      gradient.addColorStop(0.45, `rgba(${rgb},0.45)`);
      gradient.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      return sprite;
    };

    const particleSprites = [
      makeParticleSprite("140, 238, 218"),
      makeParticleSprite("140, 238, 218"),
      makeParticleSprite("206, 132, 222"),
      makeParticleSprite("172, 120, 218"),
    ];

    const buildText = () => {
      const textCanvas = document.createElement("canvas");
      textCanvas.width = Math.floor(width * dpr);
      textCanvas.height = Math.floor(height * dpr);
      const ctx = textCanvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(dpr, dpr);
      const twoLines = lines.length > 1;
      const fontSize = twoLines
        ? Math.min(width * 0.185, height * 0.29)
        : Math.min(width * 0.205, height * 0.34);
      const lineHeight = fontSize * 0.82;
      const totalHeight = (lines.length - 1) * lineHeight;
      const startY = height / 2 - totalHeight / 2 + fontSize * 0.02;

      ctx.font = `900 ${fontSize}px "StudioPoppins", "Segoe UI Black", "Arial Black", "Helvetica Neue", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if ("letterSpacing" in ctx) {
        ctx.letterSpacing = `${-fontSize * 0.035}px`;
      }
      ctx.fillStyle = "#ffffff";

      lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, startY + index * lineHeight);
      });

      const image = ctx.getImageData(
        0,
        0,
        textCanvas.width,
        textCanvas.height,
      );
      const step = Math.max(2, Math.floor(dpr * 3));
      textPoints = [];
      for (let y = 0; y < textCanvas.height; y += step) {
        for (let x = 0; x < textCanvas.width; x += step) {
          const alpha = image.data[(y * textCanvas.width + x) * 4 + 3];
          if (alpha > 120) {
            textPoints.push({ x: x / dpr, y: y / dpr });
          }
        }
      }
      particles = [];

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textCanvas,
      );
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      particleCanvas.width = canvas.width;
      particleCanvas.height = canvas.height;
      particleCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, width, height);
      buildText();
    };

    const spawnParticles = (cx, cy) => {
      if (!active || textPoints.length === 0) return;

      for (let index = 0; index < 10; index += 1) {
        for (let attempt = 0; attempt < 24; attempt += 1) {
          const point =
            textPoints[Math.floor(Math.random() * textPoints.length)];
          const dx = point.x - cx;
          const dy = point.y - cy;
          const distance = Math.hypot(dx, dy);
          if (distance > 120) continue;

          const speed = 0.8 + Math.random() * 1.8;
          const sprite =
            particleSprites[
              Math.floor(Math.random() * particleSprites.length)
            ];
          particles.push({
            x: point.x,
            y: point.y,
            vx: (dx / (distance + 1)) * speed + (Math.random() - 0.5) * 0.9,
            vy: (dy / (distance + 1)) * speed - 0.4,
            size: 4.0 + Math.random() * 8.0,
            life: 1,
            decay: 0.006 + Math.random() * 0.007,
            sprite,
          });
          break;
        }
      }

      if (particles.length > 500) {
        particles.splice(0, particles.length - 500);
      }
    };

    const drawParticles = (now) => {
      particleCtx.clearRect(0, 0, width, height);
      particleCtx.globalCompositeOperation = "screen";

      for (const particle of particles) {
        particle.life -= particle.decay;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy -= 0.008;
        particle.vx += Math.sin(particle.y * 0.02 + now * 0.003) * 0.012;

        if (particle.life <= 0) continue;

        particleCtx.globalAlpha = Math.max(0, particle.life) * 0.9;
        particleCtx.drawImage(
          particle.sprite,
          particle.x - particle.size,
          particle.y - particle.size,
          particle.size * 2,
          particle.size * 2,
        );
      }

      particleCtx.globalAlpha = 1;
      particles = particles.filter((particle) => particle.life > 0);
    };

    const onPointerMove = (event) => {
      pointerCss = { x: event.clientX, y: event.clientY };
      active = true;
      fluid.pointer(event.clientX / width, 1 - event.clientY / height);
    };

    const onPointerLeave = () => {
      active = false;
      fluid.pointerLeave();
    };

    const render = (now) => {
      if (!disposed) {
        fluid.step(1 / 60);
        spawnParticles(pointerCss.x, pointerCss.y);
        drawParticles(now);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textTexture);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, fluid.velocity.read.texture);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, fluid.dye.read.texture);

        gl.uniform1f(uTime, now / 1000);
        gl.uniform2f(
          uPointer,
          fluid.pointerPos.x,
          fluid.pointerPos.y,
        );
        gl.uniform1f(uBreak, fluid.breakAmount);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(
          positionLocation,
          2,
          gl.FLOAT,
          false,
          0,
          0,
        );
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      frame = requestAnimationFrame(render);
    };

    resize();
    document.fonts
      .load('900 200px "StudioPoppins"')
      .then(() => {
        if (!disposed) buildText();
      })
      .catch(() => {});
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", onPointerLeave);
    frame = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(textTexture);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [lines]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={styles.fluidCanvas}
        onClick={onClick}
        aria-hidden="true"
      />
      <canvas
        ref={particleRef}
        className={styles.particleCanvas}
        aria-hidden="true"
      />
    </>
  );
}
