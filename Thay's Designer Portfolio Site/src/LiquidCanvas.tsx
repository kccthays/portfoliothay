import { useEffect, useRef } from 'react'

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`
const FRAG = `
precision highp float;
uniform vec2 r;uniform float t;uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;
  vec2 mu=(m-.5)*vec2(r.x/r.y,1.);
  float T=t*.07;
  vec2 q=vec2(fbm(uv*1.6+T),fbm(uv*1.6+vec2(5.2,1.3)-T));
  vec2 w=vec2(fbm(uv*1.4+3.*q+vec2(1.7,9.2)+T*1.5),fbm(uv*1.4+3.*q+vec2(8.3,2.8)-T*1.2));
  float d=length(uv-mu*vec2(1.,-1.)*.6);
  float f=fbm(uv*1.3+3.2*w+.35/(d+.6));
  float ridge=smoothstep(.0,1.,abs(sin(f*9.+t*.25)));
  vec3 c=vec3(.03,.02,.07);
  c=mix(c,vec3(.20,.06,.55),smoothstep(.2,.65,f));
  c=mix(c,vec3(.95,.25,.45),smoothstep(.5,.85,f)*.8);
  c=mix(c,vec3(1.,.72,.35),pow(smoothstep(.62,.95,f),2.)*.9);
  c+=vec3(.55,.8,1.)*pow(1.-ridge,14.)*.55*smoothstep(.3,.7,f);
  c+=vec3(.83,1.,.25)*pow(max(0.,1.-d*1.6),5.)*.18;
  float vig=smoothstep(1.4,.2,length(uv));
  c*=.35+.75*vig;
  gl_FragColor=vec4(pow(c,vec3(.95)),1.);
}`

export default function LiquidCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uR = gl.getUniformLocation(prog, 'r')
    const uT = gl.getUniformLocation(prog, 't')
    const uM = gl.getUniformLocation(prog, 'm')

    const scale = 0.5
    const resize = () => {
      canvas.width = Math.max(2, canvas.clientWidth * scale)
      canvas.height = Math.max(2, canvas.clientHeight * scale)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const target = { x: 0.5, y: 0.5 }
    const cur = { x: 0.5, y: 0.5 }
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth
      target.y = e.clientY / window.innerHeight
    }
    window.addEventListener('pointermove', onMove)

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)

    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const start = performance.now()
    const draw = () => {
      if (visible) {
        cur.x += (target.x - cur.x) * 0.04
        cur.y += (target.y - cur.y) * 0.04
        gl.uniform2f(uR, canvas.width, canvas.height)
        gl.uniform1f(uT, still ? 12 : (performance.now() - start) / 1000)
        gl.uniform2f(uM, cur.x, cur.y)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }
      if (!still) raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
}
