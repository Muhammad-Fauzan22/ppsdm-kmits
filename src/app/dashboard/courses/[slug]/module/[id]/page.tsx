
import { createClient } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlayCircle, BookOpen } from "lucide-react"; // Import new icon
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs

// Hybrid CDN Components
import { VideoPlayer } from "@/components/lms-content/VideoPlayer";
import { PodcastPlayer } from "@/components/lms-content/PodcastPlayer";
import { SlideViewer } from "@/components/lms-content/SlideViewer";
import { ModuleReader } from "@/components/lms-content/ModuleReader";
import { QuizWidget } from "@/components/lms-content/QuizWidget";
import { Card } from "@/components/ui/card";

interface PageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

export const revalidate = 0;

export default async function ModulePage({ params }: PageProps) {
  const resolvedParams = await params;
  const supabase = createClient();
  const module_id = resolvedParams.id;

  // Get User Session for Gamification
  const { data: { user } } = await supabase.auth.getUser();

  const { data: moduleData } = await supabase
    .from("modules")
    .select("*, course:courses(title), lessons(*)")
    .eq("id", module_id)
    .single();

  const lessons = moduleData?.lessons?.sort((a: any, b: any) => a.order_index - b.order_index) || [];
  const activeLesson = lessons[0];

  // Fetch Quiz Data (Assume mock for now as we don't have DB data populated via factory yet)
  // In real app, we would fetch: supabase.from('quizzes').select('*, questions(*)').eq('module_id', module_id)
  const mockQuizData = [
    {
      id: "q1",
      text: "What is the primary characteristic of Transactional Leadership?",
      options: ["Focus on exchange/rewards", "Focus on inspiration", "Focus on hands-off approach", "Focus on servant mindset"],
      correct_answer: "Focus on exchange/rewards",
      explanation: "Transactional leadership is based on a system of rewards and punishments to manage followers."
    },
    {
      id: "q2",
      text: "Which of these is NOT a component of Transformational Leadership?",
      options: ["Idealized Influence", "Inspirational Motivation", "Contingent Reward", "Intellectual Stimulation"],
      correct_answer: "Contingent Reward",
      explanation: "Contingent Reward is a trait of Transactional Leadership. Transformational leaders use the 4 I's."
    }
  ];

  // HYBRID CONTENT MAPPING
  // Fallback to demo assets if DB columns are empty
  const podcastUrl = moduleData?.podcast_url || "/demos/Dasar_Kepemimpinan_podcast.mp3";
  const slideEmbedUrl = moduleData?.slide_url || "https://docs.google.com/presentation/d/e/2PACX-1vS_EXAMPLE/embed?start=false&loop=false&delayms=3000";
  const videoId = moduleData?.video_url || "dQw4w9WgXcQ";

  // Check if slide exists
  const hasSlide = !!(moduleData?.slide_url || activeLesson?.title?.includes("Introduction"));

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* LEFT: Content Area */}
      <div className="w-full lg:w-[70%] flex flex-col border-r border-border overflow-y-auto bg-background/50 scroll-smooth">

        {/* HERO: Video or Slide */}
        <div className="p-6 pb-0 max-w-5xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{activeLesson?.title || moduleData?.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">Module: {moduleData?.title}</p>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {moduleData?.course?.title}
            </Badge>
          </div>

          {/* Content Switcher */}
          {moduleData?.video_url ? (
            <VideoPlayer videoId={videoId} />
          ) : (
            hasSlide ? (
              <SlideViewer embedUrl={slideEmbedUrl} />
            ) : (
              <div className="h-48 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">No Media Available</div>
            )
          )}
        </div>

        {/* TEXT READER */}
        <div className="p-6 max-w-5xl mx-auto w-full">
          <ModuleReader content={activeLesson?.content || moduleData?.content_markdown || "*No textual content available.*"} />
        </div>
      </div>

      {/* RIGHT: Sidebar (Navigation & Quiz) */}
      <div className="w-full lg:w-[30%] bg-muted/20 flex flex-col border-l border-border h-full">
        <Tabs defaultValue="quiz" className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="outline">Outline</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: OUTLINE */}
          <TabsContent value="outline" className="flex-1 p-0 m-0">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-2">
                {lessons.map((lesson: any, idx: number) => (
                  <div
                    key={lesson.id}
                    className={cn(
                      "p-3 rounded-lg flex items-start cursor-pointer transition-all border group",
                      idx === 0
                        ? "bg-background border-primary/50 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-background/50 hover:border-border"
                    )}
                  >
                    <div className="mt-1 mr-3 text-muted-foreground group-hover:text-primary transition-colors">
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </div>
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium leading-snug", idx === 0 ? "text-primary" : "text-foreground")}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center mt-1.5 space-x-2">
                        <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">10 min</span>
                        {idx === 0 && <span className="text-[10px] text-primary flex items-center"><PlayCircle className="w-3 h-3 mr-1" /> Playing</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* TAB 2: QUIZ */}
          <TabsContent value="quiz" className="flex-1 p-4 m-0 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Module Challenge
            </h3>
            <QuizWidget
              moduleId={module_id}
              userId={user?.id}
              quizData={mockQuizData}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* STICKY PODCAST BUTTON (If URL exists) */}
      {podcastUrl && (
        <PodcastPlayer
          src={podcastUrl}
          title={`Audio: ${moduleData?.title}`}
        />
      )}
    </div>
  );
}
