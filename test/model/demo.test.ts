import { demoModel } from "../../src/model/demo"
import { mockDocument } from "../../src/ui/mock"
import { makeEffects } from "../mock_effects"

test("node placement location is half of window size", () => {
    const effects = makeEffects(mockDocument())
    const onTableUpload = () => {}
    const model = demoModel({ width: 500, height: 500 }, effects, onTableUpload)
    expect(model.window).toEqual({ width: 500, height: 500 })
    expect(model.nodePlacementLocation).toEqual({ x: 250, y: 250, show: false })
})
