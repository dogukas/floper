import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    setStockData: (data: StockItem[]) => void
    clearStockData: () => void
}

export const useStockStore = create<StockState>()(
    persist(
        (set) => ({
            version: 0,
            stockData: [],
            setStockData: (data) => set((state) => ({ stockData: data, version: state.version + 1 })),
            clearStockData: () => set({ stockData: [], version: 0 }),
        }),
        {
            name: 'stock-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)
