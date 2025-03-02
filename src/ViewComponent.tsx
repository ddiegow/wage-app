import { JSX, useEffect, useState } from "react";
import { PrefectureCategoryEntry, WageData } from "./lib/types";
import { getByJob, getByPrefecture } from "./lib/data-fetching";
import IndustryComponent from "./IndustryComponent";
import MapComponent from "./MapComponent";
import MenuComponent from "./MenuComponent";
import { translatedJobs, translatedPrefectures } from "./lib/data-translation";
import { GenerateMapElements } from "./lib/map-component-generation";
import { ValueToColor } from "./lib/coloring";
import { NumberWithCommas } from "./lib/currency";
import { useAppStore } from "./store/store";

const ViewComponent: React.FC<{ wageData: WageData | null }> = ({ wageData }) => {
    const [mappings, setMappings] = useState<(JSX.Element)[]>([])
    const [statistics, setStatistics] = useState<PrefectureCategoryEntry[]>([]);
    const [selectedPrefecture, setSelectedPrefecture] = useState("");
    const [hoveredPrefecture, setHoveredPrefecture] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [selectedJob, setSelectedJob] = useState("");
    // const [selectedView, setSelectedView] = useState("prefecture")
    //const [title, setTitle] = useState("Please select a prefecture")
    const [mapData, setMapData] = useState("")
    const { setTitle, selectedView } = useAppStore();
    /**
     * takes a prefecture code as assigned by svg and transforms it into a stats-file-adequate code
     * 
     * @param code the code from the svg map
     * @returns the code adjusted to what is expected by the stats file
     */
    const correctPrefecture = (code: string) => {
        if (!code.length)
            return "";
        if (Number(code) < 10) {
            return "0" + code + "000";
        } else {
            return code + "000";
        }
        return "";
    }
    /**
     * handle clicking on the map
     * 
     * @param code the code of the prefecture we've clicked on
     * @returns nothing
     */
    const handleClickMap = (code: string) => {
        // if we have no data show an error
        if (!wageData) {
            console.error('No wage data');
            return;
        }
        // we have selected a new prefecture, so set the state
        setSelectedPrefecture(code)
        // set the title to the name of the prefecture
        setTitle(translatedPrefectures[Number(code)].name);
        // adapt the prefecture code to what is expected in the stats file
        code = correctPrefecture(code)
        // something went wrong and we don't have an adequate code
        if (!code.length) {
            console.error("INCORRECT PREFECTURE CODE")
            return;
        }
        // extract data from stats file
        const data = getByPrefecture(wageData.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE, code);
        // set state so that IndustryComponent updates with fresh data
        setStatistics(data)
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
                // filling function according to selection or hover state
                const getFillColor = (isSelected: boolean, isHovered: boolean) => {
                    if (isSelected) return "#ff0000";
                    if (isHovered) return "#ff0000";
                    return "#EEEEEE";
                };
                // generate simple tooltips with prefecture names
                const tooltips = translatedPrefectures.map(p => ({ prefecture: p, tooltip: "" }))
                // generate the prefecture svg component map elements
                const mapping = GenerateMapElements(data, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, selectedView === "prefecture" ? handleClickMap : () => { }, getFillColor, null, tooltips)
                // set the state
                setMappings(mapping ? mapping : [])
            })
            .catch((err) => console.error("Error loading SVG:", err));
    }, [])

    useEffect(() => {
        if (selectedView === "prefecture") {
            // filling function according to selection or hover state
            const getFillColor = (isSelected: boolean, isHovered: boolean) => {
                if (isSelected) return "#ff0000";
                if (isHovered) return "#ff0000";
                return "#EEEEEE";
            };
            // generate simple tooltips with prefecture names
            const tooltips = translatedPrefectures.map(p => ({ prefecture: p, tooltip: "" }))
            // generate the prefecture svg component map elements
            const mapping = GenerateMapElements(mapData, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, selectedView === "prefecture" ? handleClickMap : () => { }, getFillColor, null, tooltips)
            // set the state
            setMappings(mapping ? mapping : [])
        }
        else { // we are in "industry" view
            // if we don't have data don't do anything
            if (!wageData)
                return;
            // this will hold the yearly income for the selected job per prefecture
            const amounts: number[] = [];
            // fetch the data for the selected job
            const jobData = getByJob(wageData?.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE, selectedJob)
            // take out the amounts and put them in the array
            for (const job of jobData)
                amounts.push(job.amount)
            // calculate the max and min values to be used to calculate the color scheme
            const max = Math.max(...amounts);
            const min = Math.min(...amounts);
            /**
             * coloring function that will be passed to the mapping function
             * @param prefecture the prefecture code
             * @returns the corresponding color code
             */
            const getColorCode = (prefecture: string) => {
                // adapt the code to the stats file 
                prefecture = correctPrefecture(prefecture);
                // we couldn't adapt the code
                if (!prefecture.length) {
                    console.error("INCORRECT PREFECTURE CODE")
                    return ""
                }
                // fetch the job data that corresponds to the given prefecture
                const data = jobData.find(jd => jd.prefecture.code === prefecture)
                // if we didn't find it, no color
                if (!data)
                    return "";
                // calculate the color
                const color = ValueToColor(min, max, data.amount)
                // return it in hsl format
                return "hsl(" + color.toString() + ",100%, 50%)";
            }
            // compose the tooltips for each prefecture (either the amount or a NO DATA message)
            const tooltips = translatedPrefectures.map(p => {
                const data = jobData.find(jd => jd.prefecture.code === p.code)
                let tooltip = ""
                if (data)
                    tooltip = "¥ " + NumberWithCommas(data.amount * 1000)
                else
                    tooltip = "NO DATA"
                return { prefecture: p, tooltip: tooltip }
            })
            // generate the map components and set the state
            const mapping = GenerateMapElements(mapData, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, selectedView === "prefecture" ? handleClickMap : () => { }, null, getColorCode, tooltips)
            setMappings(mapping ? mapping : [])
        }
    }, [selectedJob, selectedPrefecture, hoveredPrefecture, selectedView]);

    /**
     * update the title state when the view changes
     */
    /*
    useEffect(() => {
        if (selectedView === "prefecture")
            setTitle("Please select a prefecture")
        else
            setTitle("Please select a job")
    }, [selectedView])
    */
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
                        {statistics.length > 0 && <IndustryComponent
                            selectedPrefecture={selectedPrefecture}
                            selectedIndustry={selectedIndustry}
                            statistics={statistics}
                            onJobClick={null}
                            onIndustryClick={(selectedIndustry: string) => setSelectedIndustry(selectedIndustry)}
                            selectedJob=""
                        />
                        }
                    </>
                }
                {
                    selectedView === "industry" &&
                    <>
                        {<IndustryComponent
                            selectedPrefecture={selectedPrefecture}
                            selectedIndustry={selectedIndustry}
                            statistics={statistics}
                            onJobClick={(selectedJob: string) => {
                                setSelectedJob(selectedJob)
                                const job = translatedJobs[selectedIndustry].filter(j => j.code === selectedJob)[0]
                                setTitle(job ? job.name : "Please select a job")
                            }}
                            onIndustryClick={(selectedIndustry: string) => setSelectedIndustry(selectedIndustry)}
                            selectedJob={selectedJob}
                        />
                        }
                        <MapComponent mappings={mappings} />
                    </>

                }
            </div>
        </div >
    )

};


export default ViewComponent;