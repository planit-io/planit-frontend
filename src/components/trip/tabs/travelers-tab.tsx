import { useQuery } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { travelService } from "@/services/travel-service";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/i18n-context";

export const TravelersTab = ({ travelId, onAddTraveler }: { travelId: number, onAddTraveler: () => void }) => {
    const { data: travelers, isLoading, isError } = useQuery({
        queryKey: ["travelers"],
        queryFn: () => travelService.getTravelers(),
    });

    const tripTravelers = travelers?.filter(t => t.travelId === travelId) || [];
    const { t } = useI18n();

    if (isLoading) return <div className="p-8 text-center text-gray-500">{t("loadingTravelers")}</div>;

    if (isError) return (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">
            Failed to load travelers.
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t("travelers")}</h2>
                    <p className="text-gray-500 text-sm">
                        {tripTravelers.length} {tripTravelers.length === 1 ? 'person' : 'people'}
                    </p>
                </div>
                <button
                    onClick={onAddTraveler}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium text-sm"
                >
                    <Plus size={16} /> {t("addTraveler")}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tripTravelers.map((traveler) => (
                    <div key={traveler.id || traveler.username} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {traveler.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{traveler.username}</h3>
                            <span className={cn(
                                "text-xs font-medium px-2 py-0.5 rounded-full border",
                                traveler.role === 'ADMIN'
                                    ? "bg-purple-50 text-purple-700 border-purple-100"
                                    : "bg-indigo-50 text-indigo-700 border-indigo-100"
                            )}>
                                {traveler.role || 'MEMBER'}
                            </span>
                        </div>
                    </div>
                ))}

                {tripTravelers.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
                        <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                            <Users size={24} />
                        </div>
                        <p className="text-gray-500">{t("noTravelers")}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
