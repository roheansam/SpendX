"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export default function TopHeader() {
    const [displayName, setDisplayName] = useState("User");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUserName() {
            try {
                setLoading(true);

                const {
                    data: { user },
                } = await supabase.auth.getUser();

                const name =
                    user?.user_metadata?.full_name ||
                    user?.user_metadata?.name ||
                    user?.email?.split("@")[0] ||
                    "User";

                setDisplayName(name);
            } catch (error) {
                console.error("TopHeader user load error:", error);
                setDisplayName("User");
            } finally {
                setLoading(false);
            }
        }

        loadUserName();
    }, []);

    return (
        <header className="fixed left-0 top-0 z-40 w-full border-b border-border/60 bg-background/72 backdrop-blur-[28px]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

            <div className="relative mx-auto flex h-24 w-full items-center justify-between px-5 sm:h-[120px] sm:px-8 lg:px-14">
                <Link
                    href="/dashboard"
                    className="group flex min-w-0 items-center gap-3 rounded-[32px] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] sm:gap-5"
                >
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-500 shadow-[0_18px_42px_rgba(37,99,235,0.28)] transition-all duration-300 group-hover:shadow-[0_20px_52px_rgba(20,184,166,0.36)] sm:h-16 sm:w-16">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/10" />
                        <Sparkles className="relative z-10 h-7 w-7 text-white sm:h-8 sm:w-8" />
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate text-2xl font-black tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-3xl">
                            SpendX
                        </h1>
                        <p className="mt-1 truncate text-base font-semibold tracking-wider text-muted-foreground transition-colors duration-300 sm:text-lg">
                            Finance OS
                        </p>
                    </div>
                </Link>

                <Link
                    href="/profile"
                    aria-label="Open profile"
                    className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground text-base font-black text-background shadow-[0_16px_32px_rgba(15,23,42,0.22)] transition-all duration-300 hover:scale-105 active:scale-95 dark:bg-white dark:text-zinc-950 sm:h-14 sm:w-14 sm:text-lg"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                    ) : (
                        getInitials(displayName)
                    )}
                </Link>
            </div>
        </header>
    );
}
