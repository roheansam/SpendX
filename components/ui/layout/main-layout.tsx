'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Receipt,
    BarChart3,
    Settings
} from 'lucide-react';

const navItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        label: 'Transactions',
        href: '/transactions',
        icon: Receipt,
    },
    {
        label: 'Reports',
        href: '/reports',
        icon: BarChart3,
    },
    {
        label: 'Settings',
        href: '/settings',
        icon: Settings,
    },
];

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#faf8ff] text-slate-900">

            {/* Top Header */}
            <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white flex items-center justify-between px-5">
                <h1 className="text-xl font-bold text-[#143d95]">
                    SpendX
                </h1>

                <button className="text-sm font-medium text-slate-500">
                    User
                </button>
            </header>

            {/* Main Content */}
            <main className="pb-24">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-6 py-3 flex justify-between">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 ${isActive
                                    ? 'text-[#143d95]'
                                    : 'text-slate-400'
                                }`}
                        >
                            <item.icon size={22} />

                            <span className="text-[10px] font-bold uppercase">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}