import { translatedIndustries } from "./lib/data-translation";
import { v4 as uuidv4 } from "uuid";

interface IndustrySlotsComponentProps {
    toggleFade: () => void
    onIndustryClick: (selectedIndustry: string) => void
}
const IndustrySlotsComponent = ({ toggleFade, onIndustryClick }: IndustrySlotsComponentProps) => {
    return translatedIndustries.map((industry) =>
        <p key={uuidv4()} onClick={() => {
            toggleFade()
            setTimeout(() => {
                onIndustryClick(industry)
                toggleFade()
            }, 500
            )
        }} className={"hover:cursor-pointer hover:bg-blue-700 border-white border-solid border-1 p-3 text-center"}
        >
            {industry}
        </p>
    )
}

export default IndustrySlotsComponent;