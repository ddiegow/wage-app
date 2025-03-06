import { useEffect } from "react";
import IndustryComponent from "./IndustryComponent";
import { NumberWithCommas } from "./lib/data-transformation";
import MapComponent from "./MapComponent";
import MenuComponent from "./MenuComponent";
import { useAppStore } from "./store/store";

const ViewComponent = () => {
    const {
        wageData,
        selectedView,
        setMapData,
        showIndustryMenu,
        toggleIndustryMenu,
        selectedPrefecture,
        selectedJobEntry
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
        <div className="max-w-screen flex flex-col items-center mt-5">
            {/* top bar (buttons + title) */}

            < MenuComponent />

            <div className="flex flex-col items-center w-full">
                {!selectedView.length &&
                    <div className="mt-5">
                        <h2 className="text-xl font-bold text-center mb-2">Usage</h2>
                        <div className="flex flex-row gap-5">
                            <div className="ml-5">
                                <h3 className="text-lg underline mb-3">View by prefecture</h3>
                                <ul className="list-disc">
                                    <li className="mb-2">Select a prefecture</li>
                                    <li className="mb-2">Click on the briefcase icon</li>
                                    <li className="mb-2">Browse the different industries and their average salaries</li>
                                </ul>
                            </div>
                            <div className="mr-5">
                                <h3 className="text-lg underline mb-2">View by industry</h3>
                                <ul className="list-disc">
                                    <li className="mb-2">Click on the briefcase icon</li>
                                    <li className="mb-2">Select the industry you want to view information about</li>
                                    <li className="mb-2">Map will automatically open up and be colored again</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                }
                {/* view by prefecture */}
                {selectedView === "prefecture" &&
                    <>
                        {!showIndustryMenu && <MapComponent />}
                        {selectedPrefecture && <button className="mb-2" onClick={toggleIndustryMenu}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                            <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                        </svg>
                        </button>}
                        {showIndustryMenu && <IndustryComponent />}

                    </>
                }
                {
                    selectedView === "industry" &&
                    <>
                        {!showIndustryMenu && <MapComponent />}
                        <button className="mb-2" onClick={toggleIndustryMenu}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                            <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                        </svg></button>
                        {selectedJobEntry &&
                            <div>
                                <p>Prefecture: {selectedJobEntry.prefecture.name}</p>
                                <p>Yearly salary: {selectedJobEntry.data.salary ? "¥ " + NumberWithCommas(selectedJobEntry.data.salary * 1000) : "No data"}</p>
                                <p>Sample size: {selectedJobEntry.data.sampleSize ? selectedJobEntry.data.sampleSize * 10 + " people" : "No data"}</p>
                            </div>}
                        {showIndustryMenu && <IndustryComponent />}
                    </>

                }
            </div>
        </div >
    )

};


export default ViewComponent;