// calculate the donward slope of the mapping of values from the minimum to the maximum
// when it's mapped to 0-270 to use in hsl (minimum -> 270, maximum -> 0)

export const ValueToColor = (min: number, max: number, value: number) => (270 / (min - max)) * (value - max)
