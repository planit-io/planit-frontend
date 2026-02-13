"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    LayoutDashboard,
    Map,
    LogOut,
    Menu,
    X,
    User,
    Plus
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Trips", href: "/dashboard", icon: Map },
    ];

    const handleLogout = async () => {
        // Get the ID token from session for Keycloak logout
        const idToken = session?.idToken;

        if (idToken) {
            // Build Keycloak logout URL
            const keycloakIssuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER || "http://localhost:8080/realms/planit";
            const logoutUrl = `${keycloakIssuer}/protocol/openid-connect/logout`;
            const redirectUri = window.location.origin;

            // First sign out from NextAuth (clears local session)
            await signOut({ redirect: false });

            // Then redirect to Keycloak to clear SSO session
            window.location.href = `${logoutUrl}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`;
        } else {
            // Fallback to regular logout if no idToken
            await signOut({ callbackUrl: "/" });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                                    <div className="relative">
                                        <Map className="h-6 w-6" />
                                    </div>
                                    PlanIt
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={cn(
                                                isActive
                                                    ? "border-indigo-500 text-gray-900"
                                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                                "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                            )}
                                        >
                                            <item.icon className="w-4 h-4 mr-2" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
                            <Link
                                href="/trips/new"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Trip
                            </Link>

                            <div className="relative ml-3 flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium text-gray-900">
                                        {session?.user?.name || "Traveler"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {session?.user?.email}
                                    </span>
                                </div>
                                {session?.user?.image ? (
                                    <img
                                        className="h-8 w-8 rounded-full bg-gray-100"
                                        src={session.user.image}
                                        alt=""
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <User className="h-5 w-5" />
                                    </div>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <X className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={cn("sm:hidden", isMobileMenuOpen ? "block" : "hidden")}>
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        isActive
                                            ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                                            : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700",
                                        "block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon className="w-4 h-4 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                        <Link
                            href="/trips/new"
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 flex items-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Plus className="w-4 h-4 mr-3" />
                            New Trip
                        </Link>
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                {session?.user?.image ? (
                                    <img
                                        className="h-10 w-10 rounded-full"
                                        src={session.user.image}
                                        alt=""
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <User className="h-6 w-6" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">
                                    {session?.user?.name || "Traveler"}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {session?.user?.email}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <LogOut className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
