// English translations — this is the source of truth / fallback for all other locales
const en = {
    // General
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    close: "Close",
    back: "Back",
    // Navigation
    backToDashboard: "Back to Dashboard",
    editTrip: "Edit Trip",
    signOut: "Sign Out",
    // Tabs
    tabDescription: "Description",
    tabItinerary: "Itinerary",
    tabExpenses: "Expenses",
    tabSettlement: "Settlement",
    tabTravelers: "Travelers",
    tabDocuments: "Documents",
    // Trip header
    days: "Days",
    // Itinerary
    itinerary: "Itinerary",
    addDayBefore: "Add Day Before",
    addDayAfter: "Add Day After",
    noDaysYet: "No days planned yet. Add your first day!",
    generalActivities: "General Activities",
    noGeneralActivities: "No general activities added yet.",
    dayAddedSuccess: "Day added successfully!",
    dayAddedError: "Failed to add day",
    // Activities
    addActivity: "Add Activity",
    activityName: "Activity Name",
    activityDescription: "Description",
    activityTime: "Time",
    saveActivity: "Save Activity",
    activityAddedSuccess: "Activity added successfully!",
    activityAddedError: "Failed to add activity.",
    activityDeletedSuccess: "Activity deleted.",
    activityDeletedError: "Failed to delete activity.",
    loadingItinerary: "Loading itinerary...",
    activityNamePlaceholder: "e.g. Visit Colosseum",
    activityDescriptionPlaceholder: "Details, time, location...",
    // Expenses
    expenses: "Expenses",
    total: "Total",
    addExpense: "Add Expense",
    noExpenses: "No expenses recorded yet.",
    type: "Type",
    description: "Description",
    paidBy: "Paid By",
    split: "Split",
    amount: "Amount",
    costBreakdown: "Cost Breakdown",
    refundBreakdown: "Refund Breakdown",
    loadingExpenses: "Loading expenses...",
    // Settlement
    settlement: "Settlement",
    allSettled: "All Settled!",
    allSettledDescription: "No pending settlements — everyone is even.",
    pendingPayments: "pending payment",
    settleButton: "Settle",
    paymentToSettle: "Payment to settle balance",
    settledSuccess: "Settlement recorded!",
    settledError: "Failed to record settlement.",
    refundsApplied: "refund already applied",
    // Travelers
    travelers: "Travelers",
    addTraveler: "Add Traveler",
    username: "Username",
    role: "Role",
    noTravelers: "No travelers yet.",
    loadingTravelers: "Loading travelers...",
    // Documents
    documents: "Documents",
    comingSoon: "Documents section coming soon.",
    // Drag & drop
    dayMoved: "Day moved successfully",
    dayMovedError: "Failed to move day",
    activityMoved: "Activity moved successfully",
    activityMovedError: "Failed to move activity",
    // Add cost modal
    reason: "Reason",
    currency: "Currency",
    payers: "Payers",
    equalSplit: "Equal Split",
};

export type TranslationKey = keyof typeof en;
export type PartialTranslations = Partial<Record<TranslationKey, string>>;
export default en;
