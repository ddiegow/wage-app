import { SetStateAction } from "react";

export const GenerateMapElements = (
    data: string,
    selectedPrefecture: string,
    hoveredPrefecture: string,
    setHoveredPrefecture: React.Dispatch<SetStateAction<string>>,
    handleClick: (code: string) => void
) => {
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
                    className={g.classList.toString() + " hover:cursor-pointer"}
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
                    className={g.classList.toString() + " hover:cursor-pointer"}
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
    return mapping;
}
