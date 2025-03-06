import { useAppStore } from "./store/store";

const MenuComponent = () => {
    const { selectedView, setSelectedView, resetState } = useAppStore();
    return <div className="flex justify-between mb-2 w-full">
        <p
            className={
                "hover:cursor-pointer hover:bg-blue-700 border-solid border-1 border-color-white p-1 rounded-md ml-2 "
                + (selectedView === "prefecture" ? "bg-blue-700" : "")
            }
            onClick={() => {
                setSelectedView("prefecture")
                resetState();
            }}
        >
            View by prefecture
        </p>
        <p
            className={
                "hover:cursor-pointer hover:bg-blue-700 border-solid border-1 border-color-white p-1 rounded-md mr-2 "
                + (selectedView === "industry" ? "bg-blue-700" : "")
            }
            onClick={() => {
                setSelectedView("industry")
                resetState();
            }}
        >
            View by Industry
        </p>
    </div>
}

export default MenuComponent