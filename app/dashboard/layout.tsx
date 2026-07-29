import LiquidGlassNavbar from "@/components/ui/liquidglassnavbar";
import TopHeader from "@/components/ui/topheader";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="sx-screen">
            <TopHeader />

            <div className="pb-28">
                {children}
            </div>

            <LiquidGlassNavbar />
        </main>
    );
}