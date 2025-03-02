import { useState } from "react";
import { Job, PrefectureCategoryEntry } from "./lib/types";
import { NumberWithCommas } from "./lib/currency";
import IndustrySlotsComponent from "./IndustrySlotsComponent";
import JobSlotsComponent from "./JobSlotsComponent";
import { useAppStore } from "./store/store";

interface IndustryComponentProps {
    statistics: PrefectureCategoryEntry[]
}

const IndustryComponent =
    (
        {
            statistics,
        }: IndustryComponentProps
    ) => {
        // state used to assist in fade effect
        const [fadeToggle, setFadeToggle] = useState(false);
        const toggleFade = () => setFadeToggle(prev => !prev)
        const { selectedIndustry } = useAppStore();
        /**
         * look for the job's statistical data in the statistics passed as a prop
         * 
         * @param job the job we want to find the data for
         * @returns the amount of yearly income that corresponds to that job or "No data" if data is not available for that job
         */
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
            <div className={`transition-opacity duration-500 ease-out ${fadeToggle ? "opacity-0" : "opacity-100"}  grid grid-cols-3 items-stretch justify-center items-center gap-2 m-5 min-w-1/2`}>
                {/* Grid with the available industry choices */}
                {!selectedIndustry && (
                    <IndustrySlotsComponent
                        toggleFade={toggleFade}
                    />)
                }
                {/* Grid with the available job choices according to selected industry */}
                {selectedIndustry &&
                    <JobSlotsComponent
                        toggleFade={toggleFade}
                        getAmountsFromStatistics={getAmountsFromStatistics}
                    />
                }
            </div >
        )
    }

export default IndustryComponent;