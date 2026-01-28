"use client"

import { Inter } from "next/font/google";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { usePageLoading } from "@/hooks/usePageLoading";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isLoading = usePageLoading();

    return (
        <>
            <LoadingOverlay isLoading={isLoading} />
            <div className="flex">
                <Sidebar />
                <main className="flex-1">{children}</main>
            </div>
        </>
    );
}
