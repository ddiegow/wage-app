import { v4 as uuidv4 } from "uuid";
import { translatedJobs } from "./lib/data-translation";
import { Job } from "./lib/types";
import { useAppStore } from "./store/store";

interface JobSlotsComponentProps {
    toggleFade: () => void
    getAmountsFromStatistics: (job: Job) => { salary: number, sampleSize: number }
}

const JobSlotsComponent = (
    {
        toggleFade,
        getAmountsFromStatistics
    }: JobSlotsComponentProps) => {
    const { selectedIndustry, selectedJob, setSelectedIndustry, setSelectedJob, selectedView, setTitle } = useAppStore();
    return <>
        {selectedIndustry &&
            translatedJobs[selectedIndustry].map((job) => (
                <div key={uuidv4()} onClick={selectedView === "industry" ? () => {
                    setSelectedJob(job)
                    setTitle(job.name);
                } : () => { }} className={`border-white border-solid border-1 p-3 text-center ${selectedView === "industry" ? "hover:cursor-pointer hover:bg-blue-700" : ""} ${job.code === selectedJob?.code ? " bg-blue-700" : ""}`}>
                    <p >
                        {job.name}
                    </p>
                    {selectedView === "prefecture" ? <p>{getAmountsFromStatistics(job).salary ? getAmountsFromStatistics(job).salary * 1000 : "No data"}</p> : null}
                </div>
            ))
        }
        <p className="hover:cursor-pointer" onClick={() => {
            toggleFade();
            setTimeout(() => {
                setSelectedIndustry("");
                setSelectedJob(null);
                toggleFade()
            }, 500)
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
        </p>
    </>
}
export default JobSlotsComponent;