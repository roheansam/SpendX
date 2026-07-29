export const getDailySummary = (transactions: any[]) => {
    const map: Record<
        string,
        { income: number; expense: number }
    > = {};

    transactions.forEach((t) => {
        const date = new Date(t.created_at).toISOString().split("T")[0];

        if (!map[date]) {
            map[date] = { income: 0, expense: 0 };
        }

        if (t.type === "income") {
            map[date].income += t.amount;
        } else {
            map[date].expense += t.amount;
        }
    });

    return map;
};