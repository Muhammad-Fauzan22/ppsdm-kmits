
"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw } from "lucide-react";
import { completeModule } from "@/app/actions/progress";

interface Question {
    id: string;
    text: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

interface QuizWidgetProps {
    moduleId: string;
    quizData: Question[];
    userId?: string;
}

export function QuizWidget({ moduleId, quizData, userId }: QuizWidgetProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
    const [isAnswered, setIsAnswered] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [quizCompleted, setQuizCompleted] = React.useState(false);

    const currentQuestion = quizData[currentIndex];
    const isCorrect = selectedOption === currentQuestion?.correct_answer;

    const handleOptionSelect = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
    };

    const handleSubmit = () => {
        if (!selectedOption) return;
        setIsAnswered(true);
        if (selectedOption === currentQuestion.correct_answer) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNext = async () => {
        if (currentIndex < quizData.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setQuizCompleted(true);
            // Trigger completion logic if passing
            const finalScore = Math.round(((score + (isCorrect ? 1 : 0)) / quizData.length) * 100);
            if (userId && finalScore >= 70) {
                await completeModule({ moduleId, userId, score: finalScore, xpEarned: 50 });
            } else if (userId) {
                // Optional: Mark as completed but 0 XP if failed? Or just don't verify.
                // For now, let's only complete if passed as per prompt "Jika nilai di atas KKM"
            }
        }
    };

    const handleRetry = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setQuizCompleted(false);
    }

    if (!quizData?.length) {
        return <div className="p-4 text-center text-muted-foreground">No quiz available for this module.</div>;
    }

    if (quizCompleted) {
        const finalScore = Math.round((score / quizData.length) * 100);
        const passed = finalScore >= 70;

        return (
            <Card className="w-full h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in-up border-primary/20">
                <div className={`h-24 w-24 rounded-full flex items-center justify-center mb-6 ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <Trophy className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl mb-2">{passed ? "Quiz Completed!" : "Keep Practicing!"}</CardTitle>
                <p className="text-muted-foreground mb-6">You scored {finalScore}%</p>

                {passed && <div className="bg-secondary/50 px-4 py-2 rounded-lg text-sm mb-6 text-primary font-medium">+50 XP Gained</div>}

                <div className="flex gap-4">
                    <Button variant="outline" onClick={handleRetry}><RotateCcw className="mr-2 h-4 w-4" /> Retry</Button>
                    {passed && <Button>Next Module <ArrowRight className="ml-2 h-4 w-4" /></Button>}
                </div>
            </Card>
        );
    }

    return (
        <Card className="w-full h-full flex flex-col border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Question {currentIndex + 1} of {quizData.length}</span>
                    <span className="text-xs font-semibold text-primary">{score} Correct</span>
                </div>
                <CardTitle className="text-lg leading-relaxed">{currentQuestion.text}</CardTitle>
            </CardHeader>

            <CardContent className="px-0 flex-1 overflow-y-auto space-y-3">
                {currentQuestion.options.map((option, idx) => {
                    let variant = "outline";
                    if (isAnswered) {
                        if (option === currentQuestion.correct_answer) variant = "success"; // Pseudo-class handling via style
                        else if (option === selectedOption) variant = "destructive";
                    } else if (option === selectedOption) {
                        variant = "default";
                    }

                    const isSelected = option === selectedOption;
                    const isCorrectOption = option === currentQuestion.correct_answer;

                    return (
                        <div
                            key={idx}
                            onClick={() => handleOptionSelect(option)}
                            className={`
                    p-4 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between
                    ${!isAnswered && isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50 border-border'}
                    ${isAnswered && isCorrectOption ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-300' : ''}
                    ${isAnswered && isSelected && !isCorrectOption ? 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300' : ''}
                `}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`h-6 w-6 rounded-full border flex items-center justify-center text-xs font-medium ${isSelected || (isAnswered && isCorrectOption) ? 'border-current' : 'text-muted-foreground'}`}>
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="text-sm font-medium">{option}</span>
                            </div>

                            {isAnswered && isCorrectOption && <CheckCircle className="h-5 w-5 text-green-600" />}
                            {isAnswered && isSelected && !isCorrectOption && <XCircle className="h-5 w-5 text-red-600" />}
                        </div>
                    )
                })}

                {isAnswered && !isCorrect && (
                    <div className="mt-4 p-4 rounded-lg bg-muted text-sm text-muted-foreground animate-fade-in">
                        <span className="font-semibold block mb-1 text-foreground">Explanation:</span>
                        {currentQuestion.explanation}
                    </div>
                )}
            </CardContent>

            <CardFooter className="px-0 pt-4">
                {!isAnswered ? (
                    <Button className="w-full" onClick={handleSubmit} disabled={!selectedOption}>Submit Answer</Button>
                ) : (
                    <Button className="w-full" onClick={handleNext}>
                        {currentIndex === quizData.length - 1 ? "Finish Quiz" : "Next Question"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
