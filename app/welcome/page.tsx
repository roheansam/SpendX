"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Sparkles } from "lucide-react";

export default function WelcomePage() {
    const router = useRouter();

    const [name, setName] = useState("User");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let redirectTimer: NodeJS.Timeout;

        async function loadUser() {
            try {
                const {
                    data: { session },
                    error: sessionError,
                } = await supabase.auth.getSession();

                if (sessionError || !session?.user) {
                    router.replace("/login");
                    return;
                }

                const user = session.user;

                const displayName =
                    user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    user.email?.split("@")[0] ||
                    "User";

                setName(displayName);
                setLoading(false);

                redirectTimer = setTimeout(() => {
                    router.replace("/dashboard");
                }, 2200);
            } catch (error) {
                console.error("Welcome page error:", error);
                router.replace("/login");
            }
        }

        loadUser();

        return () => {
            if (redirectTimer) clearTimeout(redirectTimer);
        };
    }, [router]);

    return (
        <main className="sx-screen relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
                <div className="absolute right-10 top-20 h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute bottom-10 left-10 h-[260px] w-[260px] rounded-full bg-violet-500/10 blur-3xl" />
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

            <section className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                    {loading ? (
                        <Loader2 className="h-7 w-7 animate-spin text-white" />
                    ) : (
                        <Sparkles className="h-7 w-7 text-emerald-300" />
                    )}
                </div>

                <p className="mb-3 text-sm font-medium uppercase tracking-[0.35em] text-white/45">
                    SpendX Finance OS
                </p>

                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                    Welcome back,
                </h1>

                <h2 className="mt-3 max-w-[90vw] truncate text-3xl font-bold tracking-tight text-emerald-300 sm:text-5xl">
                    {name}
                </h2>

                <p className="mt-6 text-sm text-white/50">
                    Preparing your dashboard...
                </p>

                <div className="mt-8 h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-full animate-[welcomeProgress_2.2s_ease-in-out_forwards] rounded-full bg-emerald-400" />
                </div>
            </section>

            <style jsx>{`
                @keyframes welcomeProgress {
                    from {
                        transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(0%);
                    }
                }
            `}</style>
        </main>
    );
}