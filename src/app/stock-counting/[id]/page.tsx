/**
 * Counting Detail Page
 * Specific counting event detail and item counting interface
 */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft,
    Play,
    CheckCircle2,
    AlertTriangle,
    Search,
    Package,
    ScanBarcode,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { useCountingStore } from "@/store/useCountingStore";
import { useStockStore } from "@/store/useStockStore";
import { BarcodeScanner } from "@/components/counting";
import type { CountingEvent, CountingDetail } from "@/types/counting";
import { getDiscrepancySeverity, getDiscrepancyColor } from "@/types/counting";

export default function CountingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const {
        countingEvents,
        countingDetails,
        updateCountingEvent,
        getDetailsByEventId,
        addCountingDetail,
        updateCountingDetail,
    } = useCountingStore();

    const { stockData } = useStockStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [currentEvent, setCurrentEvent] = useState<CountingEvent | null>(null);
    const [eventDetails, setEventDetails] = useState<CountingDetail[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    // Load event and details with real-time sync
    useEffect(() => {
        const event = countingEvents.find((e) => e.id === eventId);
        if (event) {
            setCurrentEvent(event);
        }
    }, [eventId, countingEvents]);

    // Sync details in real-time when countingDetails changes
    useEffect(() => {
        const details = getDetailsByEventId(eventId);
        setEventDetails(details);
        // Reset to page 1 if current page is out of bounds
        if (currentPage > Math.ceil(details.length / itemsPerPage)) {
            setCurrentPage(1);
        }
    }, [eventId, countingDetails, getDetailsByEventId, currentPage, itemsPerPage]);

    // Start counting
    const handleStartCounting = () => {
        if (!currentEvent) return;

        // Get ALL stock items for counting
        // ABC group is metadata only, used for prioritization/reporting
        const itemsToCount = stockData;

        // Create counting details from ALL stock data
        const newDetails: CountingDetail[] = itemsToCount.map((item) => ({
            id: crypto.randomUUID(),
            counting_event_id: eventId,
            product_key: `${item.Marka}-${item["Ürün Kodu"]}-${item["Renk Kodu"]}-${item.Beden}`,
            marka: item.Marka,
            urun_kodu: item["Ürün Kodu"],
            urun_grubu: item["Ürün Grubu"] || "",
            renk_kodu: item["Renk Kodu"],
            beden: item.Beden,
            barkod: item.Barkod,
            location: "Ana Depo", // TODO: Add location field to StockItem
            system_quantity: parseInt(item.Envanter) || 0,
            counted_quantity: 0, // Will be filled during counting
            discrepancy: 0, // Will be calculated after counting
            counted_by: "current-user", // TODO: Get from auth
            counted_at: new Date(),
            adjustment_status: "PENDING",
            created_at: new Date(),
            updated_at: new Date(),
        }));

        // Add all details to store
        newDetails.forEach((detail) => {
            addCountingDetail(detail);
        });

        // Update event
        updateCountingEvent(eventId, {
            status: "IN_PROGRESS",
            started_at: new Date(),
            total_items_planned: newDetails.length,
        });
    };

    // Handle barcode scan
    const handleBarcodeScan = (barcode: string) => {
        console.log("🔍 Barcode scanned:", barcode);
        console.log("📊 Available details:", eventDetails.length);
        if (eventDetails.length > 0) {
            console.log("🏷️ Sample barcodes:", eventDetails.slice(0, 5).map(d => d.barkod));
        } else {
            console.warn("⚠️ No details loaded! Did you click 'Sayımı Başlat'?");
        }

        // Find the detail with this barcode
        const detail = eventDetails.find((d) => d.barkod === barcode);

        if (!detail) {
            console.error("❌ Barcode not found:", barcode);
            alert(`❌ Barkod bulunamadı: ${barcode}\n\n📊 Durum:\n• Toplam ürün: ${eventDetails.length}\n• Önce "Sayımı Başlat" butonuna tıkladınız mı?`);
            return;
        }

        console.log("✅ Detail found:", detail.marka, detail.urun_kodu);

        // Increment counted quantity
        const newCountedQty = detail.counted_quantity + 1;
        const newDiscrepancy = newCountedQty - detail.system_quantity;

        updateCountingDetail(detail.id, {
            counted_quantity: newCountedQty,
            discrepancy: newDiscrepancy,
        });

        // Update event statistics
        const updatedDetails = eventDetails.map((d) =>
            d.id === detail.id
                ? { ...d, counted_quantity: newCountedQty, discrepancy: newDiscrepancy }
                : d
        );

        const totalCounted = updatedDetails.filter((d) => d.counted_quantity > 0).length;
        const discrepancies = updatedDetails.filter((d) => d.discrepancy !== 0).length;

        updateCountingEvent(eventId, {
            total_items_counted: totalCounted,
            discrepancy_count: discrepancies,
        });

        console.log(`✅ Sayıldı: ${detail.marka} ${detail.urun_kodu} - ${newCountedQty} adet`);
    };

    // Handle manual count input
    const handleManualCount = (detailId: string, quantity: number) => {
        const detail = eventDetails.find((d) => d.id === detailId);
        if (!detail) return;

        // Ensure non-negative
        const newCountedQty = Math.max(0, quantity || 0);
        const newDiscrepancy = newCountedQty - detail.system_quantity;

        updateCountingDetail(detailId, {
            counted_quantity: newCountedQty,
            discrepancy: newDiscrepancy,
        });

        // Update event statistics
        const updatedDetails = eventDetails.map((d) =>
            d.id === detailId
                ? { ...d, counted_quantity: newCountedQty, discrepancy: newDiscrepancy }
                : d
        );

        const totalCounted = updatedDetails.filter((d) => d.counted_quantity > 0).length;
        const discrepancies = updatedDetails.filter((d) => d.discrepancy !== 0).length;

        updateCountingEvent(eventId, {
            total_items_counted: totalCounted,
            discrepancy_count: discrepancies,
        });
    };

    // Complete counting
    const handleCompleteCounting = () => {
        if (!currentEvent) return;

        updateCountingEvent(eventId, {
            status: "COMPLETED",
            completed_at: new Date(),
        });
    };

    if (!currentEvent) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Sayım bulunamadı</h3>
                    <p className="text-muted-foreground mt-2">
                        Bu sayım mevcut değil veya silinmiş olabilir.
                    </p>
                    <Link href="/stock-counting">
                        <Button className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Sayım Listesine Dön
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const completionRate =
        currentEvent.total_items_planned > 0
            ? (currentEvent.total_items_counted / currentEvent.total_items_planned) * 100
            : 0;

    const accuracyRate =
        eventDetails.length > 0
            ? ((eventDetails.length - currentEvent.discrepancy_count) / eventDetails.length) * 100
            : 100;

    // Filter details based on search query
    const filteredDetails = eventDetails.filter((detail) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            detail.barkod?.toLowerCase().includes(query) ||
            detail.marka.toLowerCase().includes(query) ||
            detail.urun_kodu.toLowerCase().includes(query) ||
            detail.renk_kodu.toLowerCase().includes(query) ||
            detail.beden.toLowerCase().includes(query)
        );
    });

    // Paginated filtered details
    const paginatedDetails = filteredDetails.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/stock-counting">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{currentEvent.event_code}</h1>
                    <p className="text-muted-foreground mt-1">
                        {currentEvent.event_type === "FULL" && "Tam Sayım"}
                        {currentEvent.event_type === "CYCLE" && `Döngüsel Sayım - ${currentEvent.abc_group} Grubu`}
                        {currentEvent.event_type === "SPOT" && "Spot Sayım"}
                    </p>
                </div>
                <div className="flex gap-2">
                    {currentEvent.status === "PLANNED" && (
                        <Button onClick={handleStartCounting} className="bg-green-600 hover:bg-green-700">
                            <Play className="mr-2 h-4 w-4" />
                            Sayımı Başlat
                        </Button>
                    )}
                    {currentEvent.status === "IN_PROGRESS" && (
                        <Button onClick={handleCompleteCounting} className="bg-blue-600 hover:bg-blue-700">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Sayımı Tamamla
                        </Button>
                    )}
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Durum
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge
                            className={
                                currentEvent.status === "PLANNED"
                                    ? "bg-blue-100 text-blue-700"
                                    : currentEvent.status === "IN_PROGRESS"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : currentEvent.status === "COMPLETED"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                            }
                        >
                            {currentEvent.status === "PLANNED" && "Planlandı"}
                            {currentEvent.status === "IN_PROGRESS" && "Devam Ediyor"}
                            {currentEvent.status === "COMPLETED" && "Tamamlandı"}
                            {currentEvent.status === "CANCELLED" && "İptal Edildi"}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            İlerleme
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>{currentEvent.total_items_counted} / {currentEvent.total_items_planned}</span>
                                <span className="font-medium">{completionRate.toFixed(0)}%</span>
                            </div>
                            <Progress value={completionRate} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Doğruluk
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {accuracyRate.toFixed(1)}%
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Farklar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {currentEvent.discrepancy_count}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Barcode Scan */}
            <Card>
                <CardHeader>
                    <CardTitle>Ürün Sayımı</CardTitle>
                    <CardDescription>
                        Barkodu buraya okutun veya arama yapın
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                            <Input
                                placeholder="Barkod okuyucu ile tarayın veya arama yapın (marka, ürün kodu, barkod)..."
                                value={searchQuery}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchQuery(value);

                                    // Auto-scan when barcode length is reached (typically 13 digits)
                                    // Only if not already searching (no spaces, all numeric)
                                    if (value.length >= 13 && /^\d+$/.test(value)) {
                                        handleBarcodeScan(value);
                                        // Clear after short delay
                                        setTimeout(() => setSearchQuery(""), 300);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    // Also allow manual Enter press
                                    if (e.key === "Enter" && searchQuery.trim()) {
                                        // If numeric and long enough, treat as barcode
                                        if (/^\d+$/.test(searchQuery.trim())) {
                                            handleBarcodeScan(searchQuery.trim());
                                            setSearchQuery("");
                                        }
                                        // Otherwise just search
                                    }
                                    // Clear on Escape
                                    if (e.key === "Escape") {
                                        setSearchQuery("");
                                    }
                                }}
                                className="pl-9 text-lg font-mono"
                                autoFocus
                            />
                            {searchQuery && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                    {filteredDetails.length} sonuç
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground">
                                Toplam: {eventDetails.length}
                            </span>
                            <span className="text-xs text-green-600 font-medium">
                                Sayılan: {eventDetails.filter(d => d.counted_quantity > 0).length}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Items Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Sayım Detayları</CardTitle>
                            <CardDescription>
                                {searchQuery ? `${filteredDetails.length} / ` : ""}{eventDetails.length} ürün
                            </CardDescription>
                        </div>
                        {filteredDetails.length > itemsPerPage && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                Sayfa {currentPage} / {Math.ceil(filteredDetails.length / itemsPerPage)}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredDetails.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">
                                {searchQuery ? "Sonuç bulunamadı" : "Henüz ürün eklenmedi"}
                            </h3>
                            <p className="text-muted-foreground mt-2">
                                {searchQuery
                                    ? "Arama kriterlerinizi değiştirip tekrar deneyin"
                                    : "Sayım başladığında ürünler listelenecek"
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ürün</TableHead>
                                        <TableHead>Barkod</TableHead>
                                        <TableHead>Sistem</TableHead>
                                        <TableHead>Sayılan</TableHead>
                                        <TableHead>Fark</TableHead>
                                        <TableHead>Durum</TableHead>
                                        <TableHead className="text-right">İşlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedDetails.map((detail) => {
                                        const severity = getDiscrepancySeverity(
                                            detail.system_quantity,
                                            detail.counted_quantity
                                        );
                                        const color = getDiscrepancyColor(severity);

                                        return (
                                            <TableRow key={detail.id}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div>{detail.marka}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {detail.urun_kodu} - {detail.renk_kodu} - {detail.beden}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    {detail.barkod || "-"}
                                                </TableCell>
                                                <TableCell>{detail.system_quantity}</TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={detail.counted_quantity}
                                                        onChange={(e) => handleManualCount(detail.id, parseInt(e.target.value) || 0)}
                                                        className="w-20 text-center"
                                                        onClick={(e) => (e.target as HTMLInputElement).select()}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`font-medium ${detail.discrepancy > 0
                                                            ? "text-green-600"
                                                            : detail.discrepancy < 0
                                                                ? "text-red-600"
                                                                : "text-muted-foreground"
                                                            }`}
                                                    >
                                                        {detail.discrepancy > 0 && "+"}
                                                        {detail.discrepancy}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            severity === "LOW"
                                                                ? "bg-green-50 text-green-700 border-green-200"
                                                                : severity === "MEDIUM"
                                                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                                    : "bg-red-50 text-red-700 border-red-200"
                                                        }
                                                    >
                                                        {detail.adjustment_status === "PENDING" && "Bekliyor"}
                                                        {detail.adjustment_status === "APPROVED" && "Onaylandı"}
                                                        {detail.adjustment_status === "ADJUSTED" && "Düzeltildi"}
                                                        {detail.adjustment_status === "REJECTED" && "Reddedildi"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        Detay
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>

                            {/* Pagination Controls */}
                            {filteredDetails.length > itemsPerPage && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredDetails.length)} / {filteredDetails.length} ürün
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Önceki
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            Sayfa {currentPage} / {Math.ceil(filteredDetails.length / itemsPerPage)}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredDetails.length / itemsPerPage), p + 1))}
                                            disabled={currentPage === Math.ceil(filteredDetails.length / itemsPerPage)}
                                        >
                                            Sonraki
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
