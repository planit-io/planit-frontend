"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LogOut, UserRound, MoreVertical, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getKeycloakLogoutUrl } from "@/lib/auth"; // <-- metti il path giusto
import { useI18n } from "@/contexts/i18n-context";

export function UserMenu() {
    const { data: session } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { t } = useI18n();

    const [open, setOpen] = useState(false);

    const name = useMemo(() => {
        const n = session?.user?.name;
        const e = session?.user?.email;
        return n || (e ? e.split("@")[0] : "User");
    }, [session?.user?.name, session?.user?.email]);

    const initials = useMemo(() => name.slice(0, 2).toUpperCase(), [name]);

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false });
            queryClient.clear();

            const idToken = (session as any)?.idToken as string | undefined;
            if (idToken) {
                window.location.assign(getKeycloakLogoutUrl(idToken));
                return;
            }
            router.push("/login");
        } catch (e) {
            console.error("Logout error:", e);
            router.push("/login");
        }
    };

    // ESC to close
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        if (open) window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]);

    return (
        <div className="relative">
            {/* Desktop trigger (dropdown) */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="hidden sm:inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-xs">
                    {initials}
                </span>
                <span className="max-w-[160px] truncate">{name}</span>
                <MoreVertical size={16} className="text-gray-400" />
            </button>

            {/* Mobile trigger (icon only) */}
            <button
                onClick={() => setOpen(true)}
                className="sm:hidden inline-flex items-center justify-center rounded-2xl border bg-white h-11 w-11 hover:bg-gray-50 transition"
                aria-label="Open menu"
            >
                <MoreVertical size={18} className="text-gray-600" />
            </button>

            {/* Desktop dropdown */}
            {open && (
                <>
                    {/* overlay */}
                    <button
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                    />

                    {/* Dropdown for >= sm */}
                    <div className="hidden sm:block absolute right-0 mt-2 z-50 w-60 rounded-2xl border bg-white shadow-xl overflow-hidden">
                        <div className="px-4 py-3 border-b">
                            <div className="text-sm font-semibold text-gray-900">{name}</div>
                            {session?.user?.email && (
                                <div className="text-xs text-gray-500">{session.user.email}</div>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setOpen(false);
                                router.push("/profile"); // opzionale
                            }}
                            className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <UserRound size={16} className="text-gray-400" />
                            {t("profile") || "Profile"}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            <LogOut size={16} />
                            {t("logout") || "Logout"}
                        </button>
                    </div>

                    {/* Bottom sheet for mobile */}
                    <div className="sm:hidden fixed inset-0 z-50">
                        <button
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setOpen(false)}
                            aria-label="Close sheet"
                        />

                        <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white border-t shadow-2xl p-4 animate-in slide-in-from-bottom-6 duration-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white text-xs">
                                        {initials}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">{name}</div>
                                        {session?.user?.email && (
                                            <div className="text-xs text-gray-500">{session.user.email}</div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setOpen(false)}
                                    className="h-10 w-10 inline-flex items-center justify-center rounded-2xl hover:bg-gray-50"
                                    aria-label="Close"
                                >
                                    <X size={18} className="text-gray-600" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-2">
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        router.push("/profile"); // opzionale
                                    }}
                                    className="w-full rounded-2xl border px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <UserRound size={16} className="text-gray-500" />
                                    {t("profile") || "Profile"}
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 flex items-center justify-center gap-2"
                                >
                                    <LogOut size={16} />
                                    {t("logout") || "Logout"}
                                </button>
                            </div>

                            <div className="mt-3 text-center text-xs text-gray-400">
                                {t("swipe_down_hint") || "Tap outside to close"}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}