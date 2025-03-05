import { create } from "zustand";

interface FilterStore {
  filters: { [key: string]: string[] };
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: {},
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: state.filters[key]?.includes(value)
          ? state.filters[key].filter((v) => v !== value)
          : [...(state.filters[key] || []), value],
      },
    })),
  clearFilters: () => set({ filters: {} }),
}));
