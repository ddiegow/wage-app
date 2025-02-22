import { SetStateAction } from "react";
import { PrefectureCategoryEntry } from "./lib/types";

interface IndustryComponentProps {
    setIndustryClickedIndex: React.Dispatch<SetStateAction<boolean>>
    industryClickedIndex: boolean
    selectedPrefecture: string,
    setSelectedIndustry: React.Dispatch<SetStateAction<string>>
    selectedIndustry: string
    statistics: PrefectureCategoryEntry[]
}

const IndustryComponent =
    (
        {
            setIndustryClickedIndex,
            industryClickedIndex,
            setSelectedIndustry,
            selectedIndustry,
            statistics
        }: IndustryComponentProps
    ) => {
        return (
            <div className={`transition-opacity duration-500 ease-out ${industryClickedIndex ? "opacity-0" : "opacity-100"}  grid grid-cols-3 items-stretch justify-center items-center gap-2 m-5 min-w-1/2`}>
                {!selectedIndustry.length &&
                    statistics.map((s, index) => <p key={index} onClick={() => {
                        setIndustryClickedIndex(true);
                        setTimeout(() => {
                            setSelectedIndustry(s.category)
                            setIndustryClickedIndex(false)
                        }, 500
                        )
                    }} className={"hover:cursor-pointer hover:bg-blue-700 border-white border-solid border-1 p-3 text-center"}>{s.category}</p>)}
                {selectedIndustry.length > 0 &&
                    statistics.filter(c =>
                        c.category === selectedIndustry)[0].values.map(value =>
                            <div onClick={() => {
                                setIndustryClickedIndex(true);
                                setTimeout(() => {
                                    setSelectedIndustry("")
                                    setIndustryClickedIndex(false)
                                }, 500
                                )
                            }} className="hover:cursor-pointer hover:bg-blue-700 border-white border-solid border-1 p-3 text-center">
                                <p >
                                    {value.job.name}
                                </p>
                                <p>{value.amount * 1000}</p>
                            </div>
                        )
                }
            </div>
        )
    }

export default IndustryComponent;