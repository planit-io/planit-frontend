"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastProvider } from "@/contexts/toast-context";
import { I18nProvider } from "@/contexts/i18n-context";
import ToastContainer from "@/components/toast";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <I18nProvider>
                        {children}
                    </I18nProvider>
                    <ToastContainer />
                </ToastProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
