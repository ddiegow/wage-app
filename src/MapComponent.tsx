import { useEffect } from "react";
import { getByJob, getByPrefecture } from "./lib/data-fetching";
import { NumberWithCommas } from "./lib/data-transformation";
import { translatedPrefectures } from "./lib/data-translation";
import { GenerateMapElements } from "./lib/map-component-generation";
import { JobEntries, Prefecture } from "./lib/types";
import { useAppStore } from "./store/store";

const MapComponent = () => {
    const { wageData, mappings, selectedView, setMappings, selectedJob, mapData,
        selectedPrefecture, setSelectedPrefecture, setPrefectureEntries,
        hoveredPrefecture, setHoveredPrefecture, setSelectedJobEntry,
    } = useAppStore()

    /**
        * handle clicking on the map
        * 
        * @param prefecture the code of the prefecture we've clicked on
        * @returns nothing
        */
    const handleClickMap = (jobEntries: JobEntries | null) => (prefecture: Prefecture) => {
        // if we have no data show an error
        if (!wageData) {
            console.error('No wage data');
            return;
        }
        // we have selected a new prefecture, so set the state
        setSelectedPrefecture(prefecture)
        // adapt the prefecture code to what is expected in the stats file
        //const code = correctPrefecture(prefecture.code)
        if (selectedView === "prefecture") {
            // fetch and set prefecture data
            // something went wrong and we don't have an adequate code
            if (!prefecture.code) {
                console.error("INCORRECT PREFECTURE CODE")
                return;
            }
            // extract data from stats file
            const data = getByPrefecture(wageData.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE, prefecture);
            // set state so that IndustryComponent updates with fresh data
            setPrefectureEntries(data)
        } else {
            const jobEntry = jobEntries?.values.find(v => v.prefecture.code === prefecture.code);
            if (!jobEntry)
                return;
            setSelectedJobEntry(jobEntry)
        }
    }

    useEffect(() => {
        if (selectedView === "prefecture") {
            // generate simple tooltips with prefecture names
            const tooltips = translatedPrefectures.map(p => ({ prefecture: p, tooltip: "" }))
            // generate the prefecture svg component map elements
            const mapping = GenerateMapElements(mapData, selectedView, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, handleClickMap(null), tooltips, null)
            // set the state
            setMappings(mapping ? mapping : [])
        }
        else { // we are in "industry" view
            // if we don't have data don't do anythingn
            if (!wageData || !selectedJob)
                return;

            // fetch the data for the selected job
            const jobEntries = getByJob(wageData?.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE, selectedJob)
            // compose the tooltips for each prefecture (either the amount or a NO DATA message)
            const tooltips = translatedPrefectures.map(p => {
                const data = jobEntries.values.find(je => je.prefecture.code === p.code)
                let tooltip = ""
                if (data?.data.salary)
                    tooltip = `¥ ${NumberWithCommas(data.data.salary * 1000)} a year (${data.data.sampleSize} person sample size)`
                else
                    tooltip = "No data"
                return { prefecture: p, tooltip: tooltip }
            })
            // generate the map components and set the state
            const mapping = GenerateMapElements(mapData, selectedView, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, handleClickMap(jobEntries), tooltips, jobEntries)
            setMappings(mapping ? mapping : [])
        }
    }, [selectedJob, selectedPrefecture, hoveredPrefecture, selectedView, mapData]);

    return (
        <div className="w-full max-w-full lg:w-md xl:w-md overflow-hidden">
            <svg viewBox="0 0 1000 1000" className="w-full h-auto max-w-full">
                <title>{"Japanese Prefectures"}</title>
                <g strokeLinejoin="round" className="svg-map">
                    <g fill="#EEE" stroke="#000" className="prefectures">
                        {mappings.map(m => m)}
                    </g>
                </g>
            </svg>
        </div>
    )
}

export default MapComponent;