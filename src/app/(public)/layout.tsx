import { Header } from "@/components/Header";

export const dynamic = 'force-dynamic';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* 
              Header is fixed, so we add padding-top to the main content 
              Top Bar (40px) + Navbar (70px) approx = 110px
            */}
            <Header variant="light" />
            <main className="flex-grow pt-[110px] bg-[#0A0F1A]">
                {children}
            </main>
        </div>
    );
}
