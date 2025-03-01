import { translatedJobs } from "./lib/data-translation";
import { v4 as uuidv4 } from "uuid";
import { Job } from "./lib/types";

interface JobSlotsComponentProps {
    selectedIndustry: string
    selectedJob: string
    toggleFade: () => void
    onIndustryClick: (selectedIndustry: string) => void
    onJobClick: ((selectedJob: string) => void) | null
    getAmountsFromStatistics: (job: Job) => string
}

const JobSlotsComponent = (
    {
        selectedIndustry,
        selectedJob,
        toggleFade,
        onIndustryClick,
        onJobClick,
        getAmountsFromStatistics
    }: JobSlotsComponentProps) =>
    <>
        {
            translatedJobs[selectedIndustry].map((job) => (
                <div key={uuidv4()} onClick={onJobClick ? () => onJobClick(job.code) : () => { }} className={`border-white border-solid border-1 p-3 text-center ${onJobClick ? "hover:cursor-pointer hover:bg-blue-700" : ""} ${job.code === selectedJob ? " bg-blue-700" : ""}`}>
                    <p >
                        {job.name}
                    </p>
                    {!onJobClick ? <p>{getAmountsFromStatistics(job)}</p> : null}
                </div>
            ))
        }
        <p className="hover:cursor-pointer" onClick={() => {
            toggleFade();
            setTimeout(() => {
                onIndustryClick("");
                if (onJobClick)
                    onJobClick("");
                toggleFade()
            }, 500)
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
        </p>
    </>

export default JobSlotsComponent;