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
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uActive;
uniform float uCrisp;
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
  float textDye = smoothstep(0.12, 0.52, dye.r);
  vec2 soft = vec2(0.00065, 0.00065);
  float glyph = (
    texture2D(uText, uv + vec2(soft.x, 0.0)).a +
    texture2D(uText, uv - vec2(soft.x, 0.0)).a +
    texture2D(uText, uv + vec2(0.0, soft.y)).a +
    texture2D(uText, uv - vec2(0.0, soft.y)).a
  ) * 0.25;
  float text = mix(textDye, glyph, uCrisp);
  text *= 0.92 + 0.08 * grain;
  text = pow(text, 1.04);

  float rim = smoothstep(0.06, 0.2, density) *
    (1.0 - smoothstep(0.2, 0.48, density));
  float specular = pow(clamp(length(gradient) * 9.0, 0.0, 1.0), 1.5);
  float caustic = pow(
    abs(sin(uv.x * 28.0 + grain * 6.0 + t * 1.2)),
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
  ink = mix(ink, purple, clamp(density * 0.08, 0.0, 0.12));

  vec3 normal = normalize(
    vec3(-gradient.x * 16.0, -gradient.y * 16.0, 1.0)
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
    uv + vec2(0.004, -0.005)
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

  vec2 waterP = uv * aspect;
  float waterField = fbm(
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
    const fluid = new GpuFluid(
      gl,
      isFullPage || isBackdrop ? 384 : 512,
      isFullPage || isBackdrop ? 240 : 320,
    );

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
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uPointer = gl.getUniformLocation(program, "uPointer");
    const uActive = gl.getUniformLocation(program, "uActive");
    const uCrisp = gl.getUniformLocation(program, "uCrisp");
    const uTime = gl.getUniformLocation(program, "uTime");
    gl.uniform1i(uText, 0);
    gl.uniform1i(uDye, 2);
    gl.uniform1f(uCrisp, variant === "cover" ? 0 : 1);

    const dpr = isFullPage
      ? 1.25
      : isBackdrop
        ? 0.9
        : isModuleCanvas
          ? 1.25
          : Math.min(window.devicePixelRatio || 1, 1.1);
    const textDpr = isFullPage || isModuleCanvas ? 2 : dpr;
    let width = 0;
    let height = 0;
    let frame = 0;
    let disposed = false;
    let resizeFrame = 0;
    let resizeObserver = null;

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
        : isModule
          ? Math.min(width * 0.26, height * 0.62)
          : lines.length > 1
            ? Math.min(width * 0.16, height * 0.255)
            : Math.min(width * 0.205, height * 0.34);
      const lineHeight = fontSize * 0.82;
      const totalHeight = (lines.length - 1) * lineHeight;
      const startY = isFullModule
        ? Math.min(viewportHeight * 0.2, 230)
        : isModule
          ? height * 0.56
          : height / 2 - totalHeight / 2 + fontSize * 0.02;

      ctx.font = `900 ${fontSize}px "StudioPoppins", "Segoe UI Black", "Arial Black", "Helvetica Neue", sans-serif`;
      if (isModule && lines[0]) {
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
      fluid.pointer(
        (event.clientX - rect.left) / Math.max(1, rect.width),
        1 - (event.clientY - rect.top) / Math.max(1, rect.height),
      );
    };

    const onPointerLeave = () => {
      fluid.pointerLeave();
    };

    const render = (now) => {
      if (!disposed) {
        fluid.step(1 / 60);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textTexture);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, fluid.dye.read.texture);

        gl.uniform1f(uTime, now / 1000);
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
      gl.deleteBuffer(buffer);
      gl.deleteTexture(textTexture);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [lines, variant]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.fluidCanvas}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}
