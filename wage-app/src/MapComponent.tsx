import { JSX, useEffect, useState } from "react";
import { PrefectureCategoryEntry, WageData } from "./lib/types";
import { getByPrefecture } from "./lib/data-fetching";


const MapComponent: React.FC<{ wageData: WageData | null }> = ({ wageData }) => {
    const [mappings, setMappings] = useState<(JSX.Element)[]>([])
    const [statistics, setStatistics] = useState<PrefectureCategoryEntry[]>([]);
    const [selectedPrefecture, setSelectedPrefecture] = useState("");
    const [hoveredPrefecture, setHoveredPrefecture] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [industryClickedIndex, setIndustryClickedIndex] = useState<number>(-1)
    const handleClick = (code: string) => {
        if (!wageData) {
            console.log('No wage data');
            return;
        }

        setSelectedPrefecture(code)
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
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(data, "image/svg+xml");

                const allG = Array.from(svgDoc.querySelectorAll<SVGGElement>("g.prefecture"))
                const mapping = allG.map((g: SVGGElement) => {
                    const prefCode = g.getAttribute("data-code") || "";
                    const isSelected = prefCode === selectedPrefecture;
                    const isHovered = prefCode === hoveredPrefecture;

                    const getFillColor = () => {
                        if (isSelected) return "#ff0000";
                        if (isHovered) return "#ff0000";
                        return "#EEEEEE";
                    };
                    // if we're at a polygon element
                    if (g.querySelectorAll<SVGPolygonElement>("polygon").length) {
                        // create a new react element
                        const polygons = Array.from(g.querySelectorAll<SVGPolygonElement>("polygon"));
                        const pathDefs: string[] = [];

                        // convert polygons to paths
                        polygons.forEach((polygon) => {
                            const points = polygon.getAttribute("points");
                            if (!points) return;

                            // parse points and create path data
                            const coordinates = points.trim().split(/\s+/).map(Number);
                            if (coordinates.length < 6 || coordinates.length % 2 !== 0) return;

                            let pathData = `m ${coordinates[0]} ${coordinates[1]}`;
                            for (let i = 2; i < coordinates.length; i += 2) {
                                const dx = coordinates[i] - coordinates[i - 2];
                                const dy = coordinates[i + 1] - coordinates[i - 1];
                                pathData += ` ${dx} ${dy}`;
                            }
                            pathData += "z";
                            pathDefs.push(pathData);
                        });

                        // create new path elements
                        const paths = pathDefs.map(d =>
                            <path key={d} d={d} />
                        );
                        return (
                            <g
                                transform={g.getAttribute("transform") || ""}
                                className={g.classList.toString()}
                                strokeLinejoin="round"
                                fill={getFillColor()}
                                fillRule="nonzero"
                                stroke="#000000"
                                strokeWidth="1.0"
                                data-code={g.getAttribute("data-code") || ""}
                                onMouseOver={() => setHoveredPrefecture(prefCode)}
                                onMouseLeave={() => setHoveredPrefecture("")}
                                onClick={(e) => handleClick(e.currentTarget.getAttribute("data-code") || "")}
                            >
                                <title>{g.querySelector('title')?.textContent || ""}</title>
                                {paths}
                            </g >
                        );
                    } else {
                        // no polygons, create a new react element
                        // and keep the original children
                        const children = Array.from(g.childNodes).map((child, index) => {
                            if (child.nodeType === Node.ELEMENT_NODE) {
                                // create a jsx element for each child element
                                const element = child as Element;
                                // if it's a title element
                                if (element.tagName === 'title') {
                                    // create a jsx title element
                                    return <title key={`title-${index}`}>{element.textContent || ""}</title>;
                                    // if it's a path element
                                } else if (element.tagName === 'path') {
                                    // create a jsx path element
                                    const pathElement = element as SVGPathElement;
                                    return <path
                                        key={`path-${index}`}
                                        d={pathElement.getAttribute('d') || ""}
                                    />;
                                }
                            }
                            // if it's another kind (which there isn't) return null
                            return null;
                        });
                        return (
                            <g
                                transform={g.getAttribute("transform") || ""}
                                className={g.classList.toString()}
                                fill={getFillColor()}
                                stroke={g.getAttribute("stroke") || "#000000"}
                                strokeWidth={g.getAttribute("stroke-width") || "1.0"}
                                onMouseOver={() => setHoveredPrefecture(prefCode)}
                                onMouseLeave={() => setHoveredPrefecture("")}
                                data-code={g.getAttribute("data-code") || ""}
                                onClick={(e) => handleClick(e.currentTarget.getAttribute("data-code") || "")}
                            >
                                {children}
                            </g>
                        );
                    }
                });
                setMappings(mapping)
            })
            .catch((err) => console.error("Error loading SVG:", err));
    }, [wageData, selectedPrefecture, hoveredPrefecture]);
    return (
        <div className="flex gap-20 h-screen">
            <svg viewBox="0 0 1000 1000" width="100%" height="auto">
                <title>{"Japanese Prefectures"}</title>
                <g strokeLinejoin="round" className="svg-map">
                    <g fill="#EEE" stroke="#000" className="prefectures">
                        {mappings.map(m => m)}
                    </g></g>
            </svg>
            {statistics.length > 0 &&
                <div className="grid grid-cols-3 items-stretch justify-center items-center gap-2">
                    {!selectedIndustry.length &&
                        statistics.map((s, index) => <p key={index} onClick={() => {
                            setIndustryClickedIndex(index);
                            setTimeout(() => {
                                setSelectedIndustry(s.category)
                                setIndustryClickedIndex(-1)
                            }, 1000
                            )
                            //setSelectedIndustry(s.category)

                        }} className={`transition-opacity duration-1000 ease-out ${industryClickedIndex === index ? "opacity-0" : "opacity-100"} hover:cursor-pointer border-white border-solid border-1 p-3 text-center`}>{s.category}</p>)}
                    {selectedIndustry.length > 0 &&
                        statistics.filter(c =>
                            c.category === selectedIndustry)[0].values.map(value =>
                                <p onClick={() => setSelectedIndustry("")} className="border-white border-solid border-1 p-3 text-center">
                                    {value.job.name}: {value.amount * 1000}
                                </p>)
                    }
                </div>}
        </div>)
};


export default MapComponent;