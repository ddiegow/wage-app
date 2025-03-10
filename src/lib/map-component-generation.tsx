import { v4 as uuidv4 } from 'uuid';
import { getColorJobView, getColorPrefectureView } from './coloring';
import { correctPrefecture, getPrefectureFromCode } from './data-transformation';
import { JobEntries, Prefecture } from './types';

export const GenerateMapElements = (
    data: string,
    selectedView: string,
    selectedPrefecture: Prefecture | null,
    hoveredPrefecture: string,
    setHoveredPrefecture: (hoveredPrefecture: string) => void,
    handleClick: (prefecture: Prefecture) => void,
    tooltips: { prefecture: { code: string, name: string }, tooltip: string }[],
    jobEntries: JobEntries | null
) => {
    // we're still fetching the data or something has gone wrong
    if (!data.length)
        return;
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(data, "image/svg+xml");
    const allG = Array.from(svgDoc.querySelectorAll<SVGGElement>("g.prefecture"))
    const mapping = allG.map((g: SVGGElement) => {
        const prefCode = g.getAttribute("data-code") || "";
        let color = "";
        const isSelected = correctPrefecture(prefCode) === selectedPrefecture?.code
        const isHovered = prefCode === hoveredPrefecture
        // depending on which mode we're in, use one filling method or another
        if (selectedView === "prefecture") {

            color = getColorPrefectureView(isSelected, isHovered)
        } else {
            if (!jobEntries)
                color = "#EEEEEE"
            else
                color = getColorJobView(isSelected, isHovered, jobEntries, prefCode)
        }
        const prefectureName = g.querySelector('title')?.textContent || ""
        const prefectureTooltip = tooltips.find(t => t.prefecture.name === prefectureName)
        let tooltip = "";
        if (prefectureTooltip)
            tooltip = tooltip + prefectureTooltip.prefecture.name + (prefectureTooltip.tooltip ? " - " + prefectureTooltip.tooltip : "")
        // if we're at a polygon element
        return (g.querySelectorAll<SVGPolygonElement>("polygon").length) ?
            // generate an svg element with paths from a polygon element
            generatePathsFromPolygon(
                g,
                selectedView,
                color,
                tooltip,
                () => setHoveredPrefecture(prefCode),
                () => setHoveredPrefecture(""),
                (e) => handleClick(getPrefectureFromCode(e.currentTarget.getAttribute("data-code") || ""))
            )
            :
            generateReactG(
                g,
                selectedView,
                color,
                tooltip,
                () => setHoveredPrefecture(prefCode),
                () => setHoveredPrefecture(""),
                (e) => handleClick(getPrefectureFromCode(e.currentTarget.getAttribute("data-code") || ""))
            )
    });
    return mapping;
}

const generatePathsFromPolygon = (g: SVGElement, selectedView: string, color: string, tooltip: string, onMouseOver: () => void, onMouseLeave: () => void, onClick: (e: React.MouseEvent<SVGGElement, MouseEvent>) => void
) => {
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
        <path key={uuidv4()} d={d} />
    );

    return (
        <g
            key={uuidv4()}
            transform={g.getAttribute("transform") || ""}
            className={g.classList.toString() + (selectedView === "prefecture" ? " hover:cursor-pointer" : "")}
            strokeLinejoin="round"
            fill={color}
            fillRule="nonzero"
            stroke="#000000"
            strokeWidth="1.0"
            data-code={g.getAttribute("data-code") || ""}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            <title>{tooltip}</title>
            {paths}
        </g >
    );

}

const generateReactG = (g: SVGElement, selectedView: string, color: string, tooltip: string, onMouseOver: () => void, onMouseLeave: () => void, onClick: (e: React.MouseEvent<SVGGElement, MouseEvent>) => void) => {
    // no polygons, create a new react element
    // and keep the original children
    const children = Array.from(g.childNodes).map((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
            // create a jsx element for each child element
            const element = child as Element;
            // if it's a title element
            if (element.tagName === 'title') {
                // create a jsx title element
                return <title key={uuidv4()}>{tooltip}</title>;
                // if it's a path element
            } else if (element.tagName === 'path') {
                // create a jsx path element
                const pathElement = element as SVGPathElement;
                return <path
                    key={uuidv4()}
                    d={pathElement.getAttribute('d') || ""}
                />;
            }
        }
        // if it's another kind (which there isn't) return null
        return null;
    });
    return (
        <g
            key={uuidv4()}
            transform={g.getAttribute("transform") || ""}
            className={g.classList.toString() + (selectedView === "prefecture" ? " hover:cursor-pointer" : "")}
            fill={color}
            stroke={g.getAttribute("stroke") || "#000000"}
            strokeWidth={g.getAttribute("stroke-width") || "1.0"}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            data-code={g.getAttribute("data-code") || ""}
            onClick={onClick}
        >
            {children}
        </g>
    );
}