import { useEffect } from "react";
import IndustryComponent from "./IndustryComponent";
import MapComponent from "./MapComponent";
import MenuComponent from "./MenuComponent";
import { useAppStore } from "./store/store";

const ViewComponent = () => {
    const {
        wageData,
        selectedView,
        prefectureEntries,
        setMapData,
    } = useAppStore();


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
            })
            .catch((err) => console.error("Error loading SVG:", err));
    }, [wageData])


    return (
        <div className="flex flex-col items-center">
            {/* top bar (buttons + title) */}
            <div className="flex justify-between m-1 mb-2">
                < MenuComponent />
            </div>
            <div >
                {/* view by prefecture */}
                {selectedView === "prefecture" &&
                    <>
                        <MapComponent />
                        {prefectureEntries && <IndustryComponent />
                        }
                    </>
                }
                {
                    selectedView === "industry" &&
                    <>
                        <MapComponent />
                        <IndustryComponent />
                    </>

                }
            </div>
        </div >
    )

};


export default ViewComponent;