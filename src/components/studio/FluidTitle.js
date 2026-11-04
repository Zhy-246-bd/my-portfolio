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

  vec2 displacement = velocity * 0.008 + (q - 0.5) * 0.012;
  vec2 uvShift = displacement;
  float shiftLength = length(uvShift);
  if (shiftLength > 0.03) {
    uvShift *= 0.03 / shiftLength;
  }

  vec2 textUv = clamp(uv + uvShift, vec2(0.0), vec2(1.0));
  float text = texture2D(uText, textUv).a;

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
    pinkDye * 1.35 * pinkTexture * pinkFilament,
    0.0,
    1.0
  );

  float smokeNoise = 0.55 + 0.45 * n2;
  float ribbon = fbm(
    vec2(p.x * 3.0 + q.y * 1.5, p.y * 8.0 - t * 0.22)
  );
  float wisp = smoothstep(0.32, 0.68, filament);
  float smoke = smoothstep(
    0.12,
    0.62,
    tealDye * 1.35 + ribbon * 0.2 + density * 0.08
  ) * smokeNoise * (0.4 + 0.6 * wisp);

  vec3 teal = vec3(0.56, 0.98, 0.9);
  vec3 pink = vec3(0.78, 0.4, 0.84);
  vec3 purple = vec3(0.7, 0.42, 0.86);

  vec3 inkColor = mix(
    teal,
    pink,
    clamp(pinkMask * (0.55 + 0.45 * inkNoise), 0.0, 1.0)
  );
  vec3 smokeColor = mix(
    teal,
    pink,
    clamp(pinkDye * 2.6 * pinkTexture, 0.0, 1.0)
  );
  smokeColor = mix(
    smokeColor,
    purple,
    clamp(density * 0.14, 0.0, 0.24)
  );

  vec3 textColor = mix(
    teal,
    pink,
    clamp(pinkMask * (0.45 + 0.35 * inkNoise), 0.0, 1.0)
  );
  float stir = fbm(
    vec2(p.x * 7.0 + t * 0.24, p.y * 11.0 - t * 0.2)
  );
  textColor = mix(
    textColor,
    smokeColor,
    clamp(stir * 0.18, 0.0, 0.18)
  );
  textColor *= 0.92 + 0.1 * stir;

  float textAlpha = clamp(
    text * (1.0 - smoke * 0.14) * (0.94 + 0.06 * flowInk),
    0.0,
    1.0
  );

  vec3 color = smokeColor * smoke * 0.58;
  color = mix(color, textColor, textAlpha);
  color += inkColor * glow * 0.03;

  float pinkHaze = clamp(pinkDye * 1.3, 0.0, 1.0);
  pinkHaze *= pinkFilament;
  color += pink * pinkHaze * 0.1;

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
    const uTime = gl.getUniformLocation(program, "uTime");

    gl.uniform1i(uText, 0);
    gl.uniform1i(uVelocity, 1);
    gl.uniform1i(uDye, 2);

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
      fluid.pointer(event.clientX / width, 1 - event.clientY / height);
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
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, fluid.velocity.read.texture);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, fluid.dye.read.texture);

        gl.uniform1f(uTime, now / 1000);
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
    <canvas
      ref={canvasRef}
      className={styles.fluidCanvas}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}
