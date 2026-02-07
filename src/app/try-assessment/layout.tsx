export default function TryAssessmentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0A0F1A] text-white">
            {children}
        </div>
    );
}
