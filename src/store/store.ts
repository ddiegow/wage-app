import { create } from "zustand";
import { PrefectureCategoryEntry } from "../lib/types";
import { JSX } from "react";

type StoreState = {
    statistics: PrefectureCategoryEntry[];
    selectedPrefecture: string;
    selectedIndustry: string;
    selectedJob: string;
    selectedView: string;
    hoveredPrefecture: string;
    title: string;
    mapData: string;
    mappings: JSX.Element[];
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
    setMappings: (mappings: JSX.Element[]) => void
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
    mapData: "",
    mappings: []
    ,
    setStatistics: (statistics) => set({ statistics: statistics }),
    setSelectedPrefecture: (selectedPrefecture) => set({ selectedPrefecture }),
    setSelectedIndustry: (selectedIndustry) => set({ selectedIndustry }),
    setSelectedJob: (selectedJob) => set({ selectedJob }),
    setSelectedView: (selectedView) => set({ selectedView, title: selectedView === "prefecture" ? "Please select a prefecture" : "Please select a job" }),
    setHoveredPrefecture: (hoveredPrefecture: string) => set({ hoveredPrefecture }),
    setTitle: (title) => set({ title }),
    setMapData: (mapData) => set({ mapData }),
    setMappings: (mappings) => set({ mappings }),
    resetState: () => set({
        statistics: [],
        selectedPrefecture: "",
        selectedJob: "",
        hoveredPrefecture: "",
        title: "",
    }),
}))
