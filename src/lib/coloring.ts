// calculate the donward slope of the mapping of values from the minimum to the maximum
// when it's mapped to 0-270 to use in hsl (minimum -> 270, maximum -> 0)

import { correctPrefecture } from "./data-transformation";
import { JobEntries } from "./types";

export const ValueToColor = (min: number, max: number, value: number) => {
    if (value <= min) return 0 // red
    if (value >= max) return 130 // green
    const range = max - min;
    const normalized = (value - min) / range; // Normalize value between 0 and 1
    const hue = Math.round(normalized * 130); // Map to 0-130 range

    return hue;
}

// filling function according to selection or hover state
export const getColorPrefectureView = (isSelected: boolean, isHovered: boolean) => {
    if (isSelected) return "#ff0000";
    if (isHovered) return "#ff0000";
    return "#EEEEEE";
};

/**
    * coloring function that will be passed to the mapping function
    * @param prefecture the prefecture code
    * @returns the corresponding color code
*/
export const getColorJobView = (jobData: JobEntries, prefCode: string) => {
    // this will hold the yearly income for the selected job per prefecture
    const amounts: number[] = [];
    // take out the amounts and put them in the array
    for (const job of jobData.values)
        if (job.data.salary)
            amounts.push(job.data.salary)
    console.log(`amounts: `, amounts)
    // calculate the max and min values to be used to calculate the color scheme
    const max = Math.max(...amounts);
    const min = Math.min(...amounts);

    // adapt the code to the stats file 
    prefCode = correctPrefecture(prefCode);
    // we couldn't adapt the code
    if (!prefCode.length) {
        console.error("INCORRECT PREFECTURE CODE")
        return ""
    }
    // fetch the job data that corresponds to the given prefecture
    const data = jobData.values.find(jd => jd.prefecture.code === prefCode)
    // if we didn't find it, no color
    if (!data)
        return "";
    // calculate the color
    const color = ValueToColor(min, max, data.data.salary)
    // return it in hsl format
    console.log("returning hsl(" + color.toString() + ",100%, 50%)")
    return "hsl(" + color.toString() + ",100%, 50%)";
}