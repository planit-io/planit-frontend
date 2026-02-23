import { useQuery } from "@tanstack/react-query";
import { travelService } from "@/services/travel-service";

export const DescriptionTab = ({ travelId }: { travelId: number }) => {

    const { data: travel, isLoading } = useQuery({
        queryKey: ["travel", travelId],
        queryFn: () => travelService.getById(travelId),
        enabled: !!travelId,
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading description...</div>;

    return (
        <div className="space-y-6 pb-20 max-h-[70vh] overflow-y-auto">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600">{travel?.description}</p>
            </div>
        </div>
    );
}
