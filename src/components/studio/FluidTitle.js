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
uniform sampler2D uDye;
uniform sampler2D uVelocity;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uActive;
uniform float uCrisp;
uniform vec3 uPaintCore;
uniform vec3 uPaintEdge;
uniform vec3 uPaintBase;
uniform float uTime;
uniform float uTitleScale;
uniform float uTitleOffset;
uniform float uTitleOpacity;
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
  float t = uTime;

  vec4 dye = texture2D(uDye, uv);
  float textDensity = dye.r;
  float pinkDye = dye.g;
  float density = textDensity + pinkDye;

  vec2 texel = 1.0 / uResolution;
  float left = texture2D(uDye, uv - vec2(texel.x, 0.0)).r;
  float right = texture2D(uDye, uv + vec2(texel.x, 0.0)).r;
  float top = texture2D(uDye, uv + vec2(0.0, texel.y)).r;
  float bottom = texture2D(uDye, uv - vec2(0.0, texel.y)).r;
  vec2 gradient = vec2(right - left, top - bottom);

  float grain = fbm(vec2(uv.x * 36.0, uv.y * 26.0 + t * 0.12));
  vec2 dyeTexel = texel * 1.0;
  vec2 titlePivot = vec2(0.5, 0.8);
  vec2 titleUv = clamp(
    (uv - titlePivot) / max(uTitleScale, 0.01) + titlePivot +
      vec2(0.0, uTitleOffset),
    vec2(0.0),
    vec2(1.0)
  );
  float dyeCenter = texture2D(uDye, titleUv).r;
  float dyeLeft = texture2D(uDye, titleUv - vec2(dyeTexel.x, 0.0)).r;
  float dyeRight = texture2D(uDye, titleUv + vec2(dyeTexel.x, 0.0)).r;
  float dyeTop = texture2D(uDye, titleUv + vec2(0.0, dyeTexel.y)).r;
  float dyeBottom = texture2D(uDye, titleUv - vec2(0.0, dyeTexel.y)).r;
  float dyeSoft = (
    dyeCenter * 2.0 + dyeLeft + dyeRight + dyeTop + dyeBottom
  ) / 6.0;
  vec2 titleGradient = vec2(
    dyeRight - dyeLeft,
    dyeTop - dyeBottom
  );
  float textDye = smoothstep(0.1, 0.52, dyeSoft);
  vec2 flowNoise = vec2(
    fbm(uv * 4.0 + vec2(t * 0.12, 0.0)) - 0.5,
    fbm(uv * 4.0 + vec2(5.2, -t * 0.1)) - 0.5
  );
  vec2 flowVelocity = texture2D(uVelocity, uv).xy;
  vec2 textUv = clamp(
    uv + (flowNoise * 0.012 + flowVelocity * 0.022) * uCrisp,
    vec2(0.0),
    vec2(1.0)
  );
  vec2 soft = vec2(0.00065, 0.00065);
  float glyph = (
    texture2D(uText, textUv + vec2(soft.x, 0.0)).a +
    texture2D(uText, textUv - vec2(soft.x, 0.0)).a +
    texture2D(uText, textUv + vec2(0.0, soft.y)).a +
    texture2D(uText, textUv - vec2(0.0, soft.y)).a
  ) * 0.25;
  float text = mix(textDye, glyph, uCrisp);
  text *= uTitleOpacity;
  text *= 0.92 + 0.08 * grain;
  text = pow(text, 1.04);

  float rim = smoothstep(0.06, 0.2, dyeSoft) *
    (1.0 - smoothstep(0.2, 0.48, dyeSoft));
  float specular = pow(
    clamp(length(titleGradient) * 9.0, 0.0, 1.0),
    1.5
  );
  float caustic = pow(
    abs(sin(titleUv.x * 28.0 + grain * 6.0 + t * 1.2)),
    8.0
  ) * text;

  vec3 teal = vec3(0.55, 0.98, 0.9);
  vec3 pink = vec3(0.74, 0.38, 0.82);
  vec3 purple = vec3(0.68, 0.4, 0.84);

  vec3 ink = mix(
    teal,
    pink,
    clamp(pinkDye * 0.1, 0.0, 1.0)
  );
  ink = mix(ink, purple, clamp(dyeSoft * 0.08, 0.0, 0.12));

  vec3 normal = normalize(
    vec3(-titleGradient.x * 16.0, -titleGradient.y * 16.0, 1.0)
  );
  vec3 lightDirection = normalize(vec3(-0.45, 0.65, 0.8));
  vec3 halfDirection = normalize(lightDirection + vec3(0.0, 0.0, 1.0));
  float diffuse = clamp(dot(normal, lightDirection), 0.0, 1.0);
  float gloss = pow(clamp(dot(normal, halfDirection), 0.0, 1.0), 22.0);

  vec3 textColor = ink * (0.52 + 0.54 * diffuse);
  textColor += vec3(0.8, 1.0, 1.0) * gloss * 0.38;
  textColor = mix(textColor, ink * 0.94, uCrisp);

  vec3 color = textColor * text * 0.9;

  float shadowDensity = texture2D(
    uDye,
    titleUv + vec2(0.004, -0.005)
  ).r;
  float occlusion = smoothstep(0.08, 0.4, shadowDensity) * (1.0 - text);
  color *= 1.0 - occlusion * 0.55;

  color += vec3(0.7, 1.0, 0.98) * rim * 0.24 * text;
  color += vec3(0.82, 1.0, 1.0) * specular * 0.1 * text;
  color += teal * caustic * 0.12;
  color += pink * clamp(pinkDye * 1.2, 0.0, 1.0) * 0.02;

  float pinkInk = smoothstep(0.06, 0.4, pinkDye);
  float pinkPatch = fbm(uv * 34.0 + vec2(uTime * 0.35, 0.0));
  pinkInk *= 0.45 + 0.55 * smoothstep(0.32, 0.7, pinkPatch);
  float pinkLeft = texture2D(uDye, uv - vec2(texel.x, 0.0)).g;
  float pinkRight = texture2D(uDye, uv + vec2(texel.x, 0.0)).g;
  float pinkTop = texture2D(uDye, uv + vec2(0.0, texel.y)).g;
  float pinkBottom = texture2D(uDye, uv - vec2(0.0, texel.y)).g;
  vec2 pinkGradient = vec2(
    pinkRight - pinkLeft,
    pinkTop - pinkBottom
  );
  float pinkRim = smoothstep(0.02, 0.1, pinkDye) *
    (1.0 - smoothstep(0.1, 0.28, pinkDye));
  float pinkGloss = pow(
    clamp(length(pinkGradient) * 12.0, 0.0, 1.0),
    1.5
  );

  vec3 pinkInkColor = mix(
    vec3(0.78, 0.26, 0.92),
    vec3(1.0, 0.45, 1.0),
    0.6
  );
  color += pinkInkColor * pinkInk * 0.55;
  color += pink * pinkRim * 0.2;
  color += vec3(0.92, 0.72, 1.0) * pinkGloss * 0.12;

  float paintDye = dye.b;
  float paint = smoothstep(0.025, 0.45, paintDye);
  float paintRim = smoothstep(0.03, 0.13, paintDye) *
    (1.0 - smoothstep(0.13, 0.42, paintDye));
  float paintBreakup = fbm(uv * 18.0 + vec2(uTime * 0.26, 0.0));
  paint *= 0.62 + 0.38 * smoothstep(0.28, 0.76, paintBreakup);
  vec3 cream = uPaintCore;
  vec3 gold = uPaintEdge;
  vec3 paintColor = mix(
    uPaintBase,
    cream,
    clamp(paintDye * 2.6, 0.0, 1.0)
  );
  float greenMix = smoothstep(0.04, 0.34, dye.r) * 0.55;
  paintColor = mix(paintColor, vec3(0.2, 0.76, 0.62), greenMix);
  color += paintColor * paint * 0.95;
  color += cream * paintRim * 0.5;
  color += gold * clamp(paintDye * 0.9, 0.0, 1.0) * 0.22;

  vec2 waterP = uv * aspect;
  float waterField = noise(
    waterP * 2.6 + vec2(uTime * 0.035, -uTime * 0.028)
  );
  float rippleA = pow(
    0.5 + 0.5 * sin(waterP.y * 23.0 + waterField * 7.0 + uTime * 0.45),
    10.0
  );
  float rippleB = pow(
    0.5 + 0.5 * sin(waterP.x * 17.0 - waterField * 6.0 - uTime * 0.32),
    12.0
  );
  float waterLines = (rippleA + rippleB) * 0.5;
  color += teal * waterLines * 0.012;
  color += vec3(0.55, 0.95, 0.88) * (waterField - 0.5) * 0.008;

  float vignette = smoothstep(
    1.05,
    0.25,
    length((uv - 0.5) * vec2(aspect.x, 1.0))
  );
  color *= mix(0.65, 1.0, vignette);

  gl_FragColor = vec4(color, 1.0);
}
`;

const PAINT_PALETTES = [
  { core: [1.0, 0.94, 0.62], edge: [1.0, 0.78, 0.18], base: [0.14, 0.55, 0.48] },
  { core: [0.62, 0.96, 0.98], edge: [0.18, 0.62, 0.9], base: [0.08, 0.38, 0.52] },
  { core: [1.0, 0.64, 0.74], edge: [0.9, 0.24, 0.42], base: [0.42, 0.14, 0.28] },
  { core: [0.84, 0.68, 1.0], edge: [0.5, 0.3, 0.9], base: [0.24, 0.16, 0.5] },
  { core: [0.76, 1.0, 0.62], edge: [0.35, 0.8, 0.3], base: [0.15, 0.4, 0.2] },
  { core: [1.0, 0.84, 0.42], edge: [1.0, 0.58, 0.08], base: [0.42, 0.2, 0.05] },
  { core: [0.78, 0.9, 1.0], edge: [0.3, 0.5, 0.95], base: [0.16, 0.3, 0.55] },
];

const FXAA_SHADER = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uScene;
uniform vec2 uTexel;

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec3 center = texture2D(uScene, vUv).rgb;
  vec3 nw = texture2D(uScene, vUv + vec2(-uTexel.x, -uTexel.y)).rgb;
  vec3 ne = texture2D(uScene, vUv + vec2(uTexel.x, -uTexel.y)).rgb;
  vec3 sw = texture2D(uScene, vUv + vec2(-uTexel.x, uTexel.y)).rgb;
  vec3 se = texture2D(uScene, vUv + vec2(uTexel.x, uTexel.y)).rgb;

  float lCenter = luma(center);
  float lNW = luma(nw);
  float lNE = luma(ne);
  float lSW = luma(sw);
  float lSE = luma(se);

  float lMin = min(lCenter, min(min(lNW, lNE), min(lSW, lSE)));
  float lMax = max(lCenter, max(max(lNW, lNE), max(lSW, lSE)));
  if (lMax - lMin < 0.055) {
    gl_FragColor = vec4(center, 1.0);
    return;
  }

  vec2 dir = vec2(
    -((lNW + lNE) - (lSW + lSE)),
    (lNW + lSW) - (lNE + lSE)
  );
  float reduce = max((lNW + lNE + lSW + lSE) * 0.0078125, 0.0078125);
  float rcp = 1.0 / (min(abs(dir.x), abs(dir.y)) + reduce);
  dir = clamp(dir * rcp, -8.0, 8.0) * uTexel;

  vec3 resultA = 0.5 * (
    texture2D(uScene, vUv + dir * (1.0 / 3.0 - 0.5)).rgb +
    texture2D(uScene, vUv + dir * (2.0 / 3.0 - 0.5)).rgb
  );
  vec3 resultB = resultA * 0.5 + 0.25 * (
    texture2D(uScene, vUv + dir * -0.5).rgb +
    texture2D(uScene, vUv + dir * 0.5).rgb
  );

  float lB = luma(resultB);
  gl_FragColor = vec4(
    (lB < lMin || lB > lMax) ? resultA : resultB,
    1.0
  );
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

export default function FluidTitle({
  lines,
  onClick,
  variant = "cover",
  titleScale = 1,
  titleY,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return undefined;

    if (!gl.getExtension("EXT_color_buffer_float")) {
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

    const fxaaFragment = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      FXAA_SHADER,
    );
    if (!fxaaFragment) return undefined;
    const fxaaProgram = gl.createProgram();
    gl.attachShader(fxaaProgram, vertex);
    gl.attachShader(fxaaProgram, fxaaFragment);
    gl.linkProgram(fxaaProgram);
    if (!gl.getProgramParameter(fxaaProgram, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(fxaaProgram));
      return undefined;
    }
    const uScene = gl.getUniformLocation(fxaaProgram, "uScene");
    const uTexel = gl.getUniformLocation(fxaaProgram, "uTexel");
    const fxaaPosition = gl.getAttribLocation(fxaaProgram, "aPosition");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const isFullPage = variant === "moduleFull";
    const isBackdrop = variant === "backdrop";
    const isModuleCanvas = variant === "module";
    const isModuleStage = variant === "moduleStage";
    let scrollProgress = 0;
    const updateTitleScroll = () => {
      if (!isModuleStage) return;
      const range = Math.max(1, window.innerHeight * 0.38);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / range));
    };
    if (isModuleStage) {
      updateTitleScroll();
      window.addEventListener("scroll", updateTitleScroll, { passive: true });
    }
    const fluid = new GpuFluid(
      gl,
      isBackdrop ? 256 : isModuleStage ? 448 : 448,
      isBackdrop ? 160 : isModuleStage ? 280 : 280,
    );
    fluid.setAutoInk(
      variant === "cover" || isBackdrop || isModuleStage,
    );

    if (variant === "cover" || isModuleStage) {
      window.__studioFluid = fluid;
    }

    const textTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    fluid.setTextTexture(textTexture);

    const uText = gl.getUniformLocation(program, "uText");
    const uDye = gl.getUniformLocation(program, "uDye");
    const uVelocity = gl.getUniformLocation(program, "uVelocity");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uPointer = gl.getUniformLocation(program, "uPointer");
    const uActive = gl.getUniformLocation(program, "uActive");
    const uCrisp = gl.getUniformLocation(program, "uCrisp");
    const uPaintCore = gl.getUniformLocation(program, "uPaintCore");
    const uPaintEdge = gl.getUniformLocation(program, "uPaintEdge");
    const uPaintBase = gl.getUniformLocation(program, "uPaintBase");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uTitleScale = gl.getUniformLocation(program, "uTitleScale");
    const uTitleOffset = gl.getUniformLocation(program, "uTitleOffset");
    const uTitleOpacity = gl.getUniformLocation(program, "uTitleOpacity");
    gl.uniform1i(uText, 0);
    gl.uniform1i(uVelocity, 1);
    gl.uniform1i(uDye, 2);
    gl.uniform1f(uCrisp, variant === "moduleFull" ? 1 : 0);
    gl.uniform1f(uTitleScale, 1);
    gl.uniform1f(uTitleOffset, 0);
    gl.uniform1f(uTitleOpacity, 1);

    const dpr = isFullPage
      ? 1
      : isBackdrop
        ? 0.65
        : isModuleStage
          ? 0.8
          : isModuleCanvas
            ? 1.05
            : Math.min(window.devicePixelRatio || 1, 0.9);
    const textDpr =
      isFullPage || isModuleCanvas || isModuleStage ? 2 : dpr;
    let width = 0;
    let height = 0;
    let frame = 0;
    let disposed = false;
    let resizeFrame = 0;
    let resizeObserver = null;
    let sceneFBO = null;
    let sceneTexture = null;

    const buildText = () => {
      const textCanvas = document.createElement("canvas");
      textCanvas.width = Math.floor(width * textDpr);
      textCanvas.height = Math.floor(height * textDpr);
      const ctx = textCanvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(textDpr, textDpr);
      const isModule = variant === "module" || variant === "moduleFull";
      const isFullModule = variant === "moduleFull";
      const viewportHeight =
        typeof window === "undefined" ? height : window.innerHeight;
      let fontSize = isFullModule
        ? Math.min(width * 0.24, viewportHeight * 0.24)
        : isModuleStage
          ? Math.min(width * 0.26, viewportHeight * 0.22)
          : isModule
            ? Math.min(width * 0.26, height * 0.62)
            : lines.length > 1
              ? Math.min(width * 0.16, height * 0.255)
              : Math.min(width * 0.205, height * 0.34);
      if (isModuleStage) fontSize *= titleScale;
      const lineHeight = fontSize * 0.82;
      const totalHeight = (lines.length - 1) * lineHeight;
      const startY = isFullModule
        ? Math.min(viewportHeight * 0.2, 230)
        : isModuleStage
          ? titleY != null
            ? viewportHeight * titleY
            : Math.min(viewportHeight * 0.2, 230)
          : isModule
            ? height * 0.56
            : height / 2 - totalHeight / 2 + fontSize * 0.02;

      ctx.font = `900 ${fontSize}px "StudioPoppins", "Segoe UI Black", "Arial Black", "Helvetica Neue", sans-serif`;
      if ((isModule || isModuleStage) && lines[0]) {
        const measured = ctx.measureText(lines[0]).width;
        const available = width * 0.9;
        if (measured > available) {
          fontSize *= available / measured;
        }
      }
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
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);
      if (nextWidth < 20 || nextHeight < 20) return;
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, width, height);
      buildText();
    };

    const scheduleResize = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
      });
    };

    const parent = canvas.parentElement;
    if (parent && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(scheduleResize);
      resizeObserver.observe(parent);
    }

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const useViewport = variant === "module";
      const pointerX = useViewport
        ? event.clientX / Math.max(1, window.innerWidth)
        : (event.clientX - rect.left) / Math.max(1, rect.width);
      const pointerY = useViewport
        ? 1 - event.clientY / Math.max(1, window.innerHeight)
        : 1 - (event.clientY - rect.top) / Math.max(1, rect.height);
      fluid.pointer(pointerX, pointerY);
    };

    const onPointerLeave = () => {
      fluid.pointerLeave();
    };

    let lastFrameDraw = 0;

    const render = (now) => {
      if (!disposed) {
        const slowStage = isModuleStage && scrollProgress > 0.82;
        const minInterval = isBackdrop
          ? 33
          : isModuleStage
            ? slowStage
              ? 42
              : 22
            : 0;
        if (minInterval && now - lastFrameDraw < minInterval) {
          frame = requestAnimationFrame(render);
          return;
        }
        lastFrameDraw = now;
        fluid.step(1 / 60);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textTexture);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, fluid.velocity.read.texture);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, fluid.dye.read.texture);

        const seconds = now / 1000;
        const paletteIndex =
          Math.floor(seconds / 7) % PAINT_PALETTES.length;
        const nextPaletteIndex =
          (paletteIndex + 1) % PAINT_PALETTES.length;
        const local = seconds % 7;
        let blend = 0;
        if (local > 6.2) {
          const progress = (local - 6.2) / 0.8;
          blend = progress * progress * (3 - 2 * progress);
        }
        const from = PAINT_PALETTES[paletteIndex];
        const to = PAINT_PALETTES[nextPaletteIndex];
        const mix = (a, b) => a + (b - a) * blend;
        const core = from.core.map((value, index) =>
          mix(value, to.core[index]),
        );
        const edge = from.edge.map((value, index) =>
          mix(value, to.edge[index]),
        );
        const base = from.base.map((value, index) =>
          mix(value, to.base[index]),
        );
        gl.uniform3fv(uPaintCore, core);
        gl.uniform3fv(uPaintEdge, edge);
        gl.uniform3fv(uPaintBase, base);
        gl.uniform1f(uTime, now / 1000);
        const titleProgress = isModuleStage ? scrollProgress : 0;
        gl.uniform1f(uTitleScale, 1 - 0.52 * titleProgress);
        gl.uniform1f(uTitleOffset, -0.18 * titleProgress);
        gl.uniform1f(
          uTitleOpacity,
          Math.max(0, 1 - 1.08 * titleProgress),
        );
        gl.uniform2f(
          uPointer,
          fluid.pointerPos.x,
          fluid.pointerPos.y,
        );
        gl.uniform1f(uActive, fluid.active ? 1 : 0);
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
    window.addEventListener("resize", scheduleResize);
    window.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", onPointerLeave);
    frame = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", updateTitleScroll);
      if (
        (variant === "cover" || isModuleStage) &&
        window.__studioFluid === fluid
      ) {
        window.__studioFluid = null;
      }
      gl.deleteBuffer(buffer);
      gl.deleteTexture(textTexture);
      if (sceneTexture) gl.deleteTexture(sceneTexture);
      if (sceneFBO) gl.deleteFramebuffer(sceneFBO);
      gl.deleteProgram(program);
      gl.deleteProgram(fxaaProgram);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteShader(fxaaFragment);
    };
  }, [lines, variant, titleScale, titleY]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.fluidCanvas}
      style={variant === "backdrop" ? undefined : { filter: "blur(0.7px)" }}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}
