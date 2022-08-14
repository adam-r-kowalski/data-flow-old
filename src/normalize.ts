export const normalize = (values: number[], [t_min, t_max]: [number, number]): number[] => {
    const [r_min, r_max] = values.reduce(([r_min, r_max], val) =>
        [Math.min(r_min, val), Math.max(r_max, val)]
        , [Infinity, -Infinity])
    const delta_r = r_max - r_min
    const delta_t = t_max - t_min
    return values.map(val => (val - r_min) / delta_r * delta_t + t_min)
}