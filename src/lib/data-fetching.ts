import { translatedJobs, translatedPrefectures } from "./data-translation";
import { IndustryJobs, Job, JobEntries, Prefecture, PrefectureEntries, VALUE } from "./types";

export const fetchData = async () => {
    try {
        const response = await fetch('/data/wage_data.json');
        if (!response.ok)
            throw new Error('Could not fetch local data')
        return await response.json();
    } catch (error) {
        console.error('Error while fetching data: ', error);
        return null;
    }
};

export const getJobs = (): IndustryJobs => {
    return translatedJobs;
}

export const getPrefectures = (): { code: string, name: string }[] => {
    return translatedPrefectures;
}

export const getByJobAndPrefecture = (values: VALUE[], prefectureCode: string, jobCode: string): { salary: number, sampleSize: number } | null => {
    const baseSalary = values.find(v => v["@tab"] == "40" && v["@cat02"] == jobCode && v["@area"] == prefectureCode);
    const bonus = values.find(v => v["@tab"] == "44" && v["@cat02"] == jobCode && v["@area"] == prefectureCode);
    const sampleSize = values.find(v => v["@tab"] == "45" && v["@cat02"] == jobCode && v["@area"] == prefectureCode)
    if (!baseSalary || !bonus || !sampleSize)
        return null;
    return { salary: Math.round(Number(baseSalary.$) * 12 + Number(bonus.$)), sampleSize: Number(sampleSize.$) };
}
export const getByPrefecture = (values: VALUE[], prefecture: Prefecture): PrefectureEntries => {
    const entries: PrefectureEntries = { prefecture, values: [] };
    for (const category in translatedJobs) {
        for (const job of translatedJobs[category]) {
            const data = getByJobAndPrefecture(values, prefecture.code, job.code)
            if (data)
                entries.values.push({ job, data })
        }
    }
    return entries
}

export const getByJob = (values: VALUE[], job: Job): JobEntries => {
    const prefectures = getPrefectures();
    const entries: JobEntries = { job, values: [] }
    for (const prefecture of prefectures) {
        const data = getByJobAndPrefecture(values, prefecture.code, job.code)
        if (data)
            entries.values.push({ prefecture: prefecture, data: data })
    }
    return entries
}