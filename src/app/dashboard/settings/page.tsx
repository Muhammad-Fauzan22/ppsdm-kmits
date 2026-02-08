import { Button } from "@/components/ui/button";
import { Bell, Shield, Eye, Moon, Monitor } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
                <p className="text-slate-400">Manage your account preferences and application settings.</p>
            </div>

            <div className="space-y-6">
                {/* Notifications */}
                <div className="bg-card/50 border border-white/5 rounded-xl p-6 backdrop-blur">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-500" /> Notifications
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                            <div>
                                <p className="text-white font-medium">Email Notifications</p>
                                <p className="text-xs text-slate-500">Receive weekly summaries and important updates</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                            <div>
                                <p className="text-white font-medium">Browser Push Notifications</p>
                                <p className="text-xs text-slate-500">Get real-time alerts for deadlines</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="bg-card/50 border border-white/5 rounded-xl p-6 backdrop-blur">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-purple-500" /> Appearance
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-white font-medium">Theme</p>
                                <p className="text-xs text-slate-500">Select your preferred interface theme</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-blue-500 text-blue-500 bg-blue-500/10">Dark</Button>
                                <Button variant="outline" size="sm" className="border-white/10 text-slate-400">Light</Button>
                                <Button variant="outline" size="sm" className="border-white/10 text-slate-400">System</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
