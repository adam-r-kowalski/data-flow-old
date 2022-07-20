import { container, scene, geometry, layout } from '../../src/ui'
import { initCameraStack } from '../../src/ui/camera_stack'
import { identity, translate } from "../../src/linear_algebra/matrix3x3"
import { mockDocument, mockWindow } from "../../src/ui/mock"
import { WebGL2Renderer, webGL2Renderer } from "../../src/ui/webgl2"
import { reduce } from '../../src/ui/reduce'
import * as reducer from '../../src/ui/reducer'
import { batchGeometry, cubicBezier } from "../../src/ui/batch_geometry"
import { render } from '../../src/ui/render'

const red = { red: 255, green: 0, blue: 0, alpha: 255 }
const green = { red: 0, green: 255, blue: 0, alpha: 255 }
const white = { red: 255, green: 255, blue: 255, alpha: 255 }


const mockRenderer = <T>() => webGL2Renderer<T>({
    width: 500,
    height: 500,
    document: mockDocument(),
    window: mockWindow()
}) as WebGL2Renderer<T>

test("connection in scene", () => {
    const renderer = mockRenderer()
    const ui = scene({
        camera: identity(),
        children: [
            container({
                id: 'a',
                x: 100,
                y: 100,
                width: 50,
                height: 50,
                color: red
            }),
            container({
                id: 'b',
                x: 300,
                y: 300,
                width: 50,
                height: 50,
                color: green
            })
        ],
        connections: [
            { from: 'a', to: 'b', color: white }
        ]
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const { idToWorldSpace, connections } = reduce(ui, uiLayout, uiGeometry, reducer)
    expect(idToWorldSpace).toEqual({
        'a': { x0: 100, y0: 100, x1: 150, y1: 150 },
        'b': { x0: 300, y0: 300, x1: 350, y1: 350 },
    })
    expect(connections).toEqual([[{ connections: [{ from: 'a', to: 'b', color: white }], scale: 1 }]])
})


test("cubic bezier", () => {
    const ts = [0, 0.25, 0.5, 0.75, 1.0]
    const offset = 50
    const from = {
        x0: 0,
        y0: 0,
        x1: 50,
        y1: 50,
    }
    const to = {
        x0: 100,
        y0: 100,
        x1: 150,
        y1: 150,
    }
    const points = Array.from(cubicBezier(ts, from, to, offset))
    expect(points).toEqual([
        25, 25,
        25, 25,
        25, 25,
        54.6875, 40.625,
        54.6875, 40.625,
        75, 75,
        75, 75,
        95.3125, 109.375,
        95.3125, 109.375,
        125, 125,
    ])
})

test("batch geometry", () => {
    const renderer = mockRenderer()
    const ui = scene({
        camera: identity(),
        children: [
            container({
                id: 'a',
                x: 100,
                y: 100,
                width: 50,
                height: 50,
                color: red
            }),
            container({
                id: 'b',
                x: 300,
                y: 300,
                width: 50,
                height: 50,
                color: green
            })
        ],
        connections: [
            { from: 'a', to: 'b', color: white }
        ]
    })
    const constraints = { minWidth: 0, maxWidth: 100, minHeight: 0, maxHeight: 100 }
    const uiLayout = layout(ui, constraints, renderer.measureText)
    const offsets = { x: 0, y: 0 }
    const uiGeometry = geometry(ui, uiLayout, offsets, initCameraStack())
    const { layers, idToWorldSpace, connections } = reduce(ui, uiLayout, uiGeometry, reducer)
    const batches = batchGeometry(layers, connections, idToWorldSpace)
    expect(batches).toEqual([
        {
            triangles: {
                vertices: [
                    100, 100,
                    100, 150,
                    150, 100,
                    150, 150,
                ],
                colors: [
                    255, 0, 0, 255,
                    255, 0, 0, 255,
                    255, 0, 0, 255,
                    255, 0, 0, 255,
                ],
                vertexIndices: [
                    0, 1, 2,
                    1, 2, 3,
                ],
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
                cameraIndex: Array(4).fill(1),
            },
            lines: {
                vertices: [
                    125, 125,
                    125, 125,
                    125, 125,
                    133.29566992272927, 126.603732322496,
                    133.29566992272927, 126.603732322496,
                    142.33488846770666, 131.18165913398454,
                    142.33488846770666, 131.18165913398454,
                    152.03017932643237, 138.38387520046652,
                    152.03017932643237, 138.38387520046652,
                    162.2940661904068, 147.86047528794285,
                    162.2940661904068, 147.86047528794285,
                    173.0390727511299, 159.26155416241437,
                    173.0390727511299, 159.26155416241437,
                    184.17772270010204, 172.2372065898819,
                    184.17772270010204, 172.2372065898819,
                    195.62253972882343, 186.4375273363464,
                    195.62253972882343, 186.4375273363464,
                    207.28604752879426, 201.5126111678087,
                    207.28604752879426, 201.5126111678087,
                    219.0807697915148, 217.1125528502697,
                    219.0807697915148, 217.1125528502697,
                    230.91923020848517, 232.88744714973026,
                    230.91923020848517, 232.88744714973026,
                    242.7139524712057, 248.48738883219127,
                    242.7139524712057, 248.48738883219127,
                    254.37746027117657, 263.5624726636536,
                    254.37746027117657, 263.5624726636536,
                    265.8222772998979, 277.7627934101181,
                    265.8222772998979, 277.7627934101181,
                    276.9609272488701, 290.7384458375857,
                    276.9609272488701, 290.7384458375857,
                    287.70593380959326, 302.1395247120572,
                    287.70593380959326, 302.1395247120572,
                    297.9698206735676, 311.61612479953345,
                    297.9698206735676, 311.61612479953345,
                    307.6651115322933, 318.81834086601543,
                    307.6651115322933, 318.81834086601543,
                    316.70433007727075, 323.396267677504,
                    316.70433007727075, 323.396267677504,
                    325, 325,
                ],
                colors: [
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                    255, 255, 255, 255,
                ],
            },
        },
        {
            triangles: {
                vertices: [
                    300, 300,
                    300, 350,
                    350, 300,
                    350, 350,
                ],
                colors: [
                    0, 255, 0, 255,
                    0, 255, 0, 255,
                    0, 255, 0, 255,
                    0, 255, 0, 255,
                ],
                vertexIndices: [
                    0, 1, 2,
                    1, 2, 3,
                ],
                textureIndex: 0,
                textureCoordinates: Array(8).fill(0),
                cameraIndex: Array(4).fill(1),
            },
            lines: {
                vertices: [],
                colors: [],
            },
        },
    ])

})


test("render scene with translated camera gets stored in renderer", () => {
    const renderer = mockRenderer<boolean>()
    const ui = scene<boolean>({
        camera: translate(300, 300),
        children: [
            container({
                id: 'a',
                x: 100,
                y: 100,
                width: 50,
                height: 50,
                color: red
            }),
            container({
                id: 'b',
                x: 300,
                y: 300,
                width: 50,
                height: 50,
                color: green
            })
        ],
        connections: [
            { from: 'a', to: 'b', color: white }
        ]
    })
    render(renderer, ui)
    expect(renderer.cameras).toEqual([identity(), translate(300, 300)])
})
