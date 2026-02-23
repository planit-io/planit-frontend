export type Locale = "it" | "en" | "us" | "fr" | "de";

export type TranslationKey =
    // General
    | "loading" | "save" | "cancel" | "add" | "edit" | "delete" | "close" | "back"
    // Navigation
    | "backToDashboard" | "editTrip"
    // Tabs
    | "tabDescription" | "tabItinerary" | "tabExpenses" | "tabSettlement" | "tabTravelers" | "tabDocuments"
    // Trip header
    | "days"
    // Itinerary
    | "itinerary" | "addDayBefore" | "addDayAfter" | "noDaysYet" | "generalActivities"
    | "noGeneralActivities" | "dayAddedSuccess" | "dayAddedError"
    // Activities
    | "addActivity" | "activityName" | "activityDescription" | "activityTime" | "saveActivity"
    | "activityAddedSuccess" | "activityAddedError" | "activityDeletedSuccess" | "activityDeletedError"
    | "loadingItinerary" | "activityNamePlaceholder" | "activityDescriptionPlaceholder"
    // Expenses
    | "expenses" | "total" | "addExpense" | "noExpenses" | "type" | "description"
    | "paidBy" | "split" | "amount" | "costBreakdown" | "refundBreakdown"
    | "loadingExpenses"
    // Settlement
    | "settlement" | "allSettled" | "allSettledDescription" | "pendingPayments"
    | "settleButton" | "paymentToSettle" | "settledSuccess" | "settledError"
    | "refundsApplied"
    // Travelers
    | "travelers" | "addTraveler" | "username" | "role" | "noTravelers" | "loadingTravelers"
    // Documents
    | "documents" | "comingSoon"
    // Days
    | "dayMoved" | "dayMovedError" | "activityMoved" | "activityMovedError"
    // Add cost modal common
    | "reason" | "currency" | "payers" | "equalSplit";

const translations: Record<Locale, Record<TranslationKey, string>> = {
    en: {
        // General
        loading: "Loading...", save: "Save", cancel: "Cancel", add: "Add", edit: "Edit",
        delete: "Delete", close: "Close", back: "Back",
        // Navigation
        backToDashboard: "Back to Dashboard", editTrip: "Edit Trip",
        // Tabs
        tabDescription: "Description", tabItinerary: "Itinerary", tabExpenses: "Expenses",
        tabSettlement: "Settlement", tabTravelers: "Travelers", tabDocuments: "Documents",
        // Trip header
        days: "Days",
        // Itinerary
        itinerary: "Itinerary", addDayBefore: "Add Day Before", addDayAfter: "Add Day After",
        noDaysYet: "No days planned yet. Add your first day!",
        generalActivities: "General Activities", noGeneralActivities: "No general activities added yet.",
        dayAddedSuccess: "Day added successfully!", dayAddedError: "Failed to add day",
        // Activities
        addActivity: "Add Activity", activityName: "Activity Name", activityDescription: "Description",
        activityTime: "Time", saveActivity: "Save Activity",
        activityAddedSuccess: "Activity added successfully!", activityAddedError: "Failed to add activity.",
        activityDeletedSuccess: "Activity deleted.", activityDeletedError: "Failed to delete activity.",
        loadingItinerary: "Loading itinerary...",
        activityNamePlaceholder: "e.g. Visit Colosseum", activityDescriptionPlaceholder: "Details, time, location...",
        // Expenses
        expenses: "Expenses", total: "Total", addExpense: "Add Expense", noExpenses: "No expenses recorded yet.",
        type: "Type", description: "Description", paidBy: "Paid By", split: "Split", amount: "Amount",
        costBreakdown: "Cost Breakdown", refundBreakdown: "Refund Breakdown", loadingExpenses: "Loading expenses...",
        // Settlement
        settlement: "Settlement", allSettled: "All Settled!", allSettledDescription: "No pending settlements — everyone is even.",
        pendingPayments: "pending payment", settleButton: "Settle", paymentToSettle: "Payment to settle balance",
        settledSuccess: "Settlement recorded!", settledError: "Failed to record settlement.",
        refundsApplied: "refund already applied",
        // Travelers
        travelers: "Travelers", addTraveler: "Add Traveler", username: "Username", role: "Role",
        noTravelers: "No travelers yet.", loadingTravelers: "Loading travelers...",
        // Documents
        documents: "Documents", comingSoon: "Documents section coming soon.",
        // Days
        dayMoved: "Day moved successfully", dayMovedError: "Failed to move day",
        activityMoved: "Activity moved successfully", activityMovedError: "Failed to move activity",
        // Add cost
        reason: "Reason", currency: "Currency", payers: "Payers", equalSplit: "Equal Split",
    },
    us: {
        // Same as "en" — US English
        loading: "Loading...", save: "Save", cancel: "Cancel", add: "Add", edit: "Edit",
        delete: "Delete", close: "Close", back: "Back",
        backToDashboard: "Back to Dashboard", editTrip: "Edit Trip",
        tabDescription: "Description", tabItinerary: "Itinerary", tabExpenses: "Expenses",
        tabSettlement: "Settlement", tabTravelers: "Travelers", tabDocuments: "Documents",
        days: "Days",
        itinerary: "Itinerary", addDayBefore: "Add Day Before", addDayAfter: "Add Day After",
        noDaysYet: "No days planned yet. Add your first day!",
        generalActivities: "General Activities", noGeneralActivities: "No general activities added yet.",
        dayAddedSuccess: "Day added successfully!", dayAddedError: "Failed to add day",
        addActivity: "Add Activity", activityName: "Activity Name", activityDescription: "Description",
        activityTime: "Time", saveActivity: "Save Activity",
        activityAddedSuccess: "Activity added successfully!", activityAddedError: "Failed to add activity.",
        activityDeletedSuccess: "Activity deleted.", activityDeletedError: "Failed to delete activity.",
        loadingItinerary: "Loading itinerary...",
        activityNamePlaceholder: "e.g. Visit the Colosseum", activityDescriptionPlaceholder: "Details, time, location...",
        expenses: "Expenses", total: "Total", addExpense: "Add Expense", noExpenses: "No expenses recorded yet.",
        type: "Type", description: "Description", paidBy: "Paid By", split: "Split", amount: "Amount",
        costBreakdown: "Cost Breakdown", refundBreakdown: "Refund Breakdown", loadingExpenses: "Loading expenses...",
        settlement: "Settlement", allSettled: "All Settled!", allSettledDescription: "No pending settlements — everyone is square.",
        pendingPayments: "pending payment", settleButton: "Settle", paymentToSettle: "Payment to settle balance",
        settledSuccess: "Settlement recorded!", settledError: "Failed to record settlement.",
        refundsApplied: "refund already applied",
        travelers: "Travelers", addTraveler: "Add Traveler", username: "Username", role: "Role",
        noTravelers: "No travelers yet.", loadingTravelers: "Loading travelers...",
        documents: "Documents", comingSoon: "Documents section coming soon.",
        dayMoved: "Day moved successfully", dayMovedError: "Failed to move day",
        activityMoved: "Activity moved successfully", activityMovedError: "Failed to move activity",
        reason: "Reason", currency: "Currency", payers: "Payers", equalSplit: "Equal Split",
    },
    it: {
        // General
        loading: "Caricamento...", save: "Salva", cancel: "Annulla", add: "Aggiungi", edit: "Modifica",
        delete: "Elimina", close: "Chiudi", back: "Indietro",
        // Navigation
        backToDashboard: "Torna alla Dashboard", editTrip: "Modifica viaggio",
        // Tabs
        tabDescription: "Descrizione", tabItinerary: "Itinerario", tabExpenses: "Spese",
        tabSettlement: "Rimborsi", tabTravelers: "Viaggiatori", tabDocuments: "Documenti",
        // Trip header
        days: "Giorni",
        // Itinerary
        itinerary: "Itinerario", addDayBefore: "Aggiungi giorno prima", addDayAfter: "Aggiungi giorno dopo",
        noDaysYet: "Nessun giorno pianificato. Aggiungi il primo giorno!",
        generalActivities: "Attività generali", noGeneralActivities: "Nessuna attività generale aggiunta.",
        dayAddedSuccess: "Giorno aggiunto!", dayAddedError: "Errore nell'aggiunta del giorno",
        // Activities
        addActivity: "Aggiungi attività", activityName: "Nome attività", activityDescription: "Descrizione",
        activityTime: "Orario", saveActivity: "Salva attività",
        activityAddedSuccess: "Attività aggiunta!", activityAddedError: "Errore nell'aggiunta dell'attività.",
        activityDeletedSuccess: "Attività eliminata.", activityDeletedError: "Errore nell'eliminazione dell'attività.",
        loadingItinerary: "Caricamento itinerario...",
        activityNamePlaceholder: "es. Visita al Colosseo", activityDescriptionPlaceholder: "Dettagli, orario, luogo...",
        // Expenses
        expenses: "Spese", total: "Totale", addExpense: "Aggiungi spesa", noExpenses: "Nessuna spesa registrata.",
        type: "Tipo", description: "Descrizione", paidBy: "Pagato da", split: "Divisione", amount: "Importo",
        costBreakdown: "Dettaglio spesa", refundBreakdown: "Dettaglio rimborso", loadingExpenses: "Caricamento spese...",
        // Settlement
        settlement: "Rimborsi", allSettled: "Tutto a posto!", allSettledDescription: "Nessun rimborso in sospeso.",
        pendingPayments: "pagamento in sospeso", settleButton: "Salda", paymentToSettle: "Pagamento per saldare il debito",
        settledSuccess: "Rimborso registrato!", settledError: "Errore nella registrazione del rimborso.",
        refundsApplied: "rimborso già applicato",
        // Travelers
        travelers: "Viaggiatori", addTraveler: "Aggiungi viaggiatore", username: "Nome utente", role: "Ruolo",
        noTravelers: "Nessun viaggiatore.", loadingTravelers: "Caricamento viaggiatori...",
        // Documents
        documents: "Documenti", comingSoon: "Sezione documenti in arrivo.",
        // Days
        dayMoved: "Giorno spostato", dayMovedError: "Errore nello spostamento del giorno",
        activityMoved: "Attività spostata", activityMovedError: "Errore nello spostamento dell'attività",
        // Add cost
        reason: "Motivo", currency: "Valuta", payers: "Pagatori", equalSplit: "Divisione equa",
    },
    fr: {
        // General
        loading: "Chargement...", save: "Enregistrer", cancel: "Annuler", add: "Ajouter", edit: "Modifier",
        delete: "Supprimer", close: "Fermer", back: "Retour",
        // Navigation
        backToDashboard: "Retour au tableau de bord", editTrip: "Modifier le voyage",
        // Tabs
        tabDescription: "Description", tabItinerary: "Itinéraire", tabExpenses: "Dépenses",
        tabSettlement: "Remboursements", tabTravelers: "Voyageurs", tabDocuments: "Documents",
        // Trip header
        days: "Jours",
        // Itinerary
        itinerary: "Itinéraire", addDayBefore: "Ajouter un jour avant", addDayAfter: "Ajouter un jour après",
        noDaysYet: "Aucun jour planifié. Ajoutez votre premier jour !",
        generalActivities: "Activités générales", noGeneralActivities: "Aucune activité générale ajoutée.",
        dayAddedSuccess: "Jour ajouté !", dayAddedError: "Échec de l'ajout du jour",
        // Activities
        addActivity: "Ajouter une activité", activityName: "Nom de l'activité", activityDescription: "Description",
        activityTime: "Heure", saveActivity: "Enregistrer l'activité",
        activityAddedSuccess: "Activité ajoutée !", activityAddedError: "Échec de l'ajout de l'activité.",
        activityDeletedSuccess: "Activité supprimée.", activityDeletedError: "Échec de la suppression.",
        loadingItinerary: "Chargement de l'itinéraire...",
        activityNamePlaceholder: "ex. Visiter le Colisée", activityDescriptionPlaceholder: "Détails, heure, lieu...",
        // Expenses
        expenses: "Dépenses", total: "Total", addExpense: "Ajouter une dépense", noExpenses: "Aucune dépense enregistrée.",
        type: "Type", description: "Description", paidBy: "Payé par", split: "Répartition", amount: "Montant",
        costBreakdown: "Détail des coûts", refundBreakdown: "Détail du remboursement", loadingExpenses: "Chargement des dépenses...",
        // Settlement
        settlement: "Remboursements", allSettled: "Tout est réglé !", allSettledDescription: "Aucun remboursement en attente.",
        pendingPayments: "paiement en attente", settleButton: "Régler", paymentToSettle: "Paiement pour solder le solde",
        settledSuccess: "Remboursement enregistré !", settledError: "Échec de l'enregistrement.",
        refundsApplied: "remboursement déjà appliqué",
        // Travelers
        travelers: "Voyageurs", addTraveler: "Ajouter un voyageur", username: "Nom d'utilisateur", role: "Rôle",
        noTravelers: "Aucun voyageur.", loadingTravelers: "Chargement des voyageurs...",
        // Documents
        documents: "Documents", comingSoon: "Section documents à venir.",
        // Days
        dayMoved: "Jour déplacé", dayMovedError: "Échec du déplacement du jour",
        activityMoved: "Activité déplacée", activityMovedError: "Échec du déplacement de l'activité",
        // Add cost
        reason: "Motif", currency: "Devise", payers: "Payeurs", equalSplit: "Partage égal",
    },
    de: {
        // General
        loading: "Laden...", save: "Speichern", cancel: "Abbrechen", add: "Hinzufügen", edit: "Bearbeiten",
        delete: "Löschen", close: "Schließen", back: "Zurück",
        // Navigation
        backToDashboard: "Zurück zum Dashboard", editTrip: "Reise bearbeiten",
        // Tabs
        tabDescription: "Beschreibung", tabItinerary: "Reiseplan", tabExpenses: "Ausgaben",
        tabSettlement: "Abrechnung", tabTravelers: "Reisende", tabDocuments: "Dokumente",
        // Trip header
        days: "Tage",
        // Itinerary
        itinerary: "Reiseplan", addDayBefore: "Tag davor hinzufügen", addDayAfter: "Tag danach hinzufügen",
        noDaysYet: "Noch keine Tage geplant. Fügen Sie den ersten Tag hinzu!",
        generalActivities: "Allgemeine Aktivitäten", noGeneralActivities: "Noch keine allgemeinen Aktivitäten.",
        dayAddedSuccess: "Tag hinzugefügt!", dayAddedError: "Fehler beim Hinzufügen des Tages",
        // Activities
        addActivity: "Aktivität hinzufügen", activityName: "Aktivitätsname", activityDescription: "Beschreibung",
        activityTime: "Uhrzeit", saveActivity: "Aktivität speichern",
        activityAddedSuccess: "Aktivität hinzugefügt!", activityAddedError: "Fehler beim Hinzufügen.",
        activityDeletedSuccess: "Aktivität gelöscht.", activityDeletedError: "Fehler beim Löschen.",
        loadingItinerary: "Reiseplan wird geladen...",
        activityNamePlaceholder: "z.B. Kolosseum besuchen", activityDescriptionPlaceholder: "Details, Uhrzeit, Ort...",
        // Expenses
        expenses: "Ausgaben", total: "Gesamt", addExpense: "Ausgabe hinzufügen", noExpenses: "Noch keine Ausgaben erfasst.",
        type: "Typ", description: "Beschreibung", paidBy: "Bezahlt von", split: "Aufteilung", amount: "Betrag",
        costBreakdown: "Kostenaufschlüsselung", refundBreakdown: "Erstattungsaufschlüsselung", loadingExpenses: "Ausgaben werden geladen...",
        // Settlement
        settlement: "Abrechnung", allSettled: "Alles beglichen!", allSettledDescription: "Keine offenen Abrechnungen.",
        pendingPayments: "ausstehende Zahlung", settleButton: "Begleichen", paymentToSettle: "Zahlung zur Begleichung",
        settledSuccess: "Abrechnung erfasst!", settledError: "Fehler bei der Erfassung.",
        refundsApplied: "Erstattung bereits angewendet",
        // Travelers
        travelers: "Reisende", addTraveler: "Reisenden hinzufügen", username: "Benutzername", role: "Rolle",
        noTravelers: "Noch keine Reisenden.", loadingTravelers: "Reisende werden geladen...",
        // Documents
        documents: "Dokumente", comingSoon: "Dokumentenbereich folgt.",
        // Days
        dayMoved: "Tag verschoben", dayMovedError: "Fehler beim Verschieben des Tages",
        activityMoved: "Aktivität verschoben", activityMovedError: "Fehler beim Verschieben der Aktivität",
        // Add cost
        reason: "Grund", currency: "Währung", payers: "Zahler", equalSplit: "Gleiche Aufteilung",
    },
};

export function getTranslation(locale: Locale, key: TranslationKey): string {
    return translations[locale]?.[key] ?? translations["en"][key] ?? key;
}

export default translations;
