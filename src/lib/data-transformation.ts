/**
     * takes a prefecture code as assigned by svg and transforms it into a stats-file-adequate code
     * 
     * @param code the code from the svg map
     * @returns the code adjusted to what is expected by the stats file
     */

import { translatedPrefectures } from "./data-translation";

export const correctPrefecture = (prefCode: string) => {
    if (!prefCode.length)
        return "";
    if (Number(prefCode) < 10) {
        return "0" + prefCode + "000";
    } else {
        return prefCode + "000";
    }
    return "";
}

export const getPrefectureFromCode = (prefCode: string) => {
    if (prefCode === "")
        throw new Error("Something went wrong. Prefecture code not supported")
    return translatedPrefectures[Number(prefCode)]
}

export const NumberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}