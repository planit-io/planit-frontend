"use client";

import { useQuery } from "@tanstack/react-query";
import { costService } from "@/services/cost-service";
import { travelService } from "@/services/travel-service";
import { CostDTO } from "@/types/dtos";
import { ArrowRight, TrendingUp, TrendingDown, Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface Balance {
    username: string;
    amount: number;
}

interface Transaction {
    from: string;
    to: string;
    amount: number;
}

export default function SettlementCalculator({ travelId }: { travelId: number }) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const { data: costs, isLoading } = useQuery({
        queryKey: ["costs", travelId],
        queryFn: () => costService.getCosts(travelId),
    });

    const { data: travelers } = useQuery({
        queryKey: ["travelers"],
        queryFn: () => travelService.getTravelers(),
    });

    const tripTravelers = travelers?.filter((t) => t.travelId === travelId) || [];

    // Calculate balances: positive = owed money, negative = owes money
    const calculateBalances = (): Balance[] => {
        if (!costs || costs.length === 0) return [];

        const balanceMap: { [username: string]: number } = {};

        // Initialize all travelers
        tripTravelers.forEach(t => {
            balanceMap[t.username] = 0;
        });

        // Process each cost
        costs.forEach((cost: CostDTO) => {
            // Person who paid gets credited
            if (cost.payedBy) {
                balanceMap[cost.payedBy] = (balanceMap[cost.payedBy] || 0) + (cost.totalAmount || 0);
            }

            // Each person in costUnitList gets debited
            cost.costUnitList?.forEach(unit => {
                balanceMap[unit.travelerUsername] = (balanceMap[unit.travelerUsername] || 0) - (unit.amount || 0);
            });
        });

        return Object.entries(balanceMap)
            .map(([username, amount]) => ({ username, amount }))
            .filter(b => Math.abs(b.amount) > 0.01); // Filter out negligible amounts
    };

    // Simplify transactions using greedy algorithm
    const calculateTransactions = (): Transaction[] => {
        const balances = calculateBalances();
        if (balances.length === 0) return [];

        // Separate into creditors (positive) and debtors (negative)
        const creditors = balances.filter(b => b.amount > 0.01).sort((a, b) => b.amount - a.amount);
        const debtors = balances.filter(b => b.amount < -0.01).map(b => ({ ...b, amount: Math.abs(b.amount) })).sort((a, b) => b.amount - a.amount);

        const transactions: Transaction[] = [];
        let i = 0, j = 0;

        while (i < creditors.length && j < debtors.length) {
            const creditor = creditors[i];
            const debtor = debtors[j];

            const amount = Math.min(creditor.amount, debtor.amount);

            transactions.push({
                from: debtor.username,
                to: creditor.username,
                amount: parseFloat(amount.toFixed(2))
            });

            creditor.amount -= amount;
            debtor.amount -= amount;

            if (creditor.amount < 0.01) i++;
            if (debtor.amount < 0.01) j++;
        }

        return transactions;
    };

    const balances = calculateBalances();
    const transactions = calculateTransactions();

    const copyTransaction = async (transaction: Transaction, index: number) => {
        const text = `${transaction.from} → ${transaction.to}: €${transaction.amount.toFixed(2)}`;
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!costs || costs.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No expenses yet. Add expenses to see settlement details.</p>
            </div>
        );
    }

    if (balances.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">All Settled!</h3>
                <p className="text-gray-500">Everyone has paid their fair share.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Balance Summary */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {balances.map((balance) => (
                        <div
                            key={balance.username}
                            className={`p-4 rounded-xl border-2 ${balance.amount > 0
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${balance.amount > 0
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}>
                                        {balance.username.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-gray-900">{balance.username}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {balance.amount > 0 ? (
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <TrendingDown className="w-5 h-5 text-red-600" />
                                    )}
                                    <span className={`font-bold text-lg ${balance.amount > 0 ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                        €{Math.abs(balance.amount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                {balance.amount > 0 ? 'Gets back' : 'Owes'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Suggested Transactions */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Payments</h3>
                <p className="text-sm text-gray-600 mb-4">
                    These {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} will settle all balances:
                </p>
                <div className="space-y-3">
                    {transactions.map((transaction, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                        {transaction.from.substring(0, 2).toUpperCase()}
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400" />
                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                                        {transaction.to.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">
                                            {transaction.from} → {transaction.to}
                                        </p>
                                        <p className="text-sm text-gray-500">Payment to settle balance</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-xl text-indigo-600">
                                        €{transaction.amount.toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => copyTransaction(transaction, index)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Copy to clipboard"
                                    >
                                        {copiedIndex === index ? (
                                            <Check className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
