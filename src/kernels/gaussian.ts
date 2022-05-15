export const weight = (radius: number): number[] => {
  let last = radius * 2 + 2
  let numerator = last - 1
  let denominator = 2
  let sum = 0
  const result: number[] = Array.from({ length: radius })
  for (let i = radius; i > 0; --i) {
    last = last * numerator / denominator
    --numerator
    ++denominator
    sum += last * (i == 1 ? 1 : 2)
    result[i - 1] = last
  }
  for (let i = 0; i < radius; ++i) result[i] /= sum
  return result
}
