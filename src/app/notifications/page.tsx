"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, IconName } from "@/components/ui/Icon";

interface Notification {
    id: string;
    type: "achievement" | "reminder" | "feedback" | "system";
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "achievement",
        title: "Badge Unlocked! 🏆",
        message: "You earned the 'Consistent Learner' badge for completing 5 activities in a row.",
        time: "2 hours ago",
        read: false,
    },
    {
        id: "2",
        type: "reminder",
        title: "Upcoming Deadline",
        message: "Your research proposal is due in 2 days. Don't forget to submit!",
        time: "5 hours ago",
        read: false,
    },
    {
        id: "3",
        type: "feedback",
        title: "Mentor Feedback Received",
        message: "Dr. Aris has provided feedback on your weekly progress report.",
        time: "1 day ago",
        read: true,
    },
    {
        id: "4",
        type: "system",
        title: "New Program Available",
        message: "Leadership Training 2024 registrations are now open. Limited seats!",
        time: "2 days ago",
        read: true,
    },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(mockNotifications);

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const typeStyles: Record<string, { icon: IconName; color: string }> = {
        achievement: { icon: "Trophy", color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30" },
        reminder: { icon: "Clock", color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30" },
        feedback: { icon: "MessageSquare", color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30" },
        system: { icon: "Megaphone", color: "text-gray-500 bg-gray-100 dark:bg-gray-800" },
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white relative">
                            <Icon name="Bell" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Notifications</h1>
                            <p className="text-xs text-gray-500">{unreadCount} unread</p>
                        </div>
                    </Link>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-primary font-medium text-sm hover:underline"
                    >
                        Mark all as read
                    </button>
                )}
            </header>

            <main className="p-6 md:p-8 max-w-3xl mx-auto space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="flex justify-center mb-4">
                            <Icon name="BellOff" size="xl" className="text-gray-300" />
                        </div>
                        <p className="text-gray-500">No notifications yet.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-5 hover:shadow-md transition-all cursor-pointer flex gap-4 ${!notification.read ? "border-l-4 border-l-primary" : ""
                                }`}
                        >
                            {/* Icon */}
                            <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${typeStyles[notification.type].color}`}>
                                <Icon name={typeStyles[notification.type].icon} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className={`font-bold ${!notification.read ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                                        {notification.title}
                                    </h3>
                                    {!notification.read && (
                                        <span className="size-2 bg-primary rounded-full shrink-0 mt-2"></span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}
