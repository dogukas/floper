"use client"

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Hook to detect page navigation loading state
 * Shows loading when route changes
 */
export function usePageLoading() {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Start loading
        setIsLoading(true);

        // Stop loading after a short delay (simulating page load)
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timeout);
    }, [pathname, searchParams]);

    return isLoading;
}
