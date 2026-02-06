import { AlertCircle, BookOpen, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RemedialAction {
    resource_id: string;
    message: string;
}

interface ResultFeedbackProps {
    isCorrect: boolean; // Score 3 dianggap correct/optimal
    userChoiceText: string;
    feedbackTag: string;
    remedial?: RemedialAction | null;
}

export function ResultFeedbackCard({ isCorrect, userChoiceText, feedbackTag, remedial }: ResultFeedbackProps) {
    // Tentukan warna berdasarkan kualitas jawaban
    const statusColor = isCorrect ? "border-l-4 border-l-green-500" : "border-l-4 border-l-amber-500";
    const icon = isCorrect ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-amber-600" />;

    return (
        <Card className={`mb-4 ${statusColor} bg-card/50`}>
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        {isCorrect ? "Analisis Tepat (Senior Level)" : "Analisis Perlu Perbaikan"}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="grid gap-4">
                {/* Jawaban User */}
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Jawaban Anda:</p>
                    <p className="font-medium italic">&quot;{userChoiceText}&quot;</p>
                </div>

                {/* Feedback Spesifik (Micro-Learning) */}
                {!isCorrect && remedial && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md flex flex-col gap-2">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                            💡 Coach&apos;s Note:
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            {remedial.message}
                        </p>

                        {/* Tombol Action ke Materi */}
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-2 border-amber-200 hover:bg-amber-100 text-amber-800"
                            onClick={() => window.open(`/library/${remedial.resource_id}`, '_blank')}
                        >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Pelajari Konsep Ini (5 Menit)
                        </Button>
                    </div>
                )}

                {isCorrect && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                        Sempurna. Anda telah menunjukkan pola pikir sistematis yang matang. Pertahankan integritas ini.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
