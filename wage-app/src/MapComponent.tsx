import { JSX } from "react"

interface MapComponentProps {
    mappings: JSX.Element[]
}

const MapComponent = ({ mappings }: MapComponentProps) => {
    return (
        <svg viewBox="0 0 1000 1000" height="100%" width="100%">
            <title>{"Japanese Prefectures"}</title>
            <g strokeLinejoin="round" className="svg-map">
                <g fill="#EEE" stroke="#000" className="prefectures">
                    {mappings.map(m => m)}
                </g></g>
        </svg>
    )
}

export default MapComponent;