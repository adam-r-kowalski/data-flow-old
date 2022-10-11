import { loadDemoModel } from "../../src/model/demo"
import { emptyModel } from "../../src/model/empty"
import { mockDocument } from "../../src/ui/mock"
import { makeEffects } from "../mock_effects"

test("node placement location is half of window size", () => {
    const effects = makeEffects(mockDocument())
    const onTableUpload = () => {}
    const model = emptyModel({ width: 500, height: 500 })
    const model1 = loadDemoModel(model, effects, onTableUpload)
    expect(model1.nodePlacementLocation).toEqual({
        x: 250,
        y: 250,
        show: false,
    })
})
