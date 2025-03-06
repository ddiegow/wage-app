import { useEffect } from "react";
import { getByJob, getByPrefecture } from "./lib/data-fetching";
import { correctPrefecture, NumberWithCommas } from "./lib/data-transformation";
import { translatedPrefectures } from "./lib/data-translation";
import { GenerateMapElements } from "./lib/map-component-generation";
import { Prefecture } from "./lib/types";
import { useAppStore } from "./store/store";

const MapComponent = () => {
    const { wageData, mappings, selectedView, setMappings, selectedJob, mapData,
        selectedPrefecture, setSelectedPrefecture, setPrefectureEntries,
        setTitle, hoveredPrefecture, setHoveredPrefecture
    } = useAppStore()

    /**
        * handle clicking on the map
        * 
        * @param code the code of the prefecture we've clicked on
        * @returns nothing
        */
    const handleClickMap = (prefecture: Prefecture) => {
        // if we have no data show an error
        if (!wageData) {
            console.error('No wage data');
            return;
        }
        // we have selected a new prefecture, so set the state
        setSelectedPrefecture(prefecture)
        // set the title to the name of the prefecture
        setTitle(prefecture.name);
        // adapt the prefecture code to what is expected in the stats file
        const code = correctPrefecture(prefecture.code)
        // something went wrong and we don't have an adequate code
        if (!code.length) {
            console.error("INCORRECT PREFECTURE CODE")
            return;
        }
        // extract data from stats file
        const data = getByPrefecture(wageData.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE, prefecture);
        // set state so that IndustryComponent updates with fresh data
        setPrefectureEntries(data)
    }

    useEffect(() => {
        if (selectedView === "prefecture") {
            // generate simple tooltips with prefecture names
            const tooltips = translatedPrefectures.map(p => ({ prefecture: p, tooltip: "" }))
            // generate the prefecture svg component map elements
            const mapping = GenerateMapElements(mapData, selectedView, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, handleClickMap, tooltips, null)
            // set the state
            setMappings(mapping ? mapping : [])
        }
        else { // we are in "industry" view
            // if we don't have data don't do anything
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
            const mapping = GenerateMapElements(mapData, selectedView, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, () => { }, tooltips, jobEntries)
            setMappings(mapping ? mapping : [])
        }
    }, [selectedJob, selectedPrefecture, hoveredPrefecture, selectedView, mapData]);

    return (
        <div className="w-md h-md">
            <svg viewBox="0 0 1000 1000" height="100%" width="100%">
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