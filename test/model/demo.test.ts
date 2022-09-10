import '@tensorflow/tfjs-backend-cpu'

import { demoModel } from "../../src/model/demo"
import { makeEffects } from "../mock_effects"

test("node placement location is half of window size", () => {
    const effects = makeEffects()
    const model = demoModel({ width: 500, height: 500 }, effects)
    expect(model.window).toEqual({ width: 500, height: 500 })
    expect(model.nodePlacementLocation).toEqual({ x: 250, y: 250, show: false })
})