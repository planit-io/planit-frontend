"use client";

import { useQuery } from "@tanstack/react-query";
import { travelService } from "@/services/travel-service";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, DollarSign, Map, Users, Plus, CheckCircle2, Circle, TrendingUp, ChevronDown, ChevronRight, FileText, Edit, DockIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import React from "react";
import { cn } from "@/lib/utils";
import AddCostModal from "@/components/cost/add-cost-modal";
import AddDayModal from "@/components/day/add-day-modal";
import AddTravelerModal from "@/components/add-traveler-modal";
import AddActivityModal from "@/components/activity/add-activity-modal";
import SettlementCalculator from "@/components/cost/settlement-calculator";
import { costService } from "@/services/cost-service";
import ActivityDayItem from "@/components/activity/activity-day-item";

// --- Main Page Component ---

export default function TripDetailPage() {
    const params = useParams();
    const travelId = Number(params.travelId);
    const [activeTab, setActiveTab] = useState<"description" | "itinerary" | "expenses" | "settlement" | "travelers" | "documents">("description");
    const [isAddTravelerOpen, setIsAddTravelerOpen] = useState(false);

    const { data: travel, isLoading } = useQuery({
        queryKey: ["travel", travelId],
        queryFn: () => travelService.getById(travelId),
        enabled: !!travelId,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-indigo-100 rounded-full mb-4"></div>
                    <div className="text-indigo-600 font-medium">Loading Trip...</div>
                </div>
            </div>
        );
    }

    if (!travel) return <div className="p-10 text-center">Trip not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Image */}
            <div className="h-64 md:h-80 bg-gray-900 relative">
                {travel.imageUrl ? (
                    <img src={travel.imageUrl} alt={travel.destination} className="w-full h-full object-cover opacity-60" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 opacity-90" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent flex flex-col justify-end p-6 md:p-10">
                    <Link href="/dashboard" className="text-white/80 hover:text-white flex items-center gap-2 mb-6 w-fit transition-colors">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                    <Link href={`/trips/${travelId}/edit`} className="text-white/80 hover:text-white flex items-center gap-2 mb-6 w-fit transition-colors">
                        <Edit size={20} /> Edit Trip
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">{travel.destination}</h1>
                    <p className="text-xl text-white/80 font-light mb-4">{travel.name}</p>
                    <div className="flex items-center gap-6 text-white/90">
                        <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm text-sm border border-white/10">
                            <Calendar size={16} /> {travel.startDate} - {travel.endDate}
                        </span>
                        <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm text-sm border border-white/10">
                            <Map size={16} /> {travel.days} Days
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex overflow-x-auto mb-8">
                    <TabButton
                        active={activeTab === "description"}
                        onClick={() => setActiveTab("description")}
                        icon={<FileText size={18} />}
                        label="Description"
                    />
                    <TabButton
                        active={activeTab === "itinerary"}
                        onClick={() => setActiveTab("itinerary")}
                        icon={<Map size={18} />}
                        label="Itinerary"
                    />
                    <TabButton
                        active={activeTab === "expenses"}
                        onClick={() => setActiveTab("expenses")}
                        icon={<DollarSign size={18} />}
                        label="Expenses"
                    />
                    <TabButton
                        active={activeTab === "settlement"}
                        onClick={() => setActiveTab("settlement")}
                        icon={<TrendingUp size={18} />}
                        label="Settlement"
                    />
                    <TabButton
                        active={activeTab === "travelers"}
                        onClick={() => setActiveTab("travelers")}
                        icon={<Users size={18} />}
                        label="Travelers"
                    />
                    <TabButton
                        active={activeTab === "documents"}
                        onClick={() => setActiveTab("documents")}
                        icon={<DockIcon size={18} />}
                        label="Documents"
                    />
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === "description" && <DescriptionTab travelId={travelId} />}
                    {activeTab === "itinerary" && <ItineraryTab travelId={travelId} />}
                    {activeTab === "expenses" && <ExpensesTab travelId={travelId} />}
                    {activeTab === "settlement" && (
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <SettlementCalculator travelId={travelId} />
                        </div>
                    )}
                    {activeTab === "travelers" && (
                        <TravelersTab
                            travelId={travelId}
                            onAddTraveler={() => setIsAddTravelerOpen(true)}
                        />
                    )}
                    {activeTab === "documents" && <DocumentsTab travelId={travelId} />}
                </div>
            </div>

            <AddTravelerModal
                travelId={travelId}
                isOpen={isAddTravelerOpen}
                onClose={() => setIsAddTravelerOpen(false)}
            />
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap flex-1 justify-center outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                active
                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
        >
            {icon}
            {label}
        </button>
    )
}

// --- Components for Tabs ---
const DescriptionTab = ({ travelId }: { travelId: number }) => {

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

const ItineraryTab = ({ travelId }: { travelId: number }) => {
    const [isAddDayOpen, setIsAddDayOpen] = useState(false);
    const [activeDayId, setActiveDayId] = useState<number | null>(null);

    const { data: days, isLoading } = useQuery({
        queryKey: ["travelDays", travelId],
        queryFn: () => travelService.getDays(travelId),
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading itinerary...</div>;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Itinerary</h2>
                <button
                    onClick={() => setIsAddDayOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium text-sm"
                >
                    <Plus size={16} /> Add Day
                </button>
            </div>

            <div className="grid gap-6 max-h-[50vh] overflow-y-auto">
                {days?.map((day: any) => (
                    <DayCard key={day.id} day={day} travelId={travelId} onAddActivity={() => setActiveDayId(day.id)} />
                ))}

                {days?.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
                        <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                            <Map size={24} />
                        </div>
                        <p className="text-gray-500">No days planned yet. Add your first day!</p>
                    </div>
                )}
            </div>

            <AddDayModal
                travelId={travelId}
                isOpen={isAddDayOpen}
                onClose={() => setIsAddDayOpen(false)}
            />

            <AddActivityModal
                travelId={travelId}
                travelDayId={activeDayId}
                isOpen={!!activeDayId}
                onClose={() => setActiveDayId(null)}
            />
        </div>
    );
};

const DayCard = ({
    day,
    travelId,
    onAddActivity,
}: {
    day: any;
    travelId: number;
    onAddActivity: () => void;
}) => {
    const [open, setOpen] = useState(false);

    const activitiesCount = day.activities?.length ?? 0;

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
            {/* Header (accordion trigger) */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full text-left bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center"
            >
                <div>
                    <h3 className="font-bold text-lg text-gray-900">
                        Day {day.dayNumber}: {day.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                        {day.destination}
                        <span className="ml-2 text-gray-400">• {activitiesCount} activities</span>
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Add activity (shouldn't close the accordion) */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddActivity();
                        }}
                        className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                    >
                        <Plus size={16} /> Activity
                    </button>

                    <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                    />
                </div>
            </button>

            {/* Content (accordion panel) */}
            <div
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="p-2">
                        {day.activities && day.activities.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {day.activities.map((act: any) => (
                                    <ActivityDayItem activity={act} travelId={travelId} dayId={day.id} />
                                ))}
                            </div>
                        ) : (
                            <p className="p-6 text-center text-gray-400 text-sm italic">No activities yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

function ExpensesTab({ travelId }: { travelId: number }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [expandedExpense, setExpandedExpense] = useState<number | null>(null);
    const { data: costs, isLoading } = useQuery({
        queryKey: ["costs", travelId],
        queryFn: () => costService.getCosts(travelId),
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading expenses...</div>;

    const total = costs?.reduce((acc: number, curr: any) => acc + (curr.totalAmount || 0), 0) || 0;
    const currency = costs?.[0]?.currency || "EUR";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
                    <p className="text-gray-500 text-sm">Total: <span className="font-bold text-gray-900">{total.toFixed(2)} {currency}</span></p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium text-sm"
                >
                    <Plus size={16} /> Add Expense
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium whitespace-nowrap w-12"></th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Description</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Paid By</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Split</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {costs?.map((cost: any) => {
                                const isExpanded = expandedExpense === cost.id;
                                const splitCount = cost.costUnitList?.length || 0;

                                return (
                                    <React.Fragment key={cost.id}>
                                        <tr
                                            className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                                            onClick={() => setExpandedExpense(isExpanded ? null : cost.id)}
                                        >
                                            <td className="px-6 py-4">
                                                {splitCount > 1 && (
                                                    isExpanded ? (
                                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                    )
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {cost.reason}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold uppercase">
                                                        {cost.payedBy?.substring(0, 2)}
                                                    </div>
                                                    {cost.payedBy}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {splitCount > 1 ? `${splitCount} people` : '1 person'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                {cost.totalAmount.toFixed(2)} {cost.currency}
                                            </td>
                                        </tr>
                                        {isExpanded && splitCount > 1 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 bg-gray-50/50">
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cost Breakdown</p>
                                                        <div className="grid gap-2">
                                                            {cost.costUnitList?.map((unit: any, idx: number) => (
                                                                <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold uppercase">
                                                                            {unit.travelerUsername?.substring(0, 2)}
                                                                        </div>
                                                                        <span className="text-sm font-medium text-gray-700">
                                                                            {unit.travelerUsername}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-sm font-semibold text-gray-900">
                                                                        {unit.amount?.toFixed(2)} {unit.currency}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                            {costs?.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">
                                        No expenses recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddCostModal travelId={travelId} isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
        </div>
    );
};


const DocumentsTab = ({ travelId }: { travelId: number }) => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Documents</h2>
            <p className="text-gray-600">Documents for this trip will be displayed here.</p>
        </div>
    );
};

const TravelersTab = ({ travelId, onAddTraveler }: { travelId: number, onAddTraveler: () => void }) => {
    const { data: travelers, isLoading, isError } = useQuery({
        queryKey: ["travelers"],
        queryFn: () => travelService.getTravelers(),
    });

    const tripTravelers = travelers?.filter(t => t.travelId === travelId) || [];

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading travelers...</div>;

    if (isError) return (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">
            Failed to load travelers.
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Travel Companions</h2>
                    <p className="text-gray-500 text-sm">
                        {tripTravelers.length} {tripTravelers.length === 1 ? 'person' : 'people'} going
                    </p>
                </div>
                <button
                    onClick={onAddTraveler}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium text-sm"
                >
                    <Plus size={16} /> Add Traveler
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
                        <p className="text-gray-500">No travelers added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
