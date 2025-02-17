import { translatedJobs, translatedPrefectures } from "./data-translation";
import { VALUE } from "./types";

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

export const getJobs = (): { code: string, name: string }[] => {
    return translatedJobs;
}

export const getPrefectures = (): { code: string, name: string }[] => {
    return translatedPrefectures;
}

export const getByJobAndPrefecture = (values: VALUE[], prefectureCode: string, jobCode: string): number | null => {
    const baseSalary = values.find(v => v["@tab"] == "40" && v["@cat02"] == jobCode && v["@area"] == prefectureCode);
    const bonus = values.find(v => v["@tab"] == "44" && v["@cat02"] == jobCode && v["@area"] == prefectureCode);
    if (!baseSalary || !bonus)
        return null;
    return Math.round(Number(baseSalary.$) * 12 + Number(bonus.$));
}
export const getByPrefecture = (values: VALUE[], prefectureCode: string): { job: { code: string, name: string }, amount: number }[] => {
    const jobs = getJobs();
    const entries: { job: { code: string, name: string }, amount: number }[] = []
    for (const job of jobs) {
        const amount = getByJobAndPrefecture(values, prefectureCode, job.code)
        if (amount)
            entries.push({ job: job, amount: amount })
    }
    return entries
}

export const getByJob = (values: VALUE[], jobCode: string): { prefecture: { code: string, name: string }, amount: number }[] => {
    const prefectures = getPrefectures();
    const entries: { prefecture: { code: string, name: string }, amount: number }[] = []
    for (const prefecture of prefectures) {
        const amount = getByJobAndPrefecture(values, prefecture.code, jobCode)
        if (amount)
            entries.push({ prefecture: prefecture, amount: amount })
    }
    return entries
}