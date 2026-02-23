import Link from "next/link";
import { ArrowLeft, Edit, Calendar, Map } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

export const TripHeader = ({ travel }: { travel: any }) => {
    const { t } = useI18n();

    return (
        <div className="h-56 md:h-80 bg-gray-900 relative">
            {travel.imageUrl ? (
                <img src={travel.imageUrl} alt={travel.destination} className="w-full h-full object-cover opacity-60" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 opacity-90" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent flex flex-col justify-end p-4 md:p-10">
                {/* Top action links */}
                <div className="flex gap-4 mb-4 md:mb-6">
                    <Link href="/dashboard" className="text-white/80 hover:text-white flex items-center gap-1.5 w-fit transition-colors text-sm md:text-base">
                        <ArrowLeft size={18} /> <span className="hidden xs:inline">{t("backToDashboard")}</span><span className="xs:hidden">{t("back")}</span>
                    </Link>
                    <Link href={`/trips/${travel.id}/edit`} className="text-white/80 hover:text-white flex items-center gap-1.5 w-fit transition-colors text-sm md:text-base">
                        <Edit size={18} /> {t("editTrip")}
                    </Link>
                </div>
                <h1 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-3 tracking-tight line-clamp-2">{travel.destination}</h1>
                <p className="text-base md:text-xl text-white/80 font-light mb-3 md:mb-4 line-clamp-1">{travel.name}</p>
                <div className="flex flex-wrap items-center gap-2 md:gap-6 text-white/90">
                    <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-sm text-xs md:text-sm border border-white/10">
                        <Calendar size={14} /> {travel.startDate} – {travel.endDate}
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-sm text-xs md:text-sm border border-white/10">
                        <Map size={14} /> {travel.days} {t("days")}
                    </span>
                </div>
            </div>
        </div>
    );
};
