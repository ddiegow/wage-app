// calculate the donward slope of the mapping of values from the minimum to the maximum
// when it's mapped to 0-270 to use in hsl (minimum -> 270, maximum -> 0)

export const ValueToColor = (min: number, max: number, value: number) => {
    if (value <= min) return 0 // red
    if (value >= max) return 130 // green
    const range = max - min;
    const normalized = (value - min) / range; // Normalize value between 0 and 1
    const hue = Math.round(normalized * 130); // Map to 0-130 range

    return hue;
}