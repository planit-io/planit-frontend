"use client";

import { ReactNode } from "react";
import { UserMenu } from "@/components/user/user-menu";

type Props = {
    title?: string;
    leftSlot?: ReactNode;
    rightSlot?: ReactNode;
    bottomSlot?: ReactNode;
    children: ReactNode;
};

export function AppShell({
    title = "PlanIt",
    leftSlot,
    rightSlot,
    bottomSlot,
    children,
}: Props) {
    const hasBottom = !!bottomSlot;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Background glow */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
                <div className="absolute top-32 right-[-80px] h-72 w-72 rounded-full bg-purple-200/25 blur-3xl" />
            </div>

            {/* Top bar */}
            <div className="sticky top-0 z-40 border-b border-gray-100 bg-white/70 backdrop-blur">
                <div className="max-w-5xl mx-auto px-3 md:px-4 py-3 flex items-center justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-2 min-w-0">
                        {leftSlot}
                        <div className="text-sm font-semibold text-gray-800 truncate">{title}</div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        {rightSlot}
                        <div className="rounded-2xl border bg-white shadow-sm px-1 py-1">
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div
                className={`max-w-5xl mx-auto px-3 md:px-4 py-5 md:py-7 ${hasBottom ? "pb-[calc(96px+env(safe-area-inset-bottom))]" : ""
                    }`}
            >
                {children}
            </div>

            {/* Bottom slot */}
            {hasBottom && (
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <div className="mx-auto max-w-5xl px-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
                        {bottomSlot}
                    </div>
                </div>
            )}
        </div>
    );
}