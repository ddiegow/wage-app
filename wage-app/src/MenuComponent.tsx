import { SetStateAction } from "react";

interface MenuComponentProps {
    selectedView: string;
    setSelectedView: React.Dispatch<SetStateAction<string>>
    title: string
    reset: () => void
}

const MenuComponent = ({ selectedView, setSelectedView, title, reset }: MenuComponentProps) => {
    return <>
        <p
            className={
                "hover:cursor-pointer hover:bg-blue-700 border-solid border-1 border-color-white p-3 rounded-md "
                + (selectedView === "prefecture" ? "bg-blue-700" : "")
            }
            onClick={() => {
                setSelectedView("prefecture")
                reset();
            }}
        >
            View by prefecture
        </p>
        <h3 className=" text-3xl">
            {title}
        </h3>
        <p
            className={
                "hover:cursor-pointer hover:bg-blue-700 border-solid border-1 border-color-white p-3 rounded-md "
                + (selectedView === "industry" ? "bg-blue-700" : "")
            }
            onClick={() => {
                setSelectedView("industry")
                reset();
            }}
        >
            View by Industry
        </p>
    </>
}

export default MenuComponent