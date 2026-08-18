import { FRAG, VERT } from './shaders'

export type GlassSource = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement

export interface GlassRendererOptions {
  refraction: number
  tint: [number, number, number]
  tintAmount: number
  clear: boolean
  reduceMotion: boolean
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('WebGL shader alloc failed')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(log || 'Shader compile failed')
  }
  return shader
}

export function parseCssColor(input: string): [number, number, number] {
  const el = document.createElement('span')
  el.style.color = input
  document.body.appendChild(el)
  const computed = getComputedStyle(el).color
  document.body.removeChild(el)
  const m = computed.match(/[\d.]+/g)
  if (!m) return [1, 1, 1]
  return [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255]
}

export class LiquidGlassRenderer {
  private gl: WebGL2RenderingContext
  private program: WebGLProgram
  private vao: WebGLVertexArrayObject
  private texture: WebGLTexture
  private loc: Record<string, WebGLUniformLocation | null>
  private hasTexture = 0
  private pointer: [number, number] = [0.35, 0.2]
  private source: GlassSource | null = null
  private destroyed = false

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    })
    if (!gl) throw new Error('WebGL2 unavailable')
    this.gl = gl

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    const program = gl.createProgram()
    if (!program) throw new Error('WebGL program alloc failed')
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.bindAttribLocation(program, 0, 'aPos')
    gl.linkProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Program link failed')
    }
    this.program = program

    const vao = gl.createVertexArray()
    const buf = gl.createBuffer()
    if (!vao || !buf) throw new Error('WebGL buffer alloc failed')
    gl.bindVertexArray(vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    this.vao = vao

    const texture = gl.createTexture()
    if (!texture) throw new Error('WebGL texture alloc failed')
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    this.texture = texture

    const names = [
      'uTexture',
      'uHasTexture',
      'uResolution',
      'uPointer',
      'uRadius',
      'uRefraction',
      'uDispersion',
      'uTint',
      'uTintAmount',
      'uClear',
      'uReduceMotion',
    ]
    this.loc = {}
    for (const name of names) this.loc[name] = gl.getUniformLocation(program, name)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  }

  get isLive() {
    return this.source instanceof HTMLVideoElement
  }

  setPointer(x: number, y: number) {
    this.pointer = [x, y]
  }

  setSource(source: GlassSource | null) {
    this.source = source
    this.hasTexture = source ? 1 : 0
  }

  private uploadTexture() {
    const { gl, source } = this
    if (!source) return
    if (source instanceof HTMLImageElement && (!source.complete || source.naturalWidth === 0)) return
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(1, Math.floor(this.canvas.clientWidth * dpr))
    const h = Math.max(1, Math.floor(this.canvas.clientHeight * dpr))
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w
      this.canvas.height = h
    }
    this.gl.viewport(0, 0, w, h)
  }

  render(opts: GlassRendererOptions) {
    if (this.destroyed) return
    const gl = this.gl
    this.uploadTexture()
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(this.program)
    gl.bindVertexArray(this.vao)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.uniform1i(this.loc.uTexture, 0)
    gl.uniform1f(this.loc.uHasTexture, this.hasTexture)
    gl.uniform2f(this.loc.uResolution, this.canvas.width, this.canvas.height)
    gl.uniform2f(this.loc.uPointer, this.pointer[0], this.pointer[1])
    const radius = Math.min(this.canvas.width, this.canvas.height) * 0.22
    gl.uniform1f(this.loc.uRadius, radius)
    gl.uniform1f(this.loc.uRefraction, opts.refraction)
    gl.uniform1f(this.loc.uDispersion, 0.35)
    gl.uniform3f(this.loc.uTint, opts.tint[0], opts.tint[1], opts.tint[2])
    gl.uniform1f(this.loc.uTintAmount, opts.tintAmount)
    gl.uniform1f(this.loc.uClear, opts.clear ? 1 : 0)
    gl.uniform1f(this.loc.uReduceMotion, opts.reduceMotion ? 1 : 0)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  destroy() {
    this.destroyed = true
    const gl = this.gl
    gl.deleteTexture(this.texture)
    gl.deleteVertexArray(this.vao)
    gl.deleteProgram(this.program)
  }
}
