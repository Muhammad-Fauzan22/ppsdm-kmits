"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    CalendarPlus,
    Bell,
    CheckCircle,
    AlertTriangle,
    Calendar,
    MessageSquare,
    MoreHorizontal,
    Search
} from "lucide-react";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/Animations";

export default function SupervisorPage() {
    const mentees = [
        {
            name: "Aisyah Pratiwi",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAo-r3v6lImK1nM4G0xB4Tqx3T4r2xV3Xw2Y6Z7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0",
            status: "On Track",
            statusType: "success",
            progress: 85,
            lastContact: "Yesterday",
            nextMeeting: "Mar 15, 10:00 AM",
        },
        {
            name: "Budi Santoso",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn3ZodjtJSdCyz9Q0YhcDqYNL1bWr3xGv7sqilJ9GL0xzCCXJi3VU4PubRff2MwlT6G9Kgc_jxEfy0z8fBc2_yYWnNzzwKgyaDllmbqC3VF0M2UDBxQTuYiTqgmZTiaABEXpFZF-MPHGknI_oceSLFANcZANzXPZe9ITjnjkev150zoG6Q-cuCgyENTtO6BP74C8nGUsm-O0slGzbWTcF5UhLaGOszY3EFyfdcL4GrCzVlA2bR8xxO8-eQaerBB-rn1sn2UxOHc6E",
            status: "Needs Attention",
            statusType: "warning",
            progress: 60,
            lastContact: "5 days ago",
            nextMeeting: "Reschedule Required",
        },
        {
            name: "Citra Dewi",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUKsIbSOxCQtEs6YlxaaFq8t-XkUPH2OZKBBeDF2SMaEf0q5Mm3LhgHEnXDt0MAkYph2_sISQoZDwI8GbutO2SY2VsllL_biFUE2rA5o7-3e6utVe3RJqZewQWAUIZOjJtGReKpGfLaKsHfEXjJdUZjZQT3UwJ6QKqK4_xy2wJ3EXED4jfW0hSXU6bKYFVVpWzgHooNe8MHyMANajkXSIZVx-TuJrciJbDL5OpSxGhsPQbLq4S5lVqVFcqHy3VimTPJ2mHMsl6yt8",
            status: "On Track",
            statusType: "success",
            progress: 92,
            lastContact: "Today",
            nextMeeting: "Mar 10, 2:00 PM",
        },
    ];

    return (
        <div className="min-h-screen bg-muted/40 font-sans text-foreground">
            {/* Header */}
            <header className="bg-white dark:bg-zinc-900 border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Users className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Supervisor Portal</h1>
                            <p className="text-xs text-muted-foreground">PPSDM KMM Management</p>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="default" className="gap-2 shadow-sm">
                        <CalendarPlus className="size-4" />
                        Schedule Session
                    </Button>
                    <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                        <Bell className="size-5" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
                {/* Summary Cards */}
                <FadeIn>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="border-none shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-2">
                                    <Users className="size-4 text-primary" />
                                    Total Mentees
                                </div>
                                <p className="text-3xl font-bold">12</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-2">
                                    <CheckCircle className="size-4 text-green-600" />
                                    On Track
                                </div>
                                <p className="text-3xl font-bold text-green-600">10</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-2">
                                    <AlertTriangle className="size-4 text-yellow-600" />
                                    Needs Attention
                                </div>
                                <p className="text-3xl font-bold text-yellow-600">2</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-2">
                                    <Calendar className="size-4 text-primary" />
                                    This Week
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold">5</p>
                                    <span className="text-xs text-muted-foreground">sessions</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </FadeIn>

                {/* Mentee Network Section */}
                <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <h2 className="text-xl font-bold tracking-tight">My Mentees</h2>
                        <div className="flex items-center gap-2 p-1 bg-muted rounded-lg border w-full sm:w-auto">
                            <Button variant="ghost" size="sm" className="bg-white dark:bg-zinc-800 shadow-sm text-foreground flex-1 sm:flex-none">All</Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground flex-1 sm:flex-none">On Track</Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground flex-1 sm:flex-none">Needs Attention</Button>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {mentees.map((mentee, idx) => (
                            <StaggerItem key={idx}>
                                <Card className="border-muted hover:border-primary/50 transition-colors shadow-sm cursor-pointer group hover:shadow-md">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div
                                                className="size-14 rounded-full bg-cover bg-center border-2 border-muted group-hover:border-primary transition-colors"
                                                style={{ backgroundImage: `url("${mentee.avatar}")` }}
                                            ></div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold truncate text-foreground group-hover:text-primary transition-colors">{mentee.name}</h3>
                                                <Badge
                                                    variant="secondary"
                                                    className={`mt-1 font-medium ${mentee.statusType === 'success'
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                                        }`}
                                                >
                                                    {mentee.status}
                                                </Badge>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground -mr-2">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                                                    <span>Goal Progress</span>
                                                    <span className="font-bold text-foreground">{mentee.progress}%</span>
                                                </div>
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full"
                                                        style={{ width: `${mentee.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between text-xs text-muted-foreground pt-3 border-t border-dashed">
                                                <span>Last contact: <span className="font-medium text-foreground">{mentee.lastContact}</span></span>
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1.5 rounded-md">
                                                    <Calendar className="size-3.5" />
                                                    {mentee.nextMeeting}
                                                </div>
                                                <Button size="icon" variant="secondary" className="size-8 rounded-full shadow-sm">
                                                    <MessageSquare className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </section>
            </main>
        </div>
    );
}
