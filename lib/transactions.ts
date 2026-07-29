import { supabase } from "@/lib/supabase";

export type TransactionType = "income" | "expense";

export type TransactionInput = {
    amount: number;
    type: "income" | "expense";
    category: string;
    transaction_mode?: string;
    transaction_date?: string;
};

async function getCurrentUserId() {
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (session?.user) {
        return session.user.id;
    }

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (user) {
        return user.id;
    }

    if (sessionError || userError) {
        const message = sessionError?.message || userError?.message;

        if (message?.toLowerCase().includes("fetch")) {
            throw new Error("Unable to reach Supabase. Check your connection and try again.");
        }
    }

    throw new Error("Please log in again to manage transactions.");
}

export async function getTransactions() {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("transaction_date", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function addTransaction(transaction: TransactionInput) {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
        .from("transactions")
        .insert({
            user_id: userId,
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            transaction_mode: transaction.transaction_mode ?? "UPI",
            transaction_date:
                transaction.transaction_date ??
                new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function updateTransaction(
    id: string,
    transaction: TransactionInput
) {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
        .from("transactions")
        .update({
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            transaction_mode: transaction.transaction_mode,
            transaction_date: transaction.transaction_date,
        })
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}


export async function deleteTransaction(id: string) {
    const userId = await getCurrentUserId();

    const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

    if (error) {
        throw new Error(error.message);
    }

    return true;
}

export async function getDashboardStats() {
    const transactions = await getTransactions();

    const income = transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    const expenses = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    const balance = income - expenses;

    return {
        income,
        expenses,
        balance,
        transactions,
    };
}
