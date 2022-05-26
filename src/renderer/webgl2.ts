import { Renderer, Size } from "../components"
import { ECS, Entity } from "../ecs"

class DefaultProgram {
    resolutionLocation: WebGLUniformLocation

    constructor(gl: WebGL2RenderingContext) {
        const vertexShaderSource = `#version 300 es
  uniform vec2 u_resolution;

  in vec2 a_position;
  in vec2 a_texCoord;
  in vec4 a_color;

  out vec2 v_texCoord;
  out vec4 v_color;

  void main() {
    vec2 zeroToOne = a_position.xy / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texCoord = a_texCoord;
    v_color = a_color;
  }
  `

        const fragmentShaderSource = `#version 300 es
  precision highp float;

  uniform sampler2D u_image;

  in vec2 v_texCoord;
  in vec4 v_color;

  out vec4 fragColor;
  
  vec4 hslToRgb(in vec4 hsl) {
    float h = hsl.x / 360.0;
    vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return vec4(hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0)), hsl.w);
  }

  void main() {
    ivec2 size = textureSize(u_image, 0);
    vec2 coord = v_texCoord / vec2(float(size.x), float(size.y));
    fragColor = texture(u_image, coord) * hslToRgb(v_color);
  }
  `

        const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
        gl.shaderSource(vertexShader, vertexShaderSource)
        gl.compileShader(vertexShader)

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
        gl.shaderSource(fragmentShader, fragmentShaderSource)
        gl.compileShader(fragmentShader)

        const program = gl.createProgram()!
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log(gl.getShaderInfoLog(vertexShader))
            console.log(gl.getShaderInfoLog(fragmentShader))
        }

        gl.useProgram(program)

        const vertexArrayObject = gl.createVertexArray()!
        gl.bindVertexArray(vertexArrayObject)

        const positionBuffer = gl.createBuffer()!
        const aPositionLocation = gl.getAttribLocation(program, 'a_position')
        gl.enableVertexAttribArray(aPositionLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.vertexAttribPointer(
            aPositionLocation,
        /*size*/2,
        /*type*/gl.FLOAT,
        /*normalize*/false,
        /*stride*/0,
        /*offset*/0
        )

        const texCoordBuffer = gl.createBuffer()!
        const aTexCoordLocation = gl.getAttribLocation(program, 'a_texCoord')
        gl.enableVertexAttribArray(aTexCoordLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
        gl.vertexAttribPointer(
            aTexCoordLocation,
        /*size*/2,
        /*type*/gl.FLOAT,
        /*normalize*/false,
        /*stride*/0,
        /*offset*/0
        )

        const colorBuffer = gl.createBuffer()!
        const aColorLocation = gl.getAttribLocation(program, 'a_color')
        gl.enableVertexAttribArray(aColorLocation)
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
        gl.vertexAttribPointer(
            aColorLocation,
        /*size*/4,
        /*type*/gl.FLOAT,
        /*normalize*/false,
        /*stride*/0,
        /*offset*/0
        )
        const indexBuffer = gl.createBuffer()!
        const imageLocation = gl.getUniformLocation(program, 'u_image')!
        this.resolutionLocation = gl.getUniformLocation(program, 'u_resolution')!
    }
}

const setSize = (entity: Entity, size: Size) => {
    const { width, height } = size
    const gl = entity.get(WebGL2RenderingContext)!
    entity.update(HTMLCanvasElement, canvas => {
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
    })
    const program = entity.get(DefaultProgram)!
    gl.uniform2f(program.resolutionLocation, width, height)
    gl.viewport(0, 0, width, height)
    entity.set(size)
}

const getSize = (entity: Entity) => entity.get(Size)!

const clear = (entity: Entity) => {
    const gl = entity.get(WebGL2RenderingContext)!
    gl.clear(gl.COLOR_BUFFER_BIT)
}

export const webgl2 = (ecs: ECS, width: number, height: number) => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')!
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    const entity = ecs.entity(gl, canvas, new DefaultProgram(gl))
    setSize(entity, new Size(width, height))
    ecs.set(new Renderer(entity, { setSize, getSize, clear }))
    return entity
}