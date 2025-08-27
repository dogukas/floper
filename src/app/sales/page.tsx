"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileSpreadsheet, Trash2 } from "lucide-react";
import * as XLSX from 'xlsx';
import { useSalesStore, SalesItem } from "@/store/useSalesStore";

export default function SalesPage() {
  const { 
    salesData,
    searchQuery,
    filterField,
    filterValue,
    setSalesData,
    clearSalesData,
    setSearchQuery,
    setFilter,
    getFilteredData
  } = useSalesStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as SalesItem[];
        setSalesData(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleClearData = () => {
    clearSalesData();
  };

  const filterOptions = [
    { value: 'none', label: 'Filtre Seçin' },
    { value: 'Marka', label: 'Marka' },
    { value: 'Ürün Grubu', label: 'Ürün Grubu' },
    { value: 'Ürün Kodu', label: 'Ürün Kodu' },
    { value: 'Renk Kodu', label: 'Renk Kodu' },
    { value: 'Beden', label: 'Beden' },
    { value: 'Sezon', label: 'Sezon' },
  ];

  const filteredData = getFilteredData();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Satış Analiz</h1>
        <div className="flex gap-2">
          <input
            type="file"
            id="excel-upload"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label htmlFor="excel-upload">
            <Button variant="outline" className="gap-2" asChild>
              <span>
                <FileSpreadsheet className="h-4 w-4" />
                Excel Dosyası Yükle
              </span>
            </Button>
          </label>
          {salesData.length > 0 && (
            <Button
              variant="outline"
              className="gap-2 text-destructive hover:text-destructive"
              onClick={handleClearData}
            >
              <Trash2 className="h-4 w-4" />
              Verileri Temizle
            </Button>
          )}
        </div>
      </div>

      {salesData.length > 0 && (
        <>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterField} onValueChange={(value) => setFilter(value, filterValue)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtre seçin" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filterField !== "none" && (
                <Input
                  placeholder="Filtre değeri..."
                  value={filterValue}
                  onChange={(e) => setFilter(filterField, e.target.value)}
                  className="w-[200px]"
                />
              )}
            </div>
          </div>

          <Card>
            <ScrollArea className="h-[600px] rounded-md">
              <div className="relative">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="w-[150px]">Marka</TableHead>
                      <TableHead className="w-[150px]">Ürün Grubu</TableHead>
                      <TableHead className="w-[150px]">Ürün Kodu</TableHead>
                      <TableHead className="w-[150px]">Renk Kodu</TableHead>
                      <TableHead className="w-[100px]">Beden</TableHead>
                      <TableHead className="w-[100px]">Envanter</TableHead>
                      <TableHead className="w-[100px]">Sezon</TableHead>
                      <TableHead className="w-[120px]">Satış Miktarı</TableHead>
                      <TableHead className="w-[150px]">Satış (VD)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.Marka}</TableCell>
                        <TableCell>{item["Ürün Grubu"]}</TableCell>
                        <TableCell>{item["Ürün Kodu"]}</TableCell>
                        <TableCell>{item["Renk Kodu"]}</TableCell>
                        <TableCell>{item.Beden}</TableCell>
                        <TableCell>{item.Envanter}</TableCell>
                        <TableCell>{item.Sezon}</TableCell>
                        <TableCell>{item["Satış Miktarı"]}</TableCell>
                        <TableCell>{item["Satış (VD)"]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </Card>
        </>
      )}
    </div>
  );
} 