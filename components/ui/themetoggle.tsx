"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("spendx-theme") as
            | "light"
            | "dark"
            | null;

        const initialTheme = savedTheme || "dark";

        setTheme(initialTheme);
        document.documentElement.classList.toggle("dark", initialTheme === "dark");
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";

        setTheme(nextTheme);
        localStorage.setItem("spendx-theme", nextTheme);
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
    };

    if (!mounted) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="group inline-flex items-center gap-3 rounded-full border border-black/10 bg-black/[0.04] px-5 py-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-black/[0.07] dark:border-white/10 dark:bg-white/[0.06] dark:text-white/80 dark:hover:bg-white/[0.1]"
        >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-slate-700 transition-all duration-300 dark:bg-white/10 dark:text-emerald-300">
                {theme === "dark" ? (
                    <Moon size={15} strokeWidth={2.3} />
                ) : (
                    <Sun size={15} strokeWidth={2.3} />
                )}
            </span>

            <span>{theme === "dark" ? "Dark Theme" : "Light Theme"}</span>
        </button>
    );
}