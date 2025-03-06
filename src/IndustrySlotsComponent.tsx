import { v4 as uuidv4 } from "uuid";
import { translatedIndustries } from "./lib/data-translation";
import { useAppStore } from "./store/store";

interface IndustrySlotsComponentProps {
    toggleFade: () => void
}
const IndustrySlotsComponent = ({ toggleFade }: IndustrySlotsComponentProps) => {
    const { setSelectedIndustry } = useAppStore()
    return <ul className="list-none">{translatedIndustries.map((industry) =>
        <li key={uuidv4()} onClick={() => {
            toggleFade()
            setTimeout(() => {
                setSelectedIndustry(industry)
                toggleFade()
            }, 500
            )
        }} className={"hover:cursor-pointer hover:bg-blue-700 border-white border-solid border-1 p-1 text-center"}
        >
            {industry}
        </li>)}</ul>

}

export default IndustrySlotsComponent;