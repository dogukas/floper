/**
 * Stok Sayım (Inventory Counting) Page
 * Ana stok sayım yönetim sayfası
 */
"use client";

// ==========================================
// REACT & HOOKS
// ==========================================
import { useState, useEffect } from "react";
import Link from "next/link";

// ==========================================
// UI COMPONENTS
// ==========================================
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// ==========================================
// ICONS
// ==========================================
import {
    Plus,
    Search,
    Filter,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    FileText,
    ListChecks,
} from "lucide-react";

// ==========================================
// INTERNAL
// ==========================================
import { useCountingStore } from "@/store/useCountingStore";
import { NewCountingDialog } from "@/components/counting/NewCountingDialog";
import type { CountingEvent, CountingStatus } from "@/types/counting";

// ==========================================
// TYPES
// ==========================================

const STATUS_CONFIG: Record<CountingStatus, { label: string; color: string; icon: React.ReactNode }> = {
    PLANNED: {
        label: 'Planlandı',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: <Calendar className="h-3 w-3" />,
    },
    IN_PROGRESS: {
        label: 'Devam Ediyor',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: <Clock className="h-3 w-3" />,
    },
    COMPLETED: {
        label: 'Tamamlandı',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: <CheckCircle2 className="h-3 w-3" />,
    },
    CANCELLED: {
        label: 'İptal Edildi',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: <XCircle className="h-3 w-3" />,
    },
};

// ==========================================
// COMPONENT
// ==========================================

export default function StockCountingPage() {
    const {
        countingEvents,
        searchQuery,
        statusFilter,
        setSearchQuery,
        setStatusFilter,
        getFilteredEvents,
    } = useCountingStore();

    const [filteredEvents, setFilteredEvents] = useState<CountingEvent[]>([]);

    // Filter events when search or filter changes
    useEffect(() => {
        setFilteredEvents(getFilteredEvents());
    }, [searchQuery, statusFilter, countingEvents, getFilteredEvents]);

    // Statistics
    const stats = {
        total: countingEvents.length,
        planned: countingEvents.filter((e) => e.status === 'PLANNED').length,
        inProgress: countingEvents.filter((e) => e.status === 'IN_PROGRESS').length,
        completed: countingEvents.filter((e) => e.status === 'COMPLETED').length,
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Stok Sayım</h1>
                    <p className="text-muted-foreground mt-1">
                        Envanter sayımlarını yönetin ve takip edin
                    </p>
                </div>
                <NewCountingDialog
                    trigger={
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Sayım Oluştur
                        </Button>
                    }
                />
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-t-4 border-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Toplam Sayım
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-yellow-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Devam Eden
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-700">{stats.inProgress}</div>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Planlı
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-700">{stats.planned}</div>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tamamlanan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filtreler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Sayım kodu veya not ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Tüm Durumlar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tüm Durumlar</SelectItem>
                                <SelectItem value="PLANNED">Planlandı</SelectItem>
                                <SelectItem value="IN_PROGRESS">Devam Ediyor</SelectItem>
                                <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                                <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Events List */}
            <Card>
                <CardHeader>
                    <CardTitle>Sayım Listesi</CardTitle>
                    <CardDescription>
                        {filteredEvents.length} sayım bulundu
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">Henüz sayım yok</h3>
                            <p className="text-muted-foreground mt-2">
                                Başlamak için yeni bir sayım oluşturun
                            </p>
                            <NewCountingDialog
                                trigger={
                                    <Button className="mt-4">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Yeni Sayım Oluştur
                                    </Button>
                                }
                            />
                        </div>
                    ) : (
                        <ScrollArea className="h-[500px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sayım Kodu</TableHead>
                                        <TableHead>Tip</TableHead>
                                        <TableHead>Durum</TableHead>
                                        <TableHead>Tarih</TableHead>
                                        <TableHead>İlerleme</TableHead>
                                        <TableHead>Farklar</TableHead>
                                        <TableHead className="text-right">İşlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEvents.map((event) => {
                                        const statusConfig = STATUS_CONFIG[event.status];
                                        const completionRate =
                                            event.total_items_planned > 0
                                                ? (event.total_items_counted / event.total_items_planned) * 100
                                                : 0;

                                        return (
                                            <TableRow key={event.id}>
                                                <TableCell className="font-medium">
                                                    <Link
                                                        href={`/stock-counting/${event.id}`}
                                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                                    >
                                                        {event.event_code}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {event.event_type === 'FULL' && 'Tam Sayım'}
                                                        {event.event_type === 'CYCLE' && 'Döngüsel'}
                                                        {event.event_type === 'SPOT' && 'Spot Sayım'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`${statusConfig.color} border flex items-center gap-1 w-fit`}
                                                    >
                                                        {statusConfig.icon}
                                                        {statusConfig.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(event.scheduled_date).toLocaleDateString('tr-TR')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">
                                                            {event.total_items_counted}/{event.total_items_planned}
                                                        </span>
                                                        <span className="text-sm font-medium">
                                                            ({completionRate.toFixed(0)}%)
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {event.discrepancy_count > 0 ? (
                                                        <Badge variant="destructive">{event.discrepancy_count}</Badge>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
