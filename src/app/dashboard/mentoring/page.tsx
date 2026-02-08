import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Calendar, User, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MentoringPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Mentoring</h1>
                    <p className="text-slate-400">Connect with mentors and track your guidance sessions.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white">
                    Book Session
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card/50 border-white/5 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" /> Upcoming Sessions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-slate-500">
                            <p>No upcoming sessions scheduled.</p>
                            <Button variant="link" className="text-blue-400">Schedule one now</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-white/5 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-green-500" /> Recent Messages
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-slate-500">
                            <p>Your inbox is empty.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Find Your Perfect Mentor</h3>
                <p className="text-slate-400 max-w-md mb-6">
                    Our matching system connects you with industry professionals and senior students based on your career goals and current dimensions profile.
                </p>
                <Button variant="outline" className="border-white/10 hover:bg-white/10 text-white">
                    Explore Mentors
                </Button>
            </div>
        </div>
    );
}
