import { SetStateAction } from "react";
import { Job, PrefectureCategoryEntry } from "./lib/types";
import { NumberWithCommas } from "./lib/currency";

interface IndustryComponentProps {
    setIndustryClickedIndex: React.Dispatch<SetStateAction<boolean>>
    industryClickedIndex: boolean
    selectedPrefecture: string,
    selectedIndustry: string
    statistics: PrefectureCategoryEntry[]
    onIndustryClick: (selectedIndustry: string) => void
    onJobClick: ((selectedJob: string) => void) | null
    industryList: string[]
    selectedJob: string
    jobList: Job[]
}

const IndustryComponent =
    (
        {
            setIndustryClickedIndex,
            industryClickedIndex,
            selectedIndustry,
            statistics,
            onIndustryClick,
            onJobClick,
            industryList,
            selectedJob,
            jobList
        }: IndustryComponentProps
    ) => {
        const getAmountsFromStatistics = (job: Job) => {
            // fetch job data in statistics
            const data = statistics.find(s => s.category === selectedIndustry)?.values.find(v => v.job.name === job.name)
            // if there's no data for that job, let the user know
            if (!data)
                return "No data"
            // we found the data so format it and send it back
            return "¥ " + NumberWithCommas(data.amount * 1000)
        }
        return (
            <div className={`transition-opacity duration-500 ease-out ${industryClickedIndex ? "opacity-0" : "opacity-100"}  grid grid-cols-3 items-stretch justify-center items-center gap-2 m-5 min-w-1/2`}>
                {!selectedIndustry &&
                    industryList.map((industry, index) =>
                        <p key={index} onClick={() => {
                            setIndustryClickedIndex(true);
                            setTimeout(() => {
                                onIndustryClick(industry)
                                setIndustryClickedIndex(false)
                            }, 500
                            )
                        }} className={"hover:cursor-pointer hover:bg-blue-700 border-white border-solid border-1 p-3 text-center"}
                        >
                            {industry}
                        </p>
                    )
                }

                {selectedIndustry &&
                    <>
                        {
                            jobList.map((job, index) => (
                                <div key={index} onClick={onJobClick ? () => onJobClick(job.code) : () => { }} className={`border-white border-solid border-1 p-3 text-center ${onJobClick ? "hover:cursor-pointer hover:bg-blue-700" : ""} ${job.code === selectedJob ? " bg-blue-700" : ""}`}>
                                    <p >
                                        {job.name}
                                    </p>
                                    {!onJobClick ? <p>{getAmountsFromStatistics(job)}</p> : null}
                                </div>
                            ))
                        }
                        <p className="hover:cursor-pointer" onClick={() => {
                            setIndustryClickedIndex(true);
                            setTimeout(() => {
                                onIndustryClick("");
                                if (onJobClick)
                                    onJobClick("");
                                setIndustryClickedIndex(false)
                            }, 500)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>
                        </p>
                    </>
                }
            </div >
        )
    }

export default IndustryComponent;