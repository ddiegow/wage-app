import { JSX, useEffect, useState } from "react";
import { PrefectureCategoryEntry, WageData } from "./lib/types";
import { getByJob, getByJobAndPrefecture, getByPrefecture } from "./lib/data-fetching";
import IndustryComponent from "./IndustryComponent";
import MapComponent from "./MapComponent";
import MenuComponent from "./MenuComponent";
import { translatedIndustries, translatedJobs, translatedPrefectures } from "./lib/data-translation";
import { GenerateMapElements } from "./lib/map-component-generation";
import { ValueToColor } from "./lib/coloring";
import { NumberWithCommas } from "./lib/currency";

const ViewComponent: React.FC<{ wageData: WageData | null }> = ({ wageData }) => {
    const [mappings, setMappings] = useState<(JSX.Element)[]>([])
    const [statistics, setStatistics] = useState<PrefectureCategoryEntry[]>([]);
    const [selectedPrefecture, setSelectedPrefecture] = useState("");
    const [hoveredPrefecture, setHoveredPrefecture] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [selectedJob, setSelectedJob] = useState("");
    const [industryClickedIndex, setIndustryClickedIndex] = useState(false)
    const [selectedView, setSelectedView] = useState("prefecture")
    const [title, setTitle] = useState("Please select a prefecture")
    const [mapData, setMapData] = useState("")
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
    const handleClickMap = (code: string) => {
        if (!wageData) {
            console.error('No wage data');
            return;
        }
        setSelectedPrefecture(code)
        setTitle(translatedPrefectures[Number(code)].name);
        code = correctPrefecture(code)
        if (!code.length) {
            console.error("INCORRECT PREFECTURE CODE")
            return;
        }

        const data = getByPrefecture(wageData.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE, code);
        setStatistics(data)
    }
    const reset = () => {
        setSelectedIndustry("");
        setSelectedJob("");
        setSelectedPrefecture("");
        setHoveredPrefecture("");
        setIndustryClickedIndex(false);
        setStatistics([]);
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
        else {
            if (!wageData)
                return;
            const amounts: number[] = [];
            const jobData = getByJob(wageData?.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE, selectedJob)
            for (const job of jobData)
                amounts.push(job.amount)
            const max = Math.max(...amounts);
            const min = Math.min(...amounts);
            const getColorCode = (prefecture: string) => {
                prefecture = correctPrefecture(prefecture);
                if (!prefecture.length) {
                    console.error("INCORRECT PREFECTURE CODE")
                    return ""
                }
                const data = getByJobAndPrefecture(wageData.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE, prefecture, selectedJob)
                if (!data)
                    return "";
                const color = ValueToColor(min, max, data)
                return "hsl(" + color.toString() + ",100%, 50%)";
            }
            const tooltips = jobData.map(jd => ({ prefecture: jd.prefecture, tooltip: "¥ " + NumberWithCommas(jd.amount * 10000) }))
            const mapping = GenerateMapElements(mapData, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, selectedView === "prefecture" ? handleClickMap : () => { }, null, getColorCode, tooltips)
            setMappings(mapping ? mapping : [])
        }
    }, [selectedJob, selectedPrefecture, hoveredPrefecture, selectedView]);

    useEffect(() => {
        if (selectedView === "prefecture")
            setTitle("Please select a prefecture")
        else
            setTitle("Please select a job")
    }, [selectedView])
    return (
        <div className="h-screen">
            {/* top bar (buttons + title) */}
            <div className="flex justify-evenly m-5">
                <MenuComponent reset={reset} selectedView={selectedView} setSelectedView={setSelectedView} title={title}></MenuComponent>
            </div>
            <div className={"flex gap-20 justify-center " + (!selectedPrefecture ? "h-9/10" : "")}>
                {/* view by prefecture */}
                {selectedView === "prefecture" &&
                    <>
                        <MapComponent mappings={mappings} />
                        {statistics.length > 0 && <IndustryComponent
                            setIndustryClickedIndex={setIndustryClickedIndex}
                            industryClickedIndex={industryClickedIndex}
                            selectedPrefecture={selectedPrefecture}
                            selectedIndustry={selectedIndustry}
                            statistics={statistics}
                            onJobClick={null}
                            onIndustryClick={(selectedIndustry: string) => setSelectedIndustry(selectedIndustry)}
                            industryList={selectedIndustry ? [] : translatedIndustries}
                            jobList={selectedIndustry ? translatedJobs[selectedIndustry] : []}
                        />
                        }
                    </>
                }
                {
                    selectedView === "industry" &&
                    <>
                        {<IndustryComponent
                            setIndustryClickedIndex={setIndustryClickedIndex}
                            industryClickedIndex={industryClickedIndex}
                            selectedPrefecture={selectedPrefecture}
                            selectedIndustry={selectedIndustry}
                            statistics={statistics}
                            onJobClick={(selectedJob: string) => {
                                setSelectedJob(selectedJob)
                                const job = translatedJobs[selectedIndustry].filter(j => j.code === selectedJob)[0]
                                setTitle(job ? job.name : "Please select a job")
                            }}
                            onIndustryClick={(selectedIndustry: string) => setSelectedIndustry(selectedIndustry)}
                            industryList={selectedIndustry ? [] : translatedIndustries}
                            jobList={selectedIndustry ? translatedJobs[selectedIndustry] : []}
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