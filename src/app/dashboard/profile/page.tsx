import { Button } from "@/components/ui/button";
import { User, Mail, School, MapPin, Camera } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Profile</h1>
                <p className="text-slate-400">Manage your personal information and student details.</p>
            </div>

            <div className="bg-card/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur">
                {/* Cover Image */}
                <div className="h-48 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900"></div>

                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex justify-between items-end">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-[#0A0F1A] bg-slate-700 overflow-hidden flex items-center justify-center">
                                <User className="w-16 h-16 text-slate-400" />
                            </div>
                            <button className="absolute bottom-1 right-1 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <Button variant="outline" className="border-white/10 hover:bg-white/10 text-white">
                            Edit Profile
                        </Button>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-white">Mahasiswa ITS</h2>
                        <p className="text-blue-400 font-medium">Undergraduate Student • Informatics</p>
                        <div className="flex flex-wrap gap-4 pt-4 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" /> mahasiswa@student.its.ac.id
                            </div>
                            <div className="flex items-center gap-2">
                                <School className="w-4 h-4" /> Institut Teknologi Sepuluh Nopember
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Surabaya, Indonesia
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
