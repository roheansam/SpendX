import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "@/app/dashboard/page"
import Transactions from "@/app/transactions/page"
import Reports from "@/app/reports/page"
import Settings from "@/app/settings/page"

import LiquidGlassNavbar from "./components/ui/liquidglassnavbar"

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#0b1020] text-white pb-32">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>

                <LiquidGlassNavbar />
            </div>
        </BrowserRouter>
    )
}