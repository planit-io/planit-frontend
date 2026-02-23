"use client";

import { createContext, useContext, useMemo } from "react";
import { useSession } from "next-auth/react";
import en, { TranslationKey } from "@/lib/locales/en";
import it from "@/lib/locales/it";
import fr from "@/lib/locales/fr";
import de from "@/lib/locales/de";
import es from "@/lib/locales/es";

export type Locale = "en" | "us" | "it" | "fr" | "de" | "es";

const localeMap: Record<Locale, Partial<Record<TranslationKey, string>>> = {
    en, us: {}, it, fr, de, es,
};

/**
 * Decode a JWT token without verifying the signature (safe client-side).
 * Reads the `locale` or `language` claim from the Keycloak access token.
 */
function decodeJwtLocale(accessToken: string | undefined): Locale {
    if (!accessToken) return "en";
    try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const lang = (payload?.locale || payload?.language || "en")
            .toLowerCase()
            .split("-")[0] as string;
        const supported: Locale[] = ["en", "us", "it", "fr", "de", "es"];
        return supported.includes(lang as Locale) ? (lang as Locale) : "en";
    } catch {
        return "en";
    }
}

interface I18nContextValue {
    locale: Locale;
    t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue>({
    locale: "en",
    t: (key) => en[key],
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    const locale = useMemo(() => decodeJwtLocale(session?.accessToken), [session?.accessToken]);

    const t = useMemo(() => {
        const translations = localeMap[locale] ?? {};
        return (key: TranslationKey): string =>
            (translations[key] ?? en[key]) as string; // fallback to English
    }, [locale]);

    return (
        <I18nContext.Provider value={{ locale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    return useContext(I18nContext);
}
