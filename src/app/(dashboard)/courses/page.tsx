
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, PlayCircle } from "lucide-react";

export const revalidate = 0; // Ensure real-time data

export default async function CoursesPage() {
    const supabase = createClient();
    const { data: courses } = await supabase
        .from("courses")
        .select("*, modules(count)")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Browse Courses</h1>
                    <p className="text-muted-foreground">
                        Explore our AI-generated curriculum tailored for engineering excellence.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses?.map((course) => (
                    <Link key={course.id} href={`/courses/${course.id}/module/first`}>
                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-card border-border">
                            <div className="aspect-video w-full bg-secondary/30 relative flex items-center justify-center">
                                {course.thumbnail_url ? (
                                    <img src={course.thumbnail_url} alt={course.title} className="object-cover w-full h-full rounded-t-lg" />
                                ) : (
                                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                                )}
                                <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors" />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="line-clamp-1 text-lg font-semibold">{course.title}</CardTitle>
                                </div>
                                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                                    {course.description || "No description available."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                                    <div className="flex items-center">
                                        <PlayCircle className="mr-1 h-4 w-4" />
                                        {course.modules?.[0]?.count || 0} Modules
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {course.category || "General"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {(!courses || courses.length === 0) && (
                    <div className="col-span-full py-12 text-center">
                        <p className="text-muted-foreground">No courses found. Run the AI factory to generate content.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
