import { useEffect } from "react";
import IndustryComponent from "./IndustryComponent";
import MapComponent from "./MapComponent";
import MenuComponent from "./MenuComponent";
import { NumberWithCommas } from "./lib/currency";
import { getByJob, getByPrefecture } from "./lib/data-fetching";
import { correctPrefecture } from "./lib/data-transformation";
import { translatedPrefectures } from "./lib/data-translation";
import { GenerateMapElements } from "./lib/map-component-generation";
import { Prefecture, WageData } from "./lib/types";
import { useAppStore } from "./store/store";

const ViewComponent: React.FC<{ wageData: WageData | null }> = ({ wageData }) => {
    const {
        setTitle,
        selectedView,
        selectedJob,
        selectedPrefecture,
        setSelectedPrefecture,
        hoveredPrefecture,
        setHoveredPrefecture,
        prefectureEntries,
        setPrefectureEntries,
        mapData,
        setMapData,
        mappings,
        setMappings
    } = useAppStore();

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

    // on first load we fetch the map data and, because we start in prefecture mode, render an empty map
    useEffect(() => {
        fetch("/maps/map-full.svg")
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                const contentType = res.headers.get("Content-Type");
                if (!contentType || !contentType.includes("image/svg+xml")) {
                    throw new Error(`Unexpected content type: ${contentType}`);
                }
                return res.text()
            })
            .then((data) => {
                setMapData(data)
                // generate simple tooltips with prefecture names
                const tooltips = translatedPrefectures.map(p => ({ prefecture: p, tooltip: "" }))
                // generate the prefecture svg component map elements
                const mapping = GenerateMapElements(data, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, selectedView === "prefecture" ? handleClickMap : () => { }, tooltips, null)
                // set the state
                setMappings(mapping ? mapping : [])
            })
            .catch((err) => console.error("Error loading SVG:", err));
    }, [])

    useEffect(() => {
        if (selectedView === "prefecture") {
            // generate simple tooltips with prefecture names
            const tooltips = translatedPrefectures.map(p => ({ prefecture: p, tooltip: "" }))
            // generate the prefecture svg component map elements
            const mapping = GenerateMapElements(mapData, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, selectedView === "prefecture" ? handleClickMap : () => { }, tooltips, null)
            // set the state
            setMappings(mapping ? mapping : [])
        }
        else { // we are in "industry" view
            // if we don't have data don't do anything
            if (!wageData || !selectedJob)
                return;

            // fetch the data for the selected job
            const jobData = getByJob(wageData?.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE, selectedJob)

            // compose the tooltips for each prefecture (either the amount or a NO DATA message)
            const tooltips = translatedPrefectures.map(p => {
                const data = jobData.values.find(jd => jd.prefecture.code === p.code)
                let tooltip = ""
                if (data?.data.salary)
                    tooltip = "¥ " + NumberWithCommas(data.data.salary * 1000) + ` (${data.data.sampleSize} person sample size)`
                else
                    tooltip = "No data"
                return { prefecture: p, tooltip: tooltip }
            })
            // generate the map components and set the state
            const mapping = GenerateMapElements(mapData, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, selectedView === "prefecture" ? handleClickMap : () => { }, tooltips, jobData)
            setMappings(mapping ? mapping : [])
        }
    }, [selectedJob, selectedPrefecture, hoveredPrefecture, selectedView]);

    return (
        <div className="h-screen">
            {/* top bar (buttons + title) */}
            <div className="flex justify-between m-5">
                < MenuComponent />
            </div>
            <div className={"flex gap-20 justify-center " + (!selectedPrefecture ? "h-9/10" : "")}>
                {/* view by prefecture */}
                {selectedView === "prefecture" &&
                    <>
                        <MapComponent mappings={mappings} />
                        {prefectureEntries && <IndustryComponent />
                        }
                    </>
                }
                {
                    selectedView === "industry" &&
                    <>
                        {<IndustryComponent />
                        }
                        <MapComponent mappings={mappings} />
                    </>

                }
            </div>
        </div >
    )

};


export default ViewComponent;