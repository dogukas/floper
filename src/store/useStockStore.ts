import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface StockItem {
  Marka: string
  "Ürün Grubu": string
  "Ürün Kodu": string
  "Renk Kodu": string
  Beden: string
  Envanter: string
  Barkod: string
  Sezon: string
}

interface StockState {
  version: number
  stockData: StockItem[]
  searchQuery: string
  filterField: keyof StockItem | ''
  filterValue: string
  setStockData: (data: StockItem[]) => void
  clearStockData: () => void
  setSearchQuery: (query: string) => void
  setFilter: (field: keyof StockItem | '', value: string) => void
  getFilteredData: () => StockItem[]
}

type PersistedState = Omit<StockState, 'getFilteredData'>

export const useStockStore = create<StockState>()(
  persist(
    (set, get) => ({
      version: 1,
      stockData: [],
      searchQuery: '',
      filterField: '',
      filterValue: '',
      setStockData: (data) => set({ stockData: data }),
      clearStockData: () => set({ stockData: [] }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilter: (field, value) => set({ filterField: field, filterValue: value }),
      getFilteredData: () => {
        const { stockData, searchQuery, filterField, filterValue } = get()
        
        return stockData.filter((item) => {
          // Genel arama
          if (searchQuery) {
            const searchLower = searchQuery.toLowerCase()
            return Object.values(item).some(
              (value) => value != null && value.toString().toLowerCase().includes(searchLower)
            )
          }
          
          // Spesifik alan filtresi
          if (filterField && filterValue) {
            const itemValue = item[filterField]
            return itemValue != null && itemValue.toString().toLowerCase().includes(filterValue.toLowerCase())
          }
          
          return true
        })
      },
    }),
    {
      name: 'stock-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return window.localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        }
      }),
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          return {
            version: 1,
            stockData: (persistedState as PersistedState)?.stockData || [],
            searchQuery: '',
            filterField: '',
            filterValue: '',
          }
        }
        return persistedState as PersistedState
      },
    }
  )
) 