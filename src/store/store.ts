import { JSX } from "react";
import { create } from "zustand";
import { Job, Prefecture, PrefectureEntries, WageData } from "../lib/types";

type StoreState = {
    wageData: WageData | null;
    prefectureEntries: PrefectureEntries | null;
    selectedPrefecture: Prefecture | null;
    selectedIndustry: string;
    selectedJob: Job | null;
    selectedView: string;
    hoveredPrefecture: string;
    title: string;
    mapData: string;
    mappings: JSX.Element[];
    showIndustryMenu: boolean;
}
type StoreActions = {
    setWageData: (wageData: WageData) => void;
    setPrefectureEntries: (prefectureEntries: PrefectureEntries) => void;
    setSelectedPrefecture: (selectedPrefecture: Prefecture | null) => void;
    setSelectedIndustry: (selectedIndustry: string) => void;
    setSelectedJob: (selectedJob: Job | null) => void;
    setSelectedView: (selectedView: string) => void;
    setHoveredPrefecture: (selectedHoveredPrefecture: string) => void;
    setTitle: (title: string) => void;
    setMapData: (mapData: string) => void;
    resetState: () => void;
    setMappings: (mappings: JSX.Element[]) => void;
    toggleIndustryMenu: () => void;
}

type Store = StoreState & StoreActions;

export const useAppStore = create<Store>((set) => ({
    wageData: null,
    prefectureEntries: null,
    selectedPrefecture: null,
    selectedIndustry: "",
    selectedJob: null,
    selectedView: "",
    hoveredPrefecture: "",
    title: "",
    mapData: "",
    mappings: [],
    showIndustryMenu: false,
    setWageData: (wageData) => set({ wageData }),
    setPrefectureEntries: (prefectureEntries) => set({ prefectureEntries }),
    setSelectedPrefecture: (selectedPrefecture) => set({ selectedPrefecture }),
    setSelectedIndustry: (selectedIndustry) => set({ selectedIndustry }),
    setSelectedJob: (selectedJob) => set({ selectedJob }),
    setSelectedView: (selectedView) => set({ selectedView, title: selectedView === "prefecture" ? "Please select a prefecture" : "Please select a job" }),
    setHoveredPrefecture: (hoveredPrefecture: string) => set({ hoveredPrefecture }),
    setTitle: (title) => set({ title }),
    setMapData: (mapData) => set({ mapData }),
    setMappings: (mappings) => set({ mappings }),
    resetState: () => set({
        prefectureEntries: null,
        selectedPrefecture: null,
        selectedJob: null,
        selectedIndustry: "",
        hoveredPrefecture: "",
        title: "",
    }),
    toggleIndustryMenu: () => set(state => ({ ...state, showIndustryMenu: !state.showIndustryMenu }))
}))
