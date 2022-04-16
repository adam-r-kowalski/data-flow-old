export interface Color {
  r: number
  g: number
  b: number
}

export interface Palette {
  red: Color
  pink: Color
  purple: Color
  deepPurple: Color
  indigo: Color
  blue: Color
  lightBlue: Color
  cyan: Color
  teal: Color
  green: Color
  brown: Color
  grey: Color
  blueGrey: Color
}

export const material: Palette = {
  red: { r: 198, g: 40, b: 40 },
  pink: { r: 173, g: 20, b: 87 },
  purple: { r: 106, g: 27, b: 154 },
  deepPurple: { r: 69, g: 39, b: 160 },
  indigo: { r: 40, g: 53, b: 147 },
  blue: { r: 21, g: 101, b: 192 },
  lightBlue: { r: 2, g: 119, b: 189 },
  cyan: { r: 0, g: 131, b: 143 },
  teal: { r: 0, g: 105, b: 92 },
  green: { r: 46, g: 125, b: 50 },
  brown: { r: 78, g: 52, b: 46 },
  grey: { r: 117, g: 117, b: 117 },
  blueGrey: { r: 55, g: 71, b: 79 }
}
