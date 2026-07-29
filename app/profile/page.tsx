"use client";

import AuthGuard from "@/components/AuthGuard";
import LiquidGlassNavbar from "@/components/ui/liquidglassnavbar";
import TopHeader from "@/components/ui/topheader";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  CreditCard,
  LogOut,
  Loader2,
  Mail,
  Pencil,
  ReceiptText,
  Settings,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";

type Profile = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  createdAt: string | null;
  lastSignInAt: string | null;
};

type Transaction = {
  id: string;
  amount: number | string;
  type: "income" | "expense";
  category: string;
  note?: string | null;
  transaction_mode?: string | null;
  transaction_date?: string | null;
  created_at?: string | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "Not available";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "U";
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadProfile() {
    try {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMessage("Unable to load your profile right now.");
        setProfile(null);
        setTransactions([]);
        return;
      }

      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User";

      const avatarUrl =
        user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

      setProfile({
        id: user.id,
        email: user.email || "No email found",
        fullName,
        avatarUrl,
        createdAt: user.created_at || null,
        lastSignInAt: user.last_sign_in_at || null,
      });

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false });

      if (error) {
        console.error("Profile transactions error:", error);
        setTransactions([]);
        return;
      }

      setTransactions((data || []) as Transaction[]);
    } catch (error) {
      console.error("Profile load error:", error);
      setErrorMessage("Something went wrong while loading your profile.");
      setProfile(null);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      setSigningOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      setErrorMessage("Unable to sign out right now. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  const stats = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    const expenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    const categories = transactions.reduce<Record<string, number>>(
      (result, transaction) => {
        if (transaction.type !== "expense") return result;

        const category = transaction.category || "Uncategorized";
        result[category] =
          (result[category] || 0) + Number(transaction.amount || 0);

        return result;
      },
      {}
    );

    const topCategory =
      Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "None yet";

    return {
      income,
      expenses,
      balance: income - expenses,
      transactionCount: transactions.length,
      topCategory,
    };
  }, [transactions]);

  const initials = getInitials(profile?.fullName || profile?.email || "User");
  const recentTransactions = transactions.slice(0, 5);

  return (
    <AuthGuard>
      <div className="sx-screen">
        <TopHeader />

        <main className="mx-auto max-w-7xl px-6 pb-32 pt-36">
          <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-mono text-4xl font-bold tracking-tight sx-title md:text-5xl">
                Profile
              </h1>
              <p className="mt-3 max-w-2xl sx-muted">
                Your SpendX identity, account status, and financial snapshot in
                one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/settings"
                className="flex items-center gap-2 rounded-2xl border border-border bg-card/40 px-5 py-3 text-sm font-semibold sx-title transition-colors hover:bg-card/60"
              >
                <Settings size={16} />
                Settings
              </Link>

              <Link
                href="/transactions"
                className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ReceiptText size={16} />
                Transactions
              </Link>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center rounded-3xl border border-border bg-card/30 py-20 sx-muted">
              <Loader2 size={20} className="mr-2 animate-spin" />
              Loading profile...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
              <section className="space-y-8">
                <div className="sx-card rounded-3xl p-7">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-gradient-to-br from-violet-500 to-indigo-600 text-3xl font-bold text-white shadow-[0_0_55px_rgba(99,102,241,0.35)]">
                      <span className="relative z-0">{initials}</span>

                      {profile?.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profile.avatarUrl}
                          alt={profile.fullName || "Profile avatar"}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 z-10 h-full w-full rounded-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : null}
                    </div>

                    <h2 className="mt-5 text-2xl font-bold sx-title">
                      {profile?.fullName || "User"}
                    </h2>

                    <div className="mt-2 flex max-w-full items-center gap-2 text-sm sx-muted">
                      <Mail size={15} className="shrink-0" />
                      <span className="truncate">
                        {profile?.email || "No email found"}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        <BadgeCheck size={14} />
                        Auth connected
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                        <ShieldCheck size={14} />
                        Protected
                      </span>
                    </div>
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="sx-panel rounded-2xl p-4">
                      <p className="text-xs sx-muted">Member since</p>
                      <p className="mt-1 text-sm font-semibold sx-title">
                        {formatDate(profile?.createdAt)}
                      </p>
                    </div>

                    <div className="sx-panel rounded-2xl p-4">
                      <p className="text-xs sx-muted">Last sign in</p>
                      <p className="mt-1 text-sm font-semibold sx-title">
                        {formatDate(profile?.lastSignInAt)}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/settings"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card/40 px-5 py-3 text-sm font-semibold sx-title transition-colors hover:bg-card/60"
                  >
                    <Pencil size={16} />
                    Edit Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-200 transition-colors hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {signingOut ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <LogOut size={16} />
                    )}
                    {signingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>

                <div className="sx-card rounded-3xl p-6">
                  <h3 className="font-mono text-base font-bold sx-title">
                    Account Health
                  </h3>

                  <div className="mt-5 space-y-4">
                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="sx-muted">Profile setup</span>
                        <span className="font-mono text-emerald-500">
                          100%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 w-full rounded-full bg-emerald-500" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="sx-muted">Ledger activity</span>
                        <span className="font-mono text-indigo-400">
                          {stats.transactionCount} entries
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-indigo-500"
                          style={{
                            width: `${Math.min(
                              stats.transactionCount * 10,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div className="sx-card rounded-3xl p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                      <ArrowDownLeft size={21} />
                    </div>

                    <p className="font-mono text-xs sx-muted">
                      Total Income
                    </p>

                    <h3 className="mt-2 font-mono text-2xl font-bold sx-title">
                      {formatCurrency(stats.income)}
                    </h3>
                  </div>

                  <div className="sx-card rounded-3xl p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
                      <ArrowUpRight size={21} />
                    </div>

                    <p className="font-mono text-xs sx-muted">
                      Total Expense
                    </p>

                    <h3 className="mt-2 font-mono text-2xl font-bold sx-title">
                      {formatCurrency(stats.expenses)}
                    </h3>
                  </div>

                  <div className="sx-card rounded-3xl p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                      <Wallet size={21} />
                    </div>

                    <p className="font-mono text-xs sx-muted">
                      Net Balance
                    </p>

                    <h3
                      className={`mt-2 font-mono text-2xl font-bold ${stats.balance >= 0 ? "text-emerald-500" : "text-red-500"
                        }`}
                    >
                      {formatCurrency(stats.balance)}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="sx-card rounded-3xl p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="font-mono text-base font-bold sx-title">
                        Recent Activity
                      </h3>

                      <span className="text-xs sx-muted">
                        {stats.transactionCount} total
                      </span>
                    </div>

                    {recentTransactions.length === 0 ? (
                      <div className="sx-panel rounded-2xl px-6 py-10 text-center text-sm sx-muted">
                        No transactions yet. Add one to start shaping your
                        financial profile.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentTransactions.map((transaction) => {
                          const isIncome = transaction.type === "income";
                          const amount = Number(transaction.amount || 0);

                          return (
                            <div
                              key={transaction.id}
                              className="sx-panel flex items-center justify-between gap-4 rounded-2xl p-4"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div
                                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${isIncome
                                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                      : "border-red-500/20 bg-red-500/10 text-red-400"
                                    }`}
                                >
                                  {isIncome ? (
                                    <ArrowDownLeft size={18} />
                                  ) : (
                                    <ArrowUpRight size={18} />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold sx-title">
                                    {transaction.note ||
                                      transaction.category ||
                                      "Transaction"}
                                  </p>

                                  <p className="mt-1 truncate text-xs sx-muted">
                                    {transaction.transaction_mode ||
                                      transaction.category ||
                                      "SpendX"}{" "}
                                    on{" "}
                                    {formatDate(
                                      transaction.transaction_date ||
                                      transaction.created_at
                                    )}
                                  </p>
                                </div>
                              </div>

                              <p
                                className={`shrink-0 font-mono text-sm font-bold ${isIncome ? "text-emerald-500" : "text-red-500"
                                  }`}
                              >
                                {isIncome ? "+" : "-"}
                                {formatCurrency(amount)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="sx-card rounded-3xl p-6">
                    <h3 className="font-mono text-base font-bold sx-title">
                      Profile Snapshot
                    </h3>

                    <div className="mt-6 space-y-4">
                      <div className="sx-panel flex items-center justify-between rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <CreditCard size={18} className="sx-muted" />
                          <span className="text-sm sx-title">
                            Top spend category
                          </span>
                        </div>

                        <span className="text-sm font-semibold sx-title">
                          {stats.topCategory}
                        </span>
                      </div>

                      <div className="sx-panel flex items-center justify-between rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                          <TrendingUp size={18} className="sx-muted" />
                          <span className="text-sm sx-title">
                            Cashflow status
                          </span>
                        </div>

                        <span
                          className={`text-sm font-semibold ${stats.balance >= 0
                              ? "text-emerald-500"
                              : "text-red-500"
                            }`}
                        >
                          {stats.balance >= 0 ? "Positive" : "Negative"}
                        </span>
                      </div>

                      <div className="sx-panel rounded-2xl p-5">
                        <p className="text-sm sx-muted">
                          Your account overview updates from your saved
                          transactions and Supabase profile data.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>

        <LiquidGlassNavbar />
      </div>
    </AuthGuard>
  );
}