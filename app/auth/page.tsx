"use client";

import { useState } from "react";
import { ArrowRight, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const redirectTo =
        typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined;

    async function saveUserProfile() {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return;
        }

        await supabase.from("profiles").upsert({
            id: user.id,
            full_name:
                name ||
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                null,
            email: user.email,
            avatar_url: user.user_metadata?.avatar_url || null,
            provider: user.app_metadata?.provider || "email",
            last_login_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
    }

    async function handleGoogleAuth() {
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo,
            },
        });

        if (error) {
            setMessage(error.message);
            setLoading(false);
        }
    }

    async function handleEmailAuth(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        if (!email || !password) {
            setMessage("Please enter your email and password.");
            setLoading(false);
            return;
        }

        if (!isLogin && !name) {
            setMessage("Please enter your name.");
            setLoading(false);
            return;
        }

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setMessage(error.message);
                setLoading(false);
                return;
            }

            await saveUserProfile();

            window.location.href = "/dashboard";
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (error) {
            setMessage(error.message);
            setLoading(false);
            return;
        }

        await saveUserProfile();

        window.location.href = "/dashboard";
    }

    return (
        <main className="sx-screen overflow-hidden">
            <div className="relative min-h-screen">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(37,99,235,0.18),transparent_32%),radial-gradient(circle_at_85%_70%,rgba(16,185,129,0.14),transparent_35%)]" />
                <div className="absolute inset-0 bg-background/80" />

                <div className="relative grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
                    <section className="flex min-h-screen items-center justify-center px-6 py-10 lg:px-16">
                        <div className="w-full max-w-[440px]">
                            <div className="mb-12 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 shadow-lg shadow-blue-700/30">
                                    <Wallet className="h-6 w-6 text-white" />
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">
                                        SpendX
                                    </h1>
                                    <p className="text-sm text-zinc-500">Finance OS</p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-5xl font-bold tracking-tight">
                                    {isLogin ? "Welcome back" : "Get started now"}
                                </h2>

                                <p className="mt-4 max-w-sm text-base leading-relaxed text-zinc-400">
                                    {isLogin
                                        ? "Enter your credentials to access your account."
                                        : "Create your SpendX account in seconds."}
                                </p>
                            </div>

                            <form onSubmit={handleEmailAuth} className="mt-10 space-y-5">
                                {!isLogin && (
                                    <div>
                                        <label className="text-sm font-semibold text-zinc-200">
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:bg-white/[0.06]"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-semibold text-zinc-200">
                                        Email address
                                    </label>

                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:bg-white/[0.06]"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold text-zinc-200">
                                            Password
                                        </label>

                                        {isLogin && (
                                            <button
                                                type="button"
                                                className="text-sm font-medium text-blue-400 hover:text-blue-300"
                                            >
                                                Forgot password?
                                            </button>
                                        )}
                                    </div>

                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500 focus:bg-white/[0.06]"
                                    />
                                </div>

                                <label className="flex items-center gap-3 text-sm text-zinc-400">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-white/20 bg-transparent"
                                    />

                                    {isLogin
                                        ? "Remember me for 30 days"
                                        : "I agree to the terms & policy"}
                                </label>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Please wait..."
                                        : isLogin
                                            ? "Login"
                                            : "Create account"}

                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </form>

                            <div className="my-8 flex items-center gap-4">
                                <div className="h-px flex-1 bg-white/10" />
                                <span className="text-sm text-zinc-500">Or</span>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleAuth}
                                disabled={loading}
                                className="flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-sm font-semibold transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Connecting..." : "Continue with Google"}
                            </button>

                            {message && (
                                <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                    {message}
                                </p>
                            )}

                            <p className="mt-8 text-center text-sm text-zinc-400">
                                {isLogin
                                    ? "Don’t have an account?"
                                    : "Already have an account?"}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setMessage("");
                                        setPassword("");
                                    }}
                                    className="ml-2 font-semibold text-blue-400 hover:text-blue-300"
                                >
                                    {isLogin ? "Sign up" : "Login"}
                                </button>
                            </p>
                        </div>
                    </section>

                    <section className="relative hidden min-h-screen items-center justify-center px-10 py-10 lg:flex">
                        <div className="pointer-events-none absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-zinc-950 to-transparent" />

                        <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
                            <video
                                src="/spendx-auth-video.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="h-[680px] w-full rounded-[1.5rem] object-cover"
                            />

                            <div className="pointer-events-none absolute inset-3 rounded-[1.5rem] bg-gradient-to-t from-zinc-950/55 via-transparent to-zinc-950/20" />

                            <div className="pointer-events-none absolute bottom-8 left-8 right-8">
                                <div className="max-w-md rounded-2xl border border-white/10 bg-background/55 p-5 backdrop-blur-xl">
                                    <p className="text-xs font-medium text-blue-300">
                                        SpendX Finance OS
                                    </p>

                                    <h3 className="mt-2 text-2xl font-bold leading-tight tracking-tight">
                                        Your money, beautifully organized.
                                    </h3>

                                    <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                                        Track expenses, monitor spending, and understand your
                                        finances in one premium dashboard.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}