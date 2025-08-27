"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStockStore } from "@/store/useStockStore";
import { useSalesStore } from "@/store/useSalesStore";
import type { StockItem } from "@/store/useStockStore";
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package2, TrendingDown, TrendingUp, AlertCircle, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Bileşenler için tip tanımlamaları
interface StockItemProps {
  item: {
    Marka: string;
    "Ürün Kodu": string;
    "Ürün Grubu": string;
    "Renk Kodu": string;
    bedenler: Array<{ beden: string; envanter: number }>;
    totalEnvanter: number;
  };
  index: number;
}

// LowStockItem bileşeni oluşturuluyor
const LowStockItem = ({ item, index }: StockItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-orange-50 rounded-lg border border-orange-100 overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <p className="font-medium text-orange-900">{item.Marka}</p>
          <div className="flex gap-2 text-sm text-orange-600">
            <span>{item["Ürün Kodu"]}</span>
            <span>•</span>
            <span>{item["Ürün Grubu"]}</span>
          </div>
          <div className="flex gap-2 text-xs text-orange-500 mt-1">
            <span className="flex items-center gap-1">
              <span className="font-medium">Renk:</span>
              {item["Renk Kodu"]}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant="outline" className="bg-orange-100 text-orange-700">
            {item.totalEnvanter} adet
          </Badge>
          <span className="text-xs text-orange-500 mt-1">{item.bedenler.length} beden</span>
        </div>
      </div>
      
      {isOpen && (
        <div className="px-3 pb-3 pt-1 border-t border-orange-100">
          <div className="text-sm font-medium text-orange-800 mb-2">Beden Detayları:</div>
          <div className="grid grid-cols-3 gap-2">
            {item.bedenler.map((bedenItem, bedenIndex) => (
              <div key={bedenIndex} className="bg-orange-100 rounded p-2 text-xs">
                <div className="font-medium text-orange-800">{bedenItem.beden}</div>
                <div className="text-orange-700">{bedenItem.envanter} adet</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// HighStockItem bileşeni oluşturuluyor
const HighStockItem = ({ item, index }: StockItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-green-50 rounded-lg border border-green-100 overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <p className="font-medium text-green-900">{item.Marka}</p>
          <div className="flex gap-2 text-sm text-green-600">
            <span>{item["Ürün Kodu"]}</span>
            <span>•</span>
            <span>{item["Ürün Grubu"]}</span>
          </div>
          <div className="flex gap-2 text-xs text-green-500 mt-1">
            <span className="flex items-center gap-1">
              <span className="font-medium">Renk:</span>
              {item["Renk Kodu"]}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            {item.totalEnvanter} adet
          </Badge>
          <span className="text-xs text-green-500 mt-1">{item.bedenler.length} beden</span>
        </div>
      </div>
      
      {isOpen && (
        <div className="px-3 pb-3 pt-1 border-t border-green-100">
          <div className="text-sm font-medium text-green-800 mb-2">Beden Detayları:</div>
          <div className="grid grid-cols-3 gap-2">
            {item.bedenler.map((bedenItem, bedenIndex) => (
              <div key={bedenIndex} className="bg-green-100 rounded p-2 text-xs">
                <div className="font-medium text-green-800">{bedenItem.beden}</div>
                <div className="text-green-700">{bedenItem.envanter} adet</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// MediumStockItem bileşeni oluşturuluyor
const MediumStockItem = ({ item, index }: StockItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-blue-50 rounded-lg border border-blue-100 overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <p className="font-medium text-blue-900">{item.Marka}</p>
          <div className="flex gap-2 text-sm text-blue-600">
            <span>{item["Ürün Kodu"]}</span>
            <span>•</span>
            <span>{item["Ürün Grubu"]}</span>
          </div>
          <div className="flex gap-2 text-xs text-blue-500 mt-1">
            <span className="flex items-center gap-1">
              <span className="font-medium">Renk:</span>
              {item["Renk Kodu"]}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant="outline" className="bg-blue-100 text-blue-700">
            {item.totalEnvanter} adet
          </Badge>
          <span className="text-xs text-blue-500 mt-1">{item.bedenler.length} beden</span>
        </div>
      </div>
      
      {isOpen && (
        <div className="px-3 pb-3 pt-1 border-t border-blue-100">
          <div className="text-sm font-medium text-blue-800 mb-2">Beden Detayları:</div>
          <div className="grid grid-cols-3 gap-2">
            {item.bedenler.map((bedenItem, bedenIndex) => (
              <div key={bedenIndex} className="bg-blue-100 rounded p-2 text-xs">
                <div className="font-medium text-blue-800">{bedenItem.beden}</div>
                <div className="text-blue-700">{bedenItem.envanter} adet</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function DashboardPage() {
  const stockData: StockItem[] = useStockStore((state) => state.stockData);
  const salesData = useSalesStore((state) => state.salesData);
  
  // Düşük Stok Filtreleme state'leri
  const [brandFilter, setBrandFilter] = useState("");
  const [productCodeFilter, setProductCodeFilter] = useState("");
  const [productGroupFilter, setProductGroupFilter] = useState("");
  const [colorCodeFilter, setColorCodeFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [showLowStockFilter, setShowLowStockFilter] = useState(false);
  
  // Yüksek Stok Filtreleme state'leri
  const [highStockBrandFilter, setHighStockBrandFilter] = useState("");
  const [highStockProductCodeFilter, setHighStockProductCodeFilter] = useState("");
  const [highStockProductGroupFilter, setHighStockProductGroupFilter] = useState("");
  const [highStockColorCodeFilter, setHighStockColorCodeFilter] = useState("");
  const [highStockSizeFilter, setHighStockSizeFilter] = useState("");
  const [showHighStockFilter, setShowHighStockFilter] = useState(false);
  
  // Orta Adetli Stok Filtreleme state'leri
  const [mediumStockBrandFilter, setMediumStockBrandFilter] = useState("");
  const [mediumStockProductCodeFilter, setMediumStockProductCodeFilter] = useState("");
  const [mediumStockProductGroupFilter, setMediumStockProductGroupFilter] = useState("");
  const [mediumStockColorCodeFilter, setMediumStockColorCodeFilter] = useState("");
  const [mediumStockSizeFilter, setMediumStockSizeFilter] = useState("");
  const [showMediumStockFilter, setShowMediumStockFilter] = useState(false);
  
  // Diğer state'ler
  const [showProductGroupFilter, setShowProductGroupFilter] = useState(false);
  const [productGroupNameFilter, setProductGroupNameFilter] = useState("");

  // Benzersiz markaları, ürün gruplarını ve renk kodlarını elde etme
  const uniqueBrands = [...new Set(stockData.map(item => item.Marka))].sort();
  const uniqueProductGroups = [...new Set(stockData.map(item => item["Ürün Grubu"]))].sort();
  const uniqueColorCodes = [...new Set(stockData.map(item => item["Renk Kodu"]))].sort();
  const uniqueSizes = [...new Set(stockData.map(item => item.Beden))].sort();

  // Toplam stok ve benzersiz ürün sayıları
  const totalProducts = stockData.length;
  const totalInventory = stockData.reduce((sum, item) => sum + (parseInt(item.Envanter) || 0), 0);
  const uniqueProducts = new Set(stockData.map(item => `${item["Ürün Kodu"]}-${item["Renk Kodu"]}`)).size;

  // Stok durumu analizleri - Birbirinden bağımsız hesaplamalar
  const lowStock = stockData.filter(item => {
    const stock = parseInt(item.Envanter) || 0;
    return stock >= 0 && stock <= 3;
  });

  const mediumStock = stockData.filter(item => {
    const stock = parseInt(item.Envanter) || 0;
    return stock >= 4 && stock <= 6;
  });

  const highStock = stockData.filter(item => {
    const stock = parseInt(item.Envanter) || 0;
    return stock >= 7;
  });

  // Düşük, orta ve yüksek stok kategorileri için envanter miktarı toplamları
  const lowStockCount = lowStock.reduce((sum, item) => sum + (parseInt(item.Envanter) || 0), 0);
  const mediumStockCount = mediumStock.reduce((sum, item) => sum + (parseInt(item.Envanter) || 0), 0);
  const highStockCount = highStock.reduce((sum, item) => sum + (parseInt(item.Envanter) || 0), 0);
  
  // Her kategorinin toplam envanter içindeki yüzdelik payları
  const lowStockPercentage = ((lowStockCount / totalInventory) * 100).toFixed(1);
  const mediumStockPercentage = ((mediumStockCount / totalInventory) * 100).toFixed(1);
  const highStockPercentage = ((highStockCount / totalInventory) * 100).toFixed(1);

  // Toplam stok kontrolü - tüm kategorilerin toplamı, toplam stok miktarına eşit olmalı
  const totalCategorizedStock = lowStockCount + mediumStockCount + highStockCount;
  const allCategoriesPercentage = (totalCategorizedStock / totalInventory * 100).toFixed(1);

  // Marka bazında envanter dağılımı - Tüm ürünleri dahil et
  const brandInventory = stockData.reduce((acc, item) => {
    const brand = item.Marka;
    const inventory = parseInt(item.Envanter) || 0;
    acc[brand] = (acc[brand] || 0) + inventory;
    return acc;
  }, {} as Record<string, number>);

  // Marka bazında envanter dağılımı için Nivo formatı
  const pieChartData = Object.entries(brandInventory).map(([brand, total]) => ({
    id: brand,
    label: brand,
    value: total
  }));

  // Sezon bazında dağılım analizi
  const seasonData = stockData.reduce((acc, item) => {
    const season = item.Sezon || 'Belirtilmemiş';
    if (!acc[season]) {
      acc[season] = {
        total: 0,
        brands: {}
      };
    }
    const inventory = parseInt(item.Envanter) || 0;
    acc[season].total += inventory;

    // Marka bazında dağılımı hesapla
    const brand = item.Marka;
    if (!acc[season].brands[brand]) {
      acc[season].brands[brand] = {
        total: 0,
        uniqueProducts: new Set(),
        count: 0
      };
    }
    acc[season].brands[brand].total += inventory;
    acc[season].brands[brand].uniqueProducts.add(item["Ürün Kodu"]);
    acc[season].brands[brand].count = acc[season].brands[brand].uniqueProducts.size;

    return acc;
  }, {} as Record<string, {
    total: number;
    brands: Record<string, { 
      total: number; 
      uniqueProducts: Set<string>;
      count: number;
    }>;
  }>);

  // Sezon analizi için Nivo formatı
  const seasonChartData = Object.entries(seasonData)
    .filter(([season]) => season !== 'Belirtilmemiş')
    .map(([season, data]) => ({
      id: season,
      label: season,
      value: data.total,
      brands: data.brands,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

  // Sezon bazında ürün grubu dağılımı analizi
  const seasonGroupData = stockData.reduce((acc, item) => {
    const season = item.Sezon || 'Belirtilmemiş';
    const group = item["Ürün Grubu"] || 'Belirtilmemiş';
    
    if (!acc[season]) {
      acc[season] = {
        total: 0,
        groups: {}
      };
    }
    
    if (!acc[season].groups[group]) {
      acc[season].groups[group] = {
        total: 0,
        uniqueProducts: new Set(),
        count: 0
      };
    }
    
    const inventory = parseInt(item.Envanter) || 0;
    acc[season].total += inventory;
    acc[season].groups[group].total += inventory;
    acc[season].groups[group].uniqueProducts.add(item["Ürün Kodu"]);
    acc[season].groups[group].count = acc[season].groups[group].uniqueProducts.size;
    
    return acc;
  }, {} as Record<string, {
    total: number;
    groups: Record<string, { 
      total: number; 
      uniqueProducts: Set<string>;
      count: number;
    }>;
  }>);

  // Sezon bazında grup dağılımı için Nivo formatı
  const seasonGroupChartData = Object.entries(seasonGroupData)
    .filter(([season]) => season !== 'Belirtilmemiş')
    .map(([season, data]) => ({
      id: season,
      label: season,
      value: data.total,
      groups: data.groups,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

  // Ürün grubu bazında envanter dağılımı
  const productGroupInventory = stockData.reduce((acc, item) => {
    const group = item["Ürün Grubu"] || 'Belirtilmemiş';
    const inventory = parseInt(item.Envanter) || 0;
    
    if (!acc[group]) {
      acc[group] = {
        total: 0,
        uniqueProducts: new Set()
      };
    }
    
    acc[group].total += inventory;
    acc[group].uniqueProducts.add(item["Ürün Kodu"]);
    
    return acc;
  }, {} as Record<string, {
    total: number;
    uniqueProducts: Set<string>;
  }>);

  // Ürün grubu bazında envanter dağılımı için Nivo formatı
  const productGroupPieData = Object.entries(productGroupInventory).map(([group, data]) => ({
    id: group,
    label: group,
    value: data.total,
    uniqueProducts: data.uniqueProducts.size
  }));

  // Marka bazında satış dağılımı analizi
  const brandSalesData = salesData.reduce((acc, item) => {
    const brand = item.Marka;
    let salesAmount = 0;
    
    try {
      if (typeof item["Satış (VD)"] === 'string') {
        salesAmount = parseFloat(item["Satış (VD)"].replace('.', '').replace(',', '.')) || 0;
      } else if (typeof item["Satış (VD)"] === 'number') {
        salesAmount = item["Satış (VD)"];
      }
    } catch (error) {
      console.error("Satış verisi dönüştürülemedi:", item["Satış (VD)"]);
    }

    acc[brand] = (acc[brand] || 0) + salesAmount;
    return acc;
  }, {} as Record<string, number>);

  // Marka bazında satış adedi dağılımı analizi
  const brandSalesQuantityData = salesData.reduce((acc, item) => {
    const brand = item.Marka;
    const salesQuantity = Number(item["Satış Miktarı"]) || 0;
    
    acc[brand] = (acc[brand] || 0) + salesQuantity;
    return acc;
  }, {} as Record<string, number>);

  // Marka bazında satış dağılımı için Nivo formatı
  const brandSalesPieData = Object.entries(brandSalesData).map(([brand, total]) => ({
    id: brand,
    label: brand,
    value: parseFloat(total.toFixed(2))
  }));

  // Sezon bazında satış dağılımı analizi
  const seasonSalesData = salesData.reduce((acc, item) => {
    const season = item.Sezon || 'Belirtilmemiş';
    let salesAmount = 0;
    
    try {
      if (typeof item["Satış (VD)"] === 'string') {
        salesAmount = parseFloat(item["Satış (VD)"].replace('.', '').replace(',', '.')) || 0;
      } else if (typeof item["Satış (VD)"] === 'number') {
        salesAmount = item["Satış (VD)"];
      }
    } catch (error) {
      console.error("Satış verisi dönüştürülemedi:", item["Satış (VD)"]);
    }

    acc[season] = (acc[season] || 0) + salesAmount;
    return acc;
  }, {} as Record<string, number>);

  // Sezon bazında satış adedi dağılımı analizi
  const seasonSalesQuantityData = salesData.reduce((acc, item) => {
    const season = item.Sezon || 'Belirtilmemiş';
    const salesQuantity = Number(item["Satış Miktarı"]) || 0;
    
    acc[season] = (acc[season] || 0) + salesQuantity;
    return acc;
  }, {} as Record<string, number>);

  // Ürün grubu bazında satış dağılımı analizi
  const productGroupSalesData = salesData.reduce((acc, item) => {
    const group = item["Ürün Grubu"] || 'Belirtilmemiş';
    let salesAmount = 0;
    
    try {
      if (typeof item["Satış (VD)"] === 'string') {
        salesAmount = parseFloat(item["Satış (VD)"].replace('.', '').replace(',', '.')) || 0;
      } else if (typeof item["Satış (VD)"] === 'number') {
        salesAmount = item["Satış (VD)"];
      }
    } catch (error) {
      console.error("Satış verisi dönüştürülemedi:", item["Satış (VD)"]);
    }

    acc[group] = (acc[group] || 0) + salesAmount;
    return acc;
  }, {} as Record<string, number>);

  // Ürün grubu bazında satış adedi dağılımı analizi
  const productGroupSalesQuantityData = salesData.reduce((acc, item) => {
    const group = item["Ürün Grubu"] || 'Belirtilmemiş';
    const salesQuantity = Number(item["Satış Miktarı"]) || 0;
    
    acc[group] = (acc[group] || 0) + salesQuantity;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Stok Yönetim Paneli</h1>
      
      {/* Ana Metrikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Stok</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInventory}</div>
            <p className="text-xs text-muted-foreground">Tüm ürünlerin toplamı</p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCategorizedStock === totalInventory ? (
                <span className="text-green-600">✓ Doğrulandı ({allCategoriesPercentage}%)</span>
              ) : (
                <span className="text-red-600">⚠ Fark var: {totalInventory - totalCategorizedStock} adet</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">SKU (stok kodu adet)</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueProducts}</div>
            <p className="text-xs text-muted-foreground">Farklı ürün sayısı</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Düşük Stok</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
            <p className="text-xs text-orange-600">Toplam stoğun {lowStockPercentage}%'i</p>
            <p className="text-xs text-orange-600 mt-1">Toplam {new Set(lowStock.map(item => `${item["Ürün Kodu"]}-${item["Renk Kodu"]}`)).size} farklı SKU</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Yüksek Stok</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{highStockCount}</div>
            <p className="text-xs text-green-600">Toplam stoğun {highStockPercentage}%'i</p>
            <p className="text-xs text-green-600 mt-1">Toplam {new Set(highStock.map(item => `${item["Ürün Kodu"]}-${item["Renk Kodu"]}`)).size} farklı SKU</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Orta Adetli Stok</CardTitle>
            <Package2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{mediumStockCount}</div>
            <p className="text-xs text-blue-600">Toplam stoğun {mediumStockPercentage}%'i</p>
            <p className="text-xs text-blue-600 mt-1">Toplam {new Set(mediumStock.map(item => `${item["Ürün Kodu"]}-${item["Renk Kodu"]}`)).size} farklı SKU</p>
          </CardContent>
        </Card>
      </div>

      {/* Stok Durumu Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-orange-600" />
                Düşük Stok Uyarısı
              </CardTitle>
              <button
                onClick={() => setShowLowStockFilter(!showLowStockFilter)}
                className="p-2 hover:bg-orange-100 rounded-full transition-colors"
              >
                <Filter className={`h-4 w-4 ${showLowStockFilter ? 'text-orange-600' : 'text-gray-400'}`} />
              </button>
            </div>
            {showLowStockFilter && (
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Marka</label>
                    <select 
                      className="w-full h-8 text-sm rounded-md border border-gray-300 focus:border-orange-400 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value)}
                    >
                      <option value="">Tümü</option>
                      {uniqueBrands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Ürün Grubu</label>
                    <select 
                      className="w-full h-8 text-sm rounded-md border border-gray-300 focus:border-orange-400 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                      value={productGroupFilter}
                      onChange={(e) => setProductGroupFilter(e.target.value)}
                    >
                      <option value="">Tümü</option>
                      {uniqueProductGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Renk Kodu</label>
                    <select 
                      className="w-full h-8 text-sm rounded-md border border-gray-300 focus:border-orange-400 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                      value={colorCodeFilter}
                      onChange={(e) => setColorCodeFilter(e.target.value)}
                    >
                      <option value="">Tümü</option>
                      {uniqueColorCodes.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Beden</label>
                    <select 
                      className="w-full h-8 text-sm rounded-md border border-gray-300 focus:border-orange-400 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                      value={sizeFilter}
                      onChange={(e) => setSizeFilter(e.target.value)}
                    >
                      <option value="">Tümü</option>
                      {uniqueSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Ürün Kodu</label>
                  <Input
                    placeholder="Ürün kodu ara..."
                    value={productCodeFilter}
                    onChange={(e) => setProductCodeFilter(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full pr-4">
              <div className="space-y-2">
                {(() => {
                  // SKU bazında birleştirme
                  interface GroupedItem {
                    Marka: string;
                    "Ürün Kodu": string;
                    "Ürün Grubu": string;
                    "Renk Kodu": string;
                    bedenler: Array<{ beden: string; envanter: number }>;
                    totalEnvanter: number;
                  }
                  
                  const skuGroups = lowStock.reduce((acc: Record<string, GroupedItem>, item) => {
                    // Sadece 0-3 adet arasındaki ürünleri dahil et
                    const envanter = parseInt(item.Envanter) || 0;
                    if (envanter < 0 || envanter > 3) return acc;
                    
                    const key = `${item.Marka}-${item["Ürün Kodu"]}-${item["Ürün Grubu"]}-${item["Renk Kodu"]}`;
                    if (!acc[key]) {
                      acc[key] = {
                        Marka: item.Marka,
                        "Ürün Kodu": item["Ürün Kodu"],
                        "Ürün Grubu": item["Ürün Grubu"],
                        "Renk Kodu": item["Renk Kodu"],
                        bedenler: [],
                        totalEnvanter: 0
                      };
                    }
                    acc[key].bedenler.push({ beden: item.Beden, envanter: envanter });
                    acc[key].totalEnvanter += envanter;
                    return acc;
                  }, {});

                  return Object.values(skuGroups)
                    .filter(item => {
                      // Toplam envanteri 0-3 arası olan ürünler için tekrar kontrol
                      if (item.totalEnvanter < 0 || item.totalEnvanter > 3) return false;
                      
                      // Marka filtresi
                      const brandMatch = !brandFilter || 
                        item.Marka === brandFilter;
                      
                      // Ürün kodu filtresi
                      const productCodeMatch = !productCodeFilter || 
                        (item["Ürün Kodu"]?.toString().toLowerCase() || "").includes(productCodeFilter.toLowerCase());
                      
                      // Ürün grubu filtresi
                      const productGroupMatch = !productGroupFilter || 
                        item["Ürün Grubu"] === productGroupFilter;
                      
                      // Renk kodu filtresi
                      const colorCodeMatch = !colorCodeFilter || 
                        item["Renk Kodu"] === colorCodeFilter;
                      
                      // Beden filtresi
                      const sizeMatch = !sizeFilter || 
                        item.bedenler.some(b => b.beden === sizeFilter);
                      
                      return brandMatch && productCodeMatch && productGroupMatch && colorCodeMatch && sizeMatch;
                    })
                    .map((item, index) => (
                      <LowStockItem key={index} item={item} index={index} />
                    ));
                })()}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Yüksek Stok Bildirimi
              </CardTitle>
              <button
                onClick={() => setShowHighStockFilter(!showHighStockFilter)}
                className="p-2 hover:bg-green-100 rounded-full transition-colors"
              >
                <Filter className={`h-4 w-4 ${showHighStockFilter ? 'text-green-600' : 'text-gray-400'}`} />
              </button>
            </div>
            {showHighStockFilter && (
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Marka</label>
                    <select 
                      className="w-full h-8 text-sm rounded-md border border-gray-300 focus:border-green-400 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      value={highStockBrandFilter}
                      onChange={(e) => setHighStockBrandFilter(e.target.value)}
                    >
                      <option value="">Tümü</option>
                      {uniqueBrands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Ürün Grubu</label>
                    <select 
                      className="w-full h-8 text-sm rounded-md border border-gray-300 focus:border-green-400 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      value={highStockProductGroupFilter}
                      onChange={(e) => setHighStockProductGroupFilter(e.target.value)}
                    >
                      <option value="">Tümü</option>
                      {uniqueProductGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Renk Kodu</label>
                    <select 
                      className="w-full h-8 text-sm rounded-md border border-gray-300 focus:border-green-400 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      value={highStockColorCodeFilter}
                      onChange={(e) => setHighStockColorCodeFilter(e.target.value)}
                    >
                      <option value="">Tümü</option>
                      {uniqueColorCodes.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Beden</label>
                    <select 
                      className="w-full h-8 text-sm rounded-md border border-gray-300 focus:border-green-400 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      value={highStockSizeFilter}
                      onChange={(e) => setHighStockSizeFilter(e.target.value)}
                    >
                      <option value="">Tümü</option>
                      {uniqueSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Ürün Kodu</label>
                  <Input
                    placeholder="Ürün kodu ara..."
                    value={highStockProductCodeFilter}
                    onChange={(e) => setHighStockProductCodeFilter(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full pr-4">
              <div className="space-y-2">
                {(() => {
                  // SKU bazında birleştirme
                  interface GroupedItem {
                    Marka: string;
                    "Ürün Kodu": string;
                    "Ürün Grubu": string;
                    "Renk Kodu": string;
                    bedenler: Array<{ beden: string; envanter: number }>;
                    totalEnvanter: number;
                  }
                  
                  const skuGroups = highStock.reduce((acc: Record<string, GroupedItem>, item) => {
                    // Sadece 7 ve üzeri ürünleri dahil et
                    const envanter = parseInt(item.Envanter) || 0;
                    if (envanter < 7) return acc;
                    
                    const key = `${item.Marka}-${item["Ürün Kodu"]}-${item["Ürün Grubu"]}-${item["Renk Kodu"]}`;
                    if (!acc[key]) {
                      acc[key] = {
                        Marka: item.Marka,
                        "Ürün Kodu": item["Ürün Kodu"],
                        "Ürün Grubu": item["Ürün Grubu"],
                        "Renk Kodu": item["Renk Kodu"],
                        bedenler: [],
                        totalEnvanter: 0
                      };
                    }
                    acc[key].bedenler.push({ beden: item.Beden, envanter: envanter });
                    acc[key].totalEnvanter += envanter;
                    return acc;
                  }, {});

                  return Object.values(skuGroups)
                    .filter(item => {
                      // Toplam envanteri 7 ve üzerinde olan ürünler için tekrar kontrol
                      if (item.totalEnvanter < 7) return false;
                      
                      // Marka filtresi
                      const brandMatch = !highStockBrandFilter || 
                        item.Marka === highStockBrandFilter;
                        
                      // Ürün kodu filtresi
                      const productCodeMatch = !highStockProductCodeFilter || 
                        (item["Ürün Kodu"]?.toString().toLowerCase() || "").includes(highStockProductCodeFilter.toLowerCase());
                      
                      // Ürün grubu filtresi
                      const productGroupMatch = !highStockProductGroupFilter || 
                        item["Ürün Grubu"] === highStockProductGroupFilter;
                      
                      // Renk kodu filtresi
                      const colorCodeMatch = !highStockColorCodeFilter || 
                        item["Renk Kodu"] === highStockColorCodeFilter;
                      
                      // Beden filtresi
                      const sizeMatch = !highStockSizeFilter || 
                        item.bedenler.some(b => b.beden === highStockSizeFilter);
                      
                      return brandMatch && productCodeMatch && productGroupMatch && colorCodeMatch && sizeMatch;
                    })
                    .map((item, index) => (
                      <HighStockItem key={index} item={item} index={index} />
                    ));
                })()}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package2 className="h-5 w-5 text-blue-600" />
                Orta Adetli Stok Listesi
              </CardTitle>
              <button
                onClick={() => setShowMediumStockFilter(!showMediumStockFilter)}
                className="p-2 hover:bg-blue-100 rounded-full transition-colors"
              >
                <Filter className={`h-4 w-4 ${showMediumStockFilter ? 'text-blue-600' : 'text-gray-400'}`} />
              </button>
            </div>
            {showMediumStockFilter && (
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Marka</label>
                    <select 
                      className="w-full h-8 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      value={mediumStockBrandFilter}
                      onChange={(e) => setMediumStockBrandFilter(e.target.value)}
                    >
                      <option value="">Tümü</option>
                      {uniqueBrands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Ürün Grubu</label>
                    <select 
                      className="w-full h-8 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      value={mediumStockProductGroupFilter}
                      onChange={(e) => setMediumStockProductGroupFilter(e.target.value)}
                    >
                      <option value="">Tümü</option>
                      {uniqueProductGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Renk Kodu</label>
                    <select 
                      className="w-full h-8 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      value={mediumStockColorCodeFilter}
                      onChange={(e) => setMediumStockColorCodeFilter(e.target.value)}
                    >
                      <option value="">Tümü</option>
                      {uniqueColorCodes.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Beden</label>
                    <select 
                      className="w-full h-8 text-sm rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      value={mediumStockSizeFilter}
                      onChange={(e) => setMediumStockSizeFilter(e.target.value)}
                    >
                      <option value="">Tümü</option>
                      {uniqueSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Ürün Kodu</label>
                  <Input
                    placeholder="Ürün kodu ara..."
                    value={mediumStockProductCodeFilter}
                    onChange={(e) => setMediumStockProductCodeFilter(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full pr-4">
              <div className="space-y-2">
                {(() => {
                  // SKU bazında birleştirme
                  interface GroupedItem {
                    Marka: string;
                    "Ürün Kodu": string;
                    "Ürün Grubu": string;
                    "Renk Kodu": string;
                    bedenler: Array<{ beden: string; envanter: number }>;
                    totalEnvanter: number;
                  }
                  
                  const skuGroups = mediumStock.reduce((acc: Record<string, GroupedItem>, item) => {
                    // Sadece 4-6 adet arasındaki ürünleri dahil et
                    const envanter = parseInt(item.Envanter) || 0;
                    if (envanter < 4 || envanter > 6) return acc;
                    
                    const key = `${item.Marka}-${item["Ürün Kodu"]}-${item["Ürün Grubu"]}-${item["Renk Kodu"]}`;
                    if (!acc[key]) {
                      acc[key] = {
                        Marka: item.Marka,
                        "Ürün Kodu": item["Ürün Kodu"],
                        "Ürün Grubu": item["Ürün Grubu"],
                        "Renk Kodu": item["Renk Kodu"],
                        bedenler: [],
                        totalEnvanter: 0
                      };
                    }
                    acc[key].bedenler.push({ beden: item.Beden, envanter: envanter });
                    acc[key].totalEnvanter += envanter;
                    return acc;
                  }, {});

                  return Object.values(skuGroups)
                    .filter(item => {
                      // Toplam envanteri 4-6 arası olan ürünler için tekrar kontrol
                      if (item.totalEnvanter < 4 || item.totalEnvanter > 6) return false;
                      
                      // Marka filtresi
                      const brandMatch = !mediumStockBrandFilter || 
                        item.Marka === mediumStockBrandFilter;
                        
                      // Ürün kodu filtresi
                      const productCodeMatch = !mediumStockProductCodeFilter || 
                        (item["Ürün Kodu"]?.toString().toLowerCase() || "").includes(mediumStockProductCodeFilter.toLowerCase());
                      
                      // Ürün grubu filtresi
                      const productGroupMatch = !mediumStockProductGroupFilter || 
                        item["Ürün Grubu"] === mediumStockProductGroupFilter;
                      
                      // Renk kodu filtresi
                      const colorCodeMatch = !mediumStockColorCodeFilter || 
                        item["Renk Kodu"] === mediumStockColorCodeFilter;
                      
                      // Beden filtresi
                      const sizeMatch = !mediumStockSizeFilter || 
                        item.bedenler.some(b => b.beden === mediumStockSizeFilter);
                      
                      return brandMatch && productCodeMatch && productGroupMatch && colorCodeMatch && sizeMatch;
                    })
                    .map((item, index) => (
                      <MediumStockItem key={index} item={item} index={index} />
                    ));
                })()}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Marka Bazında Satış Dağılımı</CardTitle>
              <p className="text-sm text-muted-foreground">
                Markaların toplam satış tutarı içindeki payları
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full pr-4">
                <div className="space-y-2">
                  {Object.entries(brandSalesData)
                    .sort(([, a], [, b]) => b - a)
                    .map(([brand, total], index) => {
                      const totalSales = Object.values(brandSalesData).reduce((sum, val) => sum + val, 0);
                      const percentage = ((total / totalSales) * 100).toFixed(1);
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div>
                            <p className="font-medium text-blue-900">{brand}</p>
                            <div className="flex gap-2 text-sm text-blue-600">
                              <span>{total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                            </div>
                            <div className="flex justify-center items-center text-xs text-blue-600 mt-1 w-full">
                              {brandSalesQuantityData[brand]?.toLocaleString('tr-TR') || '0'} adet satış
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-blue-100 text-blue-700">
                            %{percentage}
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sezon Bazında Satış Dağılımı</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sezonların toplam satış tutarı içindeki payları
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full pr-4">
                <div className="space-y-2">
                  {Object.entries(seasonSalesData)
                    .sort(([, a], [, b]) => b - a)
                    .map(([season, total], index) => {
                      const totalSales = Object.values(seasonSalesData).reduce((sum, val) => sum + val, 0);
                      const percentage = ((total / totalSales) * 100).toFixed(1);
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                          <div>
                            <p className="font-medium text-green-900">{season}</p>
                            <div className="flex gap-2 text-sm text-green-600">
                              <span>{total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                            </div>
                            <div className="flex justify-center items-center text-xs text-green-600 mt-1 w-full">
                              {seasonSalesQuantityData[season]?.toLocaleString('tr-TR') || '0'} adet satış
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            %{percentage}
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ürün Grubu Bazında Satış Dağılımı</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ürün gruplarının toplam satış tutarı içindeki payları
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full pr-4">
                <div className="space-y-2">
                  {Object.entries(productGroupSalesData)
                    .sort(([, a], [, b]) => b - a)
                    .map(([group, total], index) => {
                      const totalSales = Object.values(productGroupSalesData).reduce((sum, val) => sum + val, 0);
                      const percentage = ((total / totalSales) * 100).toFixed(1);
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <div>
                            <p className="font-medium text-purple-900">{group}</p>
                            <div className="flex gap-2 text-sm text-purple-600">
                              <span>{total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                            </div>
                            <div className="flex justify-center items-center text-xs text-purple-600 mt-1 w-full">
                              {productGroupSalesQuantityData[group]?.toLocaleString('tr-TR') || '0'} adet satış
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-purple-100 text-purple-700">
                            %{percentage}
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Marka Bazında Stok Dağılımı</CardTitle>
              <p className="text-sm text-muted-foreground">
                Markaların toplam stok içindeki payları
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsivePie
                  data={pieChartData}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.6}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: 'nivo' }}
                  borderWidth={1}
                  borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]]
                  }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]]
                  }}
                  tooltip={({ datum }) => {
                    const brandProducts = stockData.filter(item => item.Marka === datum.id);
                    const productGroups = brandProducts.reduce((acc, item) => {
                      const group = item["Ürün Grubu"];
                      if (!acc[group]) {
                        acc[group] = {
                          total: 0,
                          uniqueProducts: new Set(),
                          count: 0
                        };
                      }
                      acc[group].total += parseInt(item.Envanter) || 0;
                      acc[group].uniqueProducts.add(item["Ürün Kodu"]);
                      acc[group].count = acc[group].uniqueProducts.size;
                      return acc;
                    }, {} as Record<string, { 
                      total: number; 
                      uniqueProducts: Set<string>;
                      count: number;
                    }>);

                    // Toplam ürün çeşidi sayısını hesaplama
                    const totalUniqueProducts = new Set(brandProducts.map(item => item["Ürün Kodu"])).size;

                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border">
                        <p className="font-medium text-gray-900 mb-2">{datum.id}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: datum.color }} />
                            <span className="text-sm text-gray-600">Toplam Stok:</span>
                            <span className="text-sm font-medium">{datum.value} adet</span>
                          </div>
                          <div className="flex items-center gap-2 ml-5">
                            <span className="text-sm text-gray-600">Toplam Çeşit:</span>
                            <span className="text-sm font-medium">{totalUniqueProducts} ürün</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-2 border-t pt-2">
                            <p className="font-medium mb-1">Ürün Grubu Dağılımı:</p>
                            <div className="space-y-1">
                              {Object.entries(productGroups)
                                .sort(([, a], [, b]) => b.total - a.total)
                                .map(([group, data], index) => {
                                  const percentage = ((data.total / datum.value) * 100).toFixed(1);
                                  return (
                                    <div key={index} className="flex items-center justify-between">
                                      <span>{group}:</span>
                                      <div className="flex gap-2 items-center">
                                        <span className="text-gray-900">{data.total} adet</span>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs py-0 h-4">
                                          %{percentage}
                                        </Badge>
                                        <span className="text-gray-500">({data.count} çeşit)</span>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateY: 56,
                      itemsSpacing: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: '#999',
                      itemDirection: 'left-to-right',
                      itemOpacity: 1,
                      symbolSize: 18,
                      symbolShape: 'circle'
                    }
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sezon Bazında Stok Dağılımı</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sezonlara göre stok dağılımı
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsivePie
                  data={seasonChartData}
                  margin={{ top: 40, right: 120, bottom: 40, left: 120 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: 'category10' }}
                  borderWidth={1}
                  borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]]
                  }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]]
                  }}
                  legends={[
                    {
                      anchor: 'right',
                      direction: 'column',
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: 'left-to-right',
                      itemOpacity: 0.85,
                      symbolSize: 18,
                      symbolShape: 'circle'
                    }
                  ]}
                  tooltip={({ datum }: { datum: any }) => {
                    const brands = datum.data?.brands || {};
                    const totalProducts = Object.entries(brands).reduce((sum, [_, brand]) => sum + (brand as any).count, 0);

                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border min-w-[280px]">
                        {/* Başlık ve Toplam Bilgiler */}
                        <div className="border-b pb-2 mb-2">
                          <p className="font-medium text-gray-900">{datum.id} Sezonu</p>
                          <div className="flex items-center gap-4 text-sm mt-1">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: datum.color }} />
                              <span className="text-gray-600">{datum.value} adet</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-purple-500" />
                              <span className="text-gray-600">{totalProducts} çeşit</span>
                            </div>
                          </div>
                        </div>

                        {/* Marka Dağılımı - Kompakt Liste */}
                        <div className="text-sm space-y-1">
                          {Object.entries(brands)
                            .sort(([, a]: [string, any], [, b]: [string, any]) => b.total - a.total)
                            .map(([brand, data]: [string, any], index) => {
                              const percentage = (data.total / datum.value * 100).toFixed(1);
                              return (
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{brand}</span>
                                    <span className="text-xs text-gray-500">({data.count} çeşit)</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-900">{data.total} adet</span>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs py-0 h-4">
                                      %{percentage}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sezon Bazında Grup Dağılımı</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sezonlara göre ürün grubu dağılımı
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsivePie
                  data={seasonGroupChartData}
                  margin={{ top: 40, right: 120, bottom: 40, left: 120 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: 'category10' }}
                  borderWidth={1}
                  borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]]
                  }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]]
                  }}
                  legends={[
                    {
                      anchor: 'right',
                      direction: 'column',
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: 'left-to-right',
                      itemOpacity: 0.85,
                      symbolSize: 18,
                      symbolShape: 'circle'
                    }
                  ]}
                  tooltip={({ datum }: { datum: any }) => {
                    const groups = datum.data?.groups || {};
                    const totalProducts = Object.entries(groups).reduce((sum, [_, group]) => sum + (group as any).count, 0);

                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border min-w-[280px]">
                        {/* Başlık ve Toplam Bilgiler */}
                        <div className="border-b pb-2 mb-2">
                          <p className="font-medium text-gray-900">{datum.id} Sezonu</p>
                          <div className="flex items-center gap-4 text-sm mt-1">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: datum.color }} />
                              <span className="text-gray-600">{datum.value} adet</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-purple-500" />
                              <span className="text-gray-600">{totalProducts} çeşit</span>
                            </div>
                          </div>
                        </div>

                        {/* Grup Dağılımı - Kompakt Liste */}
                        <div className="text-sm space-y-1">
                          {Object.entries(groups)
                            .sort(([, a]: [string, any], [, b]: [string, any]) => b.total - a.total)
                            .map(([group, data]: [string, any], index) => {
                              const percentage = (data.total / datum.value * 100).toFixed(1);
                              return (
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{group}</span>
                                    <span className="text-xs text-gray-500">({data.count} çeşit)</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-900">{data.total} adet</span>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs py-0 h-4">
                                      %{percentage}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package2 className="h-5 w-5 text-purple-600" />
                  Ürün Grubu Bazında Stok Listesi
                </CardTitle>
                <button
                  onClick={() => setShowProductGroupFilter(!showProductGroupFilter)}
                  className="p-2 hover:bg-purple-100 rounded-full transition-colors"
                >
                  <Filter className={`h-4 w-4 ${showProductGroupFilter ? 'text-purple-600' : 'text-gray-400'}`} />
                </button>
              </div>
              {showProductGroupFilter && (
                <div className="mt-2 space-y-2">
                  <Input
                    placeholder="Ürün grubu ara..."
                    value={productGroupNameFilter}
                    onChange={(e) => setProductGroupNameFilter(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full pr-4">
                <div className="space-y-2">
                  {productGroupPieData
                    .filter(group => {
                      const nameMatch = !productGroupNameFilter || 
                        group.id.toLowerCase().includes(productGroupNameFilter.toLowerCase());
                      return nameMatch;
                    })
                    .sort((a, b) => b.value - a.value)
                    .map((group, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div>
                        <p className="font-medium text-purple-900">{group.id}</p>
                        <div className="flex gap-2 text-sm text-purple-600">
                          <span>{group.value} adet stok</span>
                          <span>•</span>
                          <span>{group.uniqueProducts} çeşit ürün</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-purple-100 text-purple-700">
                        %{((group.value / stockData.reduce((sum, item) => sum + (parseInt(item.Envanter) || 0), 0)) * 100).toFixed(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Marka Stok Detayları - Kaydırılabilir Liste */}
      <div className="mt-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Marka Stok Detayları</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tüm markaların stok bilgileri
            </p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full pr-4">
              <div className="space-y-2">
                {Object.entries(brandInventory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([brand, total], index) => {
                    // Toplam içindeki yüzde hesaplama
                    const percentage = ((total / totalInventory) * 100).toFixed(1);
                    
                    // Marka için toplam ürün çeşidi sayısı
                    const brandProducts = stockData.filter(item => item.Marka === brand);
                    const uniqueProductCount = new Set(brandProducts.map(item => item["Ürün Kodu"])).size;
                    
                    // Renk hesaplama (ilk 6 marka için COLORS dizisinden, diğerleri için rastgele)
                    const color = index < COLORS.length ? COLORS[index] : `#${Math.floor(Math.random()*16777215).toString(16)}`;
                    
                    return (
                      <div key={index} className="flex items-center border border-gray-100 rounded-lg bg-white p-3 hover:bg-gray-50">
                        <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: color }}></div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">{brand}</div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span>{uniqueProductCount} çeşit ürün</span>
                            <span className="mx-1">•</span>
                            <span>Ortalama {(total / uniqueProductCount).toFixed(1)} stok/ürün</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 px-4">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                              <div className="h-2 rounded-full" style={{ 
                                width: `${percentage}%`,
                                backgroundColor: color
                              }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700 w-12">%{percentage}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{total}</div>
                          <div className="text-xs text-gray-500">adet stok</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 