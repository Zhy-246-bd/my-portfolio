"use client";

import { useEffect, useRef } from "react";
import FluidSim from "./FluidSim";
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
uniform sampler2D uFluid;
uniform vec2 uResolution;
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

  vec2 q = vec2(
    fbm(p * 1.4 + vec2(t * 0.02, 0.0)),
    fbm(p * 1.4 + vec2(4.7, -t * 0.015))
  );
  float n1 = fbm(p * 2.2 + q * 1.5 + vec2(t * 0.025, -t * 0.02));
  float n2 = fbm(p * 5.0 + q * 0.6 + vec2(-t * 0.03, t * 0.015));
  float streak = fbm(
    vec2(p.x * 3.0 + t * 0.08, p.y * 9.0 - t * 0.18)
  );
  float filament = fbm(
    vec2(p.x * 8.0 + q.y * 3.0, p.y * 3.0 - t * 0.3)
  );
  float field = n1 * 0.5 + n2 * 0.28 + streak * 0.12 + filament * 0.1;

  vec4 fluid = texture2D(uFluid, uv);
  float tealDye = fluid.r;
  float pinkDye = fluid.g;
  vec2 velocity = (fluid.ba - 0.5) * 2.0;

  float density = tealDye + pinkDye;
  float pinkDensity = pinkDye;
  vec2 displacement = velocity * 0.55 + (q - 0.5) * 0.22;

  vec2 uvShift = vec2(
    displacement.x / aspect.x,
    displacement.y
  ) * 0.03;
  float shiftLength = length(uvShift);
  if (shiftLength > 0.04) {
    uvShift *= 0.04 / shiftLength;
  }

  vec2 textUv = clamp(uv + uvShift, vec2(0.0), vec2(1.0));
  float text = texture2D(uText, textUv).a;

  vec2 flowDirection = normalize(q - vec2(0.5) + vec2(0.0001));
  float bleed = 0.0;
  bleed += texture2D(uText, clamp(textUv + flowDirection * 0.008, 0.0, 1.0)).a;
  bleed += texture2D(uText, clamp(textUv + flowDirection * 0.016, 0.0, 1.0)).a;
  bleed += texture2D(uText, clamp(textUv - flowDirection * 0.008, 0.0, 1.0)).a;
  bleed += texture2D(uText, clamp(textUv - flowDirection * 0.016, 0.0, 1.0)).a;
  bleed /= 4.0;

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
    fbm(textUv * 28.0 + vec2(t * 0.18, -t * 0.1))
  );
  text = smoothstep(
    0.12,
    0.82,
    text + (inkNoise - 0.5) * 0.22 + (flowInk - 0.5) * 0.08
  );
  text = max(text, bleed * 0.35);
  text *= 0.9 + 0.1 * grain;

  float glow = 0.0;
  for (int i = 0; i < 6; i++) {
    float angle = float(i) * 1.047;
    vec2 offset = vec2(cos(angle), sin(angle)) * 0.014;
    glow += texture2D(uText, clamp(textUv + offset, 0.0, 1.0)).a;
  }
  glow /= 6.0;

  float pinkTexture = 0.45 + 0.55 * noise(
    p * 10.0 + vec2(t * 0.25)
  );
  float pinkFilament = smoothstep(
    0.42,
    0.66,
    fbm(vec2(p.x * 13.0 + t * 0.28, p.y * 7.0 - t * 0.16))
  );
  float pinkMask = clamp(
    pinkDensity * 4.2 * pinkFilament,
    0.0,
    1.0
  );
  float smokeNoise = 0.55 + 0.45 * n2;
  float ribbon = fbm(
    vec2(p.x * 3.0 + q.y * 1.5, p.y * 8.0 - t * 0.22)
  );
  float wisp = smoothstep(0.32, 0.68, filament);
  float smoke = smoothstep(
    0.16,
    0.7,
    tealDye * 1.3 + field * 0.14 + density * 0.08
  ) * smokeNoise * (0.4 + 0.6 * wisp);

  vec3 teal = vec3(0.58, 0.99, 0.9);
  vec3 pink = vec3(1.0, 0.35, 0.62);
  vec3 purple = vec3(0.74, 0.45, 0.88);

  vec3 inkColor = mix(
    teal,
    pink,
    pinkMask * (0.55 + 0.45 * inkNoise)
  );
  vec3 smokeColor = mix(
    teal,
    pink,
    clamp(pinkDensity * 3.0 * pinkTexture, 0.0, 1.0)
  );
  smokeColor = mix(
    smokeColor,
    purple,
    clamp(density * 0.15, 0.0, 0.25)
  );

  vec3 textColor = mix(
    teal,
    pink,
    clamp(pinkMask * (0.55 + 0.5 * inkNoise), 0.0, 1.0)
  );
  float strand = fbm(
    vec2(p.x * 4.0 + t * 0.15, p.y * 18.0 - t * 0.1)
  );
  textColor = mix(
    textColor,
    inkColor,
    clamp(flowInk * 0.08, 0.0, 0.08)
  );
  textColor *= 0.96 + 0.04 * flowInk;

  float textAlpha = clamp(
    text *
      (1.0 - smoke * 0.1) *
      (0.96 + 0.04 * flowInk),
    0.0,
    1.0
  );
  vec3 color = smokeColor * smoke * 0.55;
  color = mix(color, textColor, textAlpha);
  color += inkColor * glow * 0.01;

  float pinkHaze = clamp(pinkDensity * 3.0, 0.0, 1.0);
  pinkHaze *= pinkFilament;
  color += pink * pinkHaze * 0.2;
  color = mix(color, smokeColor, smoke * 0.08);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return undefined;

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

    const textTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const fluid = new FluidSim();
    const fluidWidth = fluid.n;
    const fluidHeight = fluid.m;

    const fluidTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, fluidTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      fluidWidth,
      fluidHeight,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.activeTexture(gl.TEXTURE0);

    const uText = gl.getUniformLocation(program, "uText");
    const uFluid = gl.getUniformLocation(program, "uFluid");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");

    gl.uniform1i(uText, 0);
    gl.uniform1i(uFluid, 1);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.1);
    let width = 0;
    let height = 0;
    let frame = 0;
    let disposed = false;

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
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, width, height);
      buildText();
    };

    const onPointerMove = (event) => {
      const x = event.clientX / width;
      const y = 1 - event.clientY / height;
      fluid.pointer(x, y);
    };

    const render = (now) => {
      if (!disposed) {
        fluid.step(1 / 60);
        const pixels = fluid.getPixels();

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, fluidTexture);
        gl.texSubImage2D(
          gl.TEXTURE_2D,
          0,
          0,
          0,
          fluidWidth,
          fluidHeight,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          pixels,
        );
        gl.activeTexture(gl.TEXTURE0);

        gl.uniform1f(uTime, now / 1000);
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
    frame = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(textTexture);
      gl.deleteTexture(fluidTexture);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [lines]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.fluidCanvas}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}
