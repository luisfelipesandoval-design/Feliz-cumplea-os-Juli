import React, { useEffect, useRef, useState } from 'react';

interface ParticleBackgroundProps {
  partyFactor: number; // 0 to 1 value determining party power
}

export default function ParticleBackground({ partyFactor }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const partyRef = useRef(0);

  // Sync props to ref for shader loop
  useEffect(() => {
    partyRef.current = partyFactor;
  }, [partyFactor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn("WebGL not supported, falling back to CSS gradients.");
      return;
    }

    const vertexShaderSrc = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSrc = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_party;

      void main() {
        vec2 uv = v_texCoord;
        // Immersive UI Space Colors: Dark obsidian base, rich purples, deep indigos, neon dust
        vec3 color1 = vec3(0.02, 0.01, 0.06);     // Dark cosmos base
        vec3 color2 = vec3(0.08, 0.05, 0.18);     // Deep purple fog
        vec3 color3 = vec3(0.24, 0.10, 0.45);     // Neon violet gas
        vec3 color4 = vec3(0.05, 0.32, 0.55);     // Stardust blue-cyan
        
        // Intensify color and add energy on u_party
        color1 = mix(color1, vec3(0.12, 0.04, 0.24), u_party);
        color2 = mix(color2, vec3(0.35, 0.12, 0.58), u_party);
        color3 = mix(color3, vec3(0.58, 0.15, 0.85), u_party);
        color4 = mix(color4, vec3(0.0, 0.8, 0.95), u_party);

        float speed = 0.25 + (u_party * 1.8);
        float noise = sin(uv.x * 2.2 + u_time * speed) * cos(uv.y * 2.2 + u_time * speed);
        noise += sin(uv.y * 3.5 - u_time * (speed + 0.15)) * cos(uv.x * 1.6 + u_time * (speed - 0.08));
        
        vec3 color = mix(color1, color2, sin(u_time * 0.12) * 0.5 + 0.5);
        color = mix(color, color3, noise * 0.5 + 0.5);
        color = mix(color, color4, sin(uv.x * 6.0 + u_time * 0.4) * 0.1 + 0.1);
        
        // Spotlight hover interaction
        float dist = distance(uv, u_mouse / u_resolution);
        color += vec3(0.12, 0.08, 0.25) * (1.0 - smoothstep(0.0, 0.45, dist));
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error("Shader compiles error:", glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const program = gl.createProgram();
    if (!program) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
    if (!vs || !fs) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const partyLoc = gl.getUniformLocation(program, 'u_party');

    let animationFrameId: number;
    let localParty = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.height - (e.clientY - rect.top);
      mouseRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = (time: number) => {
      gl.useProgram(program);
      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y);

      // Track and ease the party factor
      localParty = localParty * 0.95 + partyRef.current * 0.05;
      gl.uniform1f(partyLoc, Math.max(0.0, Math.min(1.0, localParty)));

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Floating balloons & emojis background structure
  const [decorations] = useState(() => 
    Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      emoji: ['🎈', '🍭', '✨', '🧁', '🍰', '🌸', '🎁', '💖'][i % 8],
      left: `${(i * 15 + 7) % 95}%`,
      delay: i * 0.8,
      duration: 12 + (i % 5) * 4,
      size: 24 + (i % 4) * 8, // size in px
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-2]">
      {/* WebGL gradient canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full block opacity-90 transition-opacity duration-1000"
      />
      
      {/* Decorative Floating Elements (React optimized fallback) */}
      <div className="absolute inset-0 w-full h-full">
        {decorations.map((dec) => (
          <div
            key={dec.id}
            className="absolute bottom-[-100px] animate-float opacity-30 select-none text-2xl"
            style={{
              left: dec.left,
              animationDelay: `${dec.delay}s`,
              animationDuration: `${dec.duration}s`,
              fontSize: `${dec.size}px`,
              animationIterationCount: 'infinite',
              transform: 'translateY(-120vh)',
              animationName: 'floatTransition',
            }}
          >
            {dec.emoji}
          </div>
        ))}
      </div>

      {/* Embedded inline CSS for background vertical rise to avoid blocking */}
      <style>{`
        @keyframes floatTransition {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.45;
          }
          90% {
            opacity: 0.45;
          }
          100% {
            transform: translateY(-130vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation-name: floatTransition;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
}
