"use client";

import { useEffect, useState } from "react";
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Database,
    Loader2,
    WifiOff,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type SpendXStatusType =
    | "loading"
    | "active"
    | "offline"
    | "session"
    | "database"
    | "empty"
    | "slow";

export default function SpendXStatus() {
    const [status, setStatus] = useState<SpendXStatusType>("loading");

    useEffect(() => {
        let slowTimer: NodeJS.Timeout;

        async function checkSpendXStatus() {
            try {
                setStatus("loading");

                if (!navigator.onLine) {
                    setStatus("offline");
                    return;
                }

                slowTimer = setTimeout(() => {
                    setStatus("slow");
                }, 6000);

                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                    clearTimeout(slowTimer);
                    setStatus("session");
                    return;
                }

                const { data, error } = await supabase
                    .from("transactions")
                    .select("id")
                    .eq("user_id", user.id)
                    .limit(1);

                clearTimeout(slowTimer);

                if (error) {
                    console.error("SpendX status database error:", error);
                    setStatus("database");
                    return;
                }

                if (!data || data.length === 0) {
                    setStatus("empty");
                    return;
                }

                setStatus("active");
            } catch (error) {
                clearTimeout(slowTimer);
                console.error("SpendX status error:", error);
                setStatus("database");
            }
        }

        checkSpendXStatus();

        const handleOnline = () => checkSpendXStatus();
        const handleOffline = () => setStatus("offline");

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        const refreshInterval = setInterval(checkSpendXStatus, 30000);

        return () => {
            clearTimeout(slowTimer);
            clearInterval(refreshInterval);
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const statusConfig = {
        loading: {
            label: "Syncing SpendX",
            icon: Loader2,
            className: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
            iconClassName: "animate-spin text-cyan-400",
        },
        active: {
            label: "SpendX Active",
            icon: CheckCircle2,
            className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
            iconClassName: "text-emerald-400",
        },
        offline: {
            label: "Offline",
            icon: WifiOff,
            className: "border-red-500/20 bg-red-500/10 text-red-300",
            iconClassName: "text-red-400",
        },
        session: {
            label: "Session issue",
            icon: AlertTriangle,
            className: "border-amber-500/20 bg-amber-500/10 text-amber-300",
            iconClassName: "text-amber-400",
        },
        database: {
            label: "Database issue",
            icon: Database,
            className: "border-red-500/20 bg-red-500/10 text-red-300",
            iconClassName: "text-red-400",
        },
        empty: {
            label: "No data yet",
            icon: Activity,
            className: "border-zinc-500/20 bg-white/[0.04] text-zinc-300",
            iconClassName: "text-zinc-400",
        },
        slow: {
            label: "SpendX unstable",
            icon: AlertTriangle,
            className: "border-orange-500/20 bg-orange-500/10 text-orange-300",
            iconClassName: "text-orange-400",
        },
    };

    const currentStatus = statusConfig[status];
    const StatusIcon = currentStatus.icon;

    return (
        <div
            className={`inline-flex items-center gap-3 rounded-full border px-5 py-3 font-mono text-sm shadow-sm backdrop-blur-xl transition-all duration-300 ${currentStatus.className}`}
        >
            <StatusIcon size={16} className={currentStatus.iconClassName} />
            <span>{currentStatus.label}</span>
        </div>
    );
}