import { JSX, useEffect, useState } from "react";
import { PrefectureCategoryEntry, WageData } from "./lib/types";
import { getByJob, getByJobAndPrefecture, getByPrefecture } from "./lib/data-fetching";
import IndustryComponent from "./IndustryComponent";
import MapComponent from "./MapComponent";
import MenuComponent from "./MenuComponent";
import { translatedPrefectures } from "./lib/data-translation";
import { GenerateMapElements } from "./lib/map-component-generation";
import { ValueToColor } from "./lib/coloring";

const ViewComponent: React.FC<{ wageData: WageData | null }> = ({ wageData }) => {
    const [mappings, setMappings] = useState<(JSX.Element)[]>([])
    const [statistics, setStatistics] = useState<PrefectureCategoryEntry[]>([]);
    const [selectedPrefecture, setSelectedPrefecture] = useState("");
    const [hoveredPrefecture, setHoveredPrefecture] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [industryClickedIndex, setIndustryClickedIndex] = useState(false)
    const [selectedView, setSelectedView] = useState("prefecture")
    const [title, setTitle] = useState("Please select a prefecture")
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
    const handleClick = (code: string) => {
        if (!wageData) {
            console.log('No wage data');
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

    useEffect(() => {
        fetch("/maps/map-full.svg")
            .then((res) => {
                return res.text()
            })
            .then((data) => {
                if (selectedView === "prefecture") {
                    // and this function needs to be passed as a prop
                    // so that we color prefectures based on parent component's needs
                    const getFillColor = (isSelected: boolean, isHovered: boolean) => {
                        if (isSelected) return "#ff0000";
                        if (isHovered) return "#ff0000";
                        return "#EEEEEE";
                    };
                    const mapping = GenerateMapElements(data, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, handleClick, getFillColor, null)
                    setMappings(mapping)
                }
                else {
                    if (!wageData)
                        return;
                    const amounts: number[] = [];
                    const jobData = getByJob(wageData?.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE, "1073")
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
                        const data = getByJobAndPrefecture(wageData.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE, prefecture, "1073")
                        if (!data)
                            return "";
                        const color = ValueToColor(min, max, data)
                        return "hsl(" + color.toString() + ",100%, 50%)";
                    }
                    const mapping = GenerateMapElements(data, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, handleClick, null, getColorCode)
                    setMappings(mapping)
                }

            })
            .catch((err) => console.error("Error loading SVG:", err));
    }, [selectedPrefecture, hoveredPrefecture, selectedView]);
    return (
        <div className="h-screen">
            {/* top bar (buttons + title) */}
            <div className="flex justify-evenly m-5">
                <MenuComponent selectedView={selectedView} setSelectedView={setSelectedView} title={title}></MenuComponent>
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
                            setSelectedIndustry={setSelectedIndustry}
                            selectedIndustry={selectedIndustry}
                            statistics={statistics}
                        />
                        }
                    </>
                }
                {
                    selectedView === "industry" &&
                    <MapComponent mappings={mappings} />
                }
            </div>
        </div >
    )

};


export default ViewComponent;