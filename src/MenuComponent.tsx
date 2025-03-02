import { useAppStore } from "./store/store";

const MenuComponent = () => {
    const { selectedView, setSelectedView, title, resetState } = useAppStore();
    return <>
        <p
            className={
                "hover:cursor-pointer hover:bg-blue-700 border-solid border-1 border-color-white p-3 rounded-md "
                + (selectedView === "prefecture" ? "bg-blue-700" : "")
            }
            onClick={() => {
                setSelectedView("prefecture")
                resetState();
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
                resetState();
            }}
        >
            View by Industry
        </p>
    </>
}

export default MenuComponent