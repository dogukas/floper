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
} from "lucide-react";

import { useCountingStore } from "@/store/useCountingStore";
import { useStockStore } from "@/store/useStockStore";
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
    } = useCountingStore();

    const { stockData } = useStockStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [currentEvent, setCurrentEvent] = useState<CountingEvent | null>(null);
    const [eventDetails, setEventDetails] = useState<CountingDetail[]>([]);

    // Load event and details
    useEffect(() => {
        const event = countingEvents.find((e) => e.id === eventId);
        if (event) {
            setCurrentEvent(event);
            setEventDetails(getDetailsByEventId(eventId));
        }
    }, [eventId, countingEvents, getDetailsByEventId]);

    // Start counting
    const handleStartCounting = () => {
        if (!currentEvent) return;

        updateCountingEvent(eventId, {
            status: "IN_PROGRESS",
            started_at: new Date(),
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

            {/* Search and Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Ürün Sayımı</CardTitle>
                    <CardDescription>
                        Ürünleri tarayın veya manuel olarak sayın
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Ürün ara (barkod, isim, kod)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button variant="outline">
                            <ScanBarcode className="mr-2 h-4 w-4" />
                            Barkod Tara
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Items Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Sayım Detayları</CardTitle>
                    <CardDescription>
                        {eventDetails.length} ürün listelendi
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {eventDetails.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">Henüz ürün eklenmedi</h3>
                            <p className="text-muted-foreground mt-2">
                                Sayım başladığında ürünler listelenecek
                            </p>
                        </div>
                    ) : (
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
                                {eventDetails.map((detail) => {
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
                                            <TableCell>{detail.counted_quantity}</TableCell>
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
