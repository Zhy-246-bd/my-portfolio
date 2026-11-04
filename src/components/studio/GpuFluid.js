const VERTEX = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const SPLAT_VELOCITY = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec2 uForce;
uniform float uRadius;
void main() {
  vec2 d = vUv - uPoint;
  float f = exp(-dot(d, d) / uRadius);
  vec4 base = texture2D(uTarget, vUv);
  gl_FragColor = vec4(base.xy + uForce * f, 0.0, 1.0);
}
`;

const SPLAT_DYE = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius;
void main() {
  vec2 d = vUv - uPoint;
  float f = exp(-dot(d, d) / uRadius);
  vec4 base = texture2D(uTarget, vUv);
  gl_FragColor = vec4(base.xyz + uColor * f, 1.0);
}
`;

const ADVECT = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform float uDt;
uniform float uDissipation;
void main() {
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  vec2 coord = vUv - uDt * velocity;
  gl_FragColor = texture2D(uSource, coord) * uDissipation;
}
`;

const CURL = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = texture2D(uVelocity, vUv - vec2(uTexel.x, 0.0)).y;
  float R = texture2D(uVelocity, vUv + vec2(uTexel.x, 0.0)).y;
  float T = texture2D(uVelocity, vUv + vec2(0.0, uTexel.y)).x;
  float B = texture2D(uVelocity, vUv - vec2(0.0, uTexel.y)).x;
  float value = 0.5 * (R - L - (T - B));
  gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
}
`;

const VORTICITY = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2 uTexel;
uniform float uDt;
uniform float uStrength;
void main() {
  float L = abs(texture2D(uCurl, vUv - vec2(uTexel.x, 0.0)).x);
  float R = abs(texture2D(uCurl, vUv + vec2(uTexel.x, 0.0)).x);
  float T = abs(texture2D(uCurl, vUv + vec2(0.0, uTexel.y)).x);
  float B = abs(texture2D(uCurl, vUv - vec2(0.0, uTexel.y)).x);
  float C = texture2D(uCurl, vUv).x;
  vec2 force = vec2(T - B, R - L);
  float len = length(force) + 0.0001;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity += (force / len) * C * uStrength * uDt;
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

const DIVERGENCE = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = texture2D(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture2D(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
  float T = texture2D(uVelocity, vUv + vec2(0.0, uTexel.y)).y;
  float B = texture2D(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
  float value = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
}
`;

const PRESSURE = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
void main() {
  float L = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float T = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  float B = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float divergence = texture2D(uDivergence, vUv).x;
  gl_FragColor = vec4((L + R + T + B - divergence) * 0.25, 0.0, 0.0, 1.0);
}
`;

const GRADIENT = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uPressure;
uniform vec2 uTexel;
void main() {
  float L = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float T = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  float B = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity -= 0.5 * vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

const WARP = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uWarp;
uniform sampler2D uVelocity;
uniform vec2 uPoint;
uniform vec2 uTexel;
uniform float uDt;
uniform float uStrength;
uniform float uRadius;
uniform float uDecay;
void main() {
  vec2 coord = vUv;
  vec2 prev = texture2D(uWarp, coord).xy * uDecay;

  vec2 L = texture2D(uWarp, coord - vec2(uTexel.x, 0.0)).xy;
  vec2 R = texture2D(uWarp, coord + vec2(uTexel.x, 0.0)).xy;
  vec2 T = texture2D(uWarp, coord + vec2(0.0, uTexel.y)).xy;
  vec2 B = texture2D(uWarp, coord - vec2(0.0, uTexel.y)).xy;
  vec2 average = (prev + L + R + T + B) * 0.2;
  prev = mix(prev, average, 0.24);

  vec2 d = vUv - uPoint;
  float f = exp(-dot(d, d) / uRadius);
  prev += d * f * uStrength;

  gl_FragColor = vec4(clamp(prev, vec2(-0.12), vec2(0.12)), 0.0, 1.0);
}
`;

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

export default class GpuFluid {
  constructor(gl, width = 320, height = 180) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.time = 0;
    this.pending = [];
    this.last = null;

    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);

    const makeProgram = (fragmentSource) => {
      const vertex = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertex, VERTEX);
      gl.compileShader(vertex);
      const fragment = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragment, fragmentSource);
      gl.compileShader(fragment);
      if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(fragment));
      }
      const program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      const uniforms = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i += 1) {
        const info = gl.getActiveUniform(program, i);
        uniforms[info.name] = gl.getUniformLocation(program, info.name);
      }
      return { program, uniforms };
    };

    this.splatVelocityProgram = makeProgram(SPLAT_VELOCITY);
    this.splatDyeProgram = makeProgram(SPLAT_DYE);
    this.advectProgram = makeProgram(ADVECT);
    this.curlProgram = makeProgram(CURL);
    this.vorticityProgram = makeProgram(VORTICITY);
    this.divergenceProgram = makeProgram(DIVERGENCE);
    this.pressureProgram = makeProgram(PRESSURE);
    this.gradientProgram = makeProgram(GRADIENT);
    this.warpProgram = makeProgram(WARP);

    const createFBO = (w, h) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA16F,
        w,
        h,
        0,
        gl.RGBA,
        gl.HALF_FLOAT,
        null,
      );
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0,
      );
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (status !== gl.FRAMEBUFFER_COMPLETE) {
        console.error("Fluid FBO incomplete", status);
      }
      return { texture, fbo, width: w, height: h };
    };

    const double = () => {
      const read = createFBO(width, height);
      const write = createFBO(width, height);
      return {
        read,
        write,
        swap() {
          const temp = this.read;
          this.read = this.write;
          this.write = temp;
        },
      };
    };

    this.velocity = double();
    this.dye = double();
    this.pressure = double();
    this.warp = double();
    this.divergence = createFBO(width, height);
    this.curl = createFBO(width, height);
    this.pointerPos = { x: 0.5, y: 0.5 };
    this.active = false;
    this.breakAmount = 0;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  bindTexture(texture, unit) {
    const { gl } = this;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
  }

  draw(target, program, setup) {
    const { gl } = this;
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    gl.viewport(0, 0, target.width, target.height);
    gl.useProgram(program.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    const location = gl.getAttribLocation(program.program, "aPosition");
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    setup(program.uniforms);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  splatVelocity(x, y, fx, fy, radius = 0.0009) {
    this.bindTexture(this.velocity.read.texture, 0);
    this.draw(this.velocity.write, this.splatVelocityProgram, (u) => {
      const { gl } = this;
      gl.uniform1i(u.uTarget, 0);
      gl.uniform2f(u.uPoint, x, y);
      gl.uniform2f(u.uForce, fx, fy);
      gl.uniform1f(u.uRadius, radius);
    });
    this.velocity.swap();
  }

  splatDye(x, y, color, radius = 0.0012) {
    this.bindTexture(this.dye.read.texture, 0);
    this.draw(this.dye.write, this.splatDyeProgram, (u) => {
      const { gl } = this;
      gl.uniform1i(u.uTarget, 0);
      gl.uniform2f(u.uPoint, x, y);
      gl.uniform3f(u.uColor, color[0], color[1], color[2]);
      gl.uniform1f(u.uRadius, radius);
    });
    this.dye.swap();
  }

  pointer(x, y) {
    this.active = true;
    this.pointerPos = { x, y };
    if (this.last) {
      const dx = x - this.last.x;
      const dy = y - this.last.y;
      if (Math.abs(dx) + Math.abs(dy) > 0.0005) {
        this.pending.push({ x, y, dx, dy });
      }
    }
    this.last = { x, y };
  }

  pointerLeave() {
    this.active = false;
    this.last = null;
  }

  updateWarp(dt) {
    const { gl } = this;
    this.bindTexture(this.warp.read.texture, 0);
    this.bindTexture(this.velocity.read.texture, 1);
    this.draw(this.warp.write, this.warpProgram, (u) => {
      gl.uniform1i(u.uWarp, 0);
      gl.uniform1i(u.uVelocity, 1);
      gl.uniform2f(u.uPoint, this.pointerPos.x, this.pointerPos.y);
      gl.uniform2f(u.uTexel, 1 / this.width, 1 / this.height);
      gl.uniform1f(u.uDt, dt);
      gl.uniform1f(u.uStrength, this.active ? 0.8 : 0);
      gl.uniform1f(u.uRadius, 0.0035);
      gl.uniform1f(u.uDecay, 0.982);
    });
    this.warp.swap();
  }

  step(dt) {
    const { gl } = this;
    this.time += dt;
    const t = this.time;

    for (const p of this.pending) {
      const forceX = p.dx * 18;
      const forceY = p.dy * 18;
      this.splatVelocity(p.x, p.y, forceX, forceY, 0.0015);
      this.splatDye(p.x, p.y, [0, 0.22, 0], 0.0015);
    }
    this.pending = [];

    if (this.active) {
      this.splatDye(
        this.pointerPos.x,
        this.pointerPos.y,
        [0, 0.006, 0],
        0.002,
      );
    }

    const texelX = 1 / this.width;
    const texelY = 1 / this.height;

    this.bindTexture(this.velocity.read.texture, 0);
    this.bindTexture(this.velocity.read.texture, 1);
    this.draw(this.velocity.write, this.advectProgram, (u) => {
      gl.uniform1i(u.uVelocity, 1);
      gl.uniform1i(u.uSource, 0);
      gl.uniform1f(u.uDt, dt);
      gl.uniform1f(u.uDissipation, 0.995);
    });
    this.velocity.swap();

    this.bindTexture(this.velocity.read.texture, 0);
    this.draw(this.curl, this.curlProgram, (u) => {
      gl.uniform1i(u.uVelocity, 0);
      gl.uniform2f(u.uTexel, texelX, texelY);
    });

    this.bindTexture(this.velocity.read.texture, 0);
    this.bindTexture(this.curl.texture, 1);
    this.draw(this.velocity.write, this.vorticityProgram, (u) => {
      gl.uniform1i(u.uVelocity, 0);
      gl.uniform1i(u.uCurl, 1);
      gl.uniform2f(u.uTexel, texelX, texelY);
      gl.uniform1f(u.uDt, dt);
      gl.uniform1f(u.uStrength, 18);
    });
    this.velocity.swap();

    this.bindTexture(this.velocity.read.texture, 0);
    this.draw(this.divergence, this.divergenceProgram, (u) => {
      gl.uniform1i(u.uVelocity, 0);
      gl.uniform2f(u.uTexel, texelX, texelY);
    });

    for (let i = 0; i < 20; i += 1) {
      this.bindTexture(this.pressure.read.texture, 0);
      this.bindTexture(this.divergence.texture, 1);
      this.draw(this.pressure.write, this.pressureProgram, (u) => {
        gl.uniform1i(u.uPressure, 0);
        gl.uniform1i(u.uDivergence, 1);
        gl.uniform2f(u.uTexel, texelX, texelY);
      });
      this.pressure.swap();
    }

    this.bindTexture(this.velocity.read.texture, 0);
    this.bindTexture(this.pressure.read.texture, 1);
    this.draw(this.velocity.write, this.gradientProgram, (u) => {
      gl.uniform1i(u.uVelocity, 0);
      gl.uniform1i(u.uPressure, 1);
      gl.uniform2f(u.uTexel, texelX, texelY);
    });
    this.velocity.swap();

    this.bindTexture(this.velocity.read.texture, 1);
    this.bindTexture(this.dye.read.texture, 0);
    this.draw(this.dye.write, this.advectProgram, (u) => {
      gl.uniform1i(u.uVelocity, 1);
      gl.uniform1i(u.uSource, 0);
      gl.uniform1f(u.uDt, dt);
      gl.uniform1f(u.uDissipation, 0.993);
    });
    this.dye.swap();

    if (this.active) {
      this.breakAmount = Math.min(1, this.breakAmount + 0.12);
    } else {
      this.breakAmount *= 0.962;
    }
  }
}
