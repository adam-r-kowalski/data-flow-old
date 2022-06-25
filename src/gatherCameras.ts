import { Mat3 } from "./linear_algebra";
import { Reducer } from "./reduce";
import { Entry } from "./ui";

export type Cameras = Mat3[]

export const gatherCameras: Reducer<Cameras> = {
    initial: () => [Mat3.identity()],
    combine: (cameras: Cameras, entry: Entry) => {
        if (entry.geometry.camera) {
            cameras.push(entry.geometry.camera)
        }
        return cameras
    }
}