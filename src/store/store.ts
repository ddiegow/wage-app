import { create } from "zustand";
import { PrefectureCategoryEntry } from "../lib/types";

type StoreState = {
    statistics: PrefectureCategoryEntry[];
    selectedPrefecture: string;
    selectedIndustry: string;
    selectedJob: string;
    selectedView: string;
    hoveredPrefecture: string;
    title: string;
    mapData: string;
}
type StoreActions = {
    setStatistics: (statistics: PrefectureCategoryEntry[]) => void;
    setSelectedPrefecture: (selectedPrefecture: string) => void;
    setSelectedIndustry: (selectedIndustry: string) => void;
    setSelectedJob: (selectedJob: string) => void;
    setSelectedView: (selectedView: string) => void;
    setHoveredPrefecture: (selectedHoveredPrefecture: string) => void;
    setTitle: (title: string) => void;
    setMapData: (mapData: string) => void;
    resetState: () => void;
}

type Store = StoreState & StoreActions;

export const useAppStore = create<Store>((set) => ({
    statistics: [],
    selectedPrefecture: "",
    selectedIndustry: "",
    selectedJob: "",
    selectedView: "",
    hoveredPrefecture: "",
    title: "",
    mapData: ""
    ,
    setStatistics: (statistics) => set({ statistics: statistics }),
    setSelectedPrefecture: (selectedPrefecture) => set({ selectedPrefecture }),
    setSelectedIndustry: (selectedIndustry) => set({ selectedIndustry }),
    setSelectedJob: (selectedJob) => set({ selectedJob }),
    setSelectedView: (selectedView) => set({ selectedView, title: selectedView === "prefecture" ? "Please select a prefecture" : "Please select a job" }),
    setHoveredPrefecture: (hoveredPrefecture: string) => set({ hoveredPrefecture }),
    setTitle: (title) => set({ title }),
    setMapData: (mapData) => set({ mapData }),
    resetState: () => set({
        statistics: [],
        selectedPrefecture: "",
        selectedJob: "",
        hoveredPrefecture: "",
        title: "",
    }),
}))
