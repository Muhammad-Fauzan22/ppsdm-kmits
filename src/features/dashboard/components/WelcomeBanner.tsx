import { Sparkles } from "lucide-react";

interface WelcomeBannerProps {
    greeting: string;
    name: string;
    suggestion: string;
}

export function WelcomeBanner({ greeting, name, suggestion }: WelcomeBannerProps) {
    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden mb-8">
            <div className="relative z-10">
                <h1 className="text-2xl font-bold mb-2">{greeting}, {name}!</h1>
                <p className="text-indigo-100 max-w-xl">
                    Your profile indicates strong growth in Character and Intellectual domains.
                    {suggestion && (
                        <> Consider focusing on <span className="font-bold text-white underline decoration-yellow-400 decoration-2">{suggestion}</span>.</>
                    )}
                </p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                <Sparkles className="size-64" />
            </div>
        </div>
    );
}
