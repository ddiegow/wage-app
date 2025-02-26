import { JSX, useEffect, useState } from "react";
import { PrefectureCategoryEntry, WageData } from "./lib/types";
import { getByPrefecture } from "./lib/data-fetching";
import IndustryComponent from "./IndustryComponent";
import MapComponent from "./MapComponent";
import MenuComponent from "./MenuComponent";
import { translatedPrefectures } from "./lib/data-translation";
import { GenerateMapElements } from "./lib/map-component-generation";

const ViewComponent: React.FC<{ wageData: WageData | null }> = ({ wageData }) => {
    const [mappings, setMappings] = useState<(JSX.Element)[]>([])
    const [statistics, setStatistics] = useState<PrefectureCategoryEntry[]>([]);
    const [selectedPrefecture, setSelectedPrefecture] = useState("");
    const [hoveredPrefecture, setHoveredPrefecture] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [industryClickedIndex, setIndustryClickedIndex] = useState(false)
    const [selectedView, setSelectedView] = useState("prefecture")
    const [title, setTitle] = useState("Please select a prefecture")

    const handleClick = (code: string) => {
        if (!wageData) {
            console.log('No wage data');
            return;
        }
        setSelectedPrefecture(code)
        setTitle(translatedPrefectures[Number(code)].name);
        if (!code.length)
            return;
        if (Number(code) < 10) {
            code = "0" + code + "000";
        } else {
            code = code + "000";
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
                const mapping = GenerateMapElements(data, selectedPrefecture, hoveredPrefecture, setHoveredPrefecture, handleClick)
                setMappings(mapping)
            })
            .catch((err) => console.error("Error loading SVG:", err));
    }, [wageData, selectedPrefecture, hoveredPrefecture]);
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
            </div>
        </div >
    )

};


export default ViewComponent;