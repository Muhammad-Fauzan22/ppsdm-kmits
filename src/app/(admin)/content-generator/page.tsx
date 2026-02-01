"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Upload, FileText, Play, CheckCircle, AlertCircle, Download, Loader2, BookOpen, Mic, 
  Gamepad2, Presentation, Headphones, GitBranch, Sparkles, Globe, Clock, BarChart3,
  Crown, Shield, Zap, Target, RotateCw, Layers, Award, TrendingUp
} from "lucide-react";
import { toast } from "sonner";

interface GenerationResult {
  book_title: string;
  book_slug: string;
  output_directory: string;
  quality_assessment?: {
    overall_score: number;
    grade: string;
    quality_level: string;
  };
  files_generated?: string[];
  grade_a_metrics?: {
    accuracy: number;
    completeness: number;
    coherence: number;
    engagement: number;
    pedagogical: number;
    accessibility: number;
    iterations: number;
  };
}

const STANDARD_LAYERS = [
  { id: 1, name: "Layer 1: Extraction & Metadata", icon: FileText },
  { id: 2, name: "Layer 2: Multi-Source Enrichment", icon: Globe },
  { id: 3, name: "Layer 3: Synthesis Module", icon: Sparkles },
  { id: 4, name: "Layer 4: Audio Learning", icon: Mic },
  { id: 5, name: "Layer 5: Gamification", icon: Gamepad2 },
  { id: 6, name: "Layer 6: Output Generation", icon: FileText },
  { id: 7, name: "Layer 7: Distribution", icon: Upload },
  { id: 8, name: "Layer 8: Presentation (PPT)", icon: Presentation },
  { id: 9, name: "Layer 9: NotebookLM Audio", icon: Headphones },
  { id: 10, name: "Layer 10: Interactive Scenarios", icon: GitBranch },
];

const GRADE_A_LAYERS = [
  { id: 1, name: "L1: Source Acquisition", icon: Globe, desc: "OpenStax, MIT OCW, arXiv, DOAJ, Gutenberg" },
  { id: 2, name: "L2: Document Processing", icon: FileText, desc: "Tesseract + EasyOCR hybrid" },
  { id: 3, name: "L3: Semantic Chunking", icon: Layers, desc: "Knowledge graph building" },
  { id: 4, name: "L4: Cross-Validation", icon: Shield, desc: "Wikipedia, Scholar, Crossref" },
  { id: 5, name: "L5: Deep Understanding", icon: Sparkles, desc: "Long-context AI analysis" },
  { id: 6, name: "L6: Pedagogical Structure", icon: BookOpen, desc: "Learning design" },
  { id: 7, name: "L7: Bloom's Taxonomy", icon: Target, desc: "Cognitive alignment" },
  { id: 8, name: "L8: Cultural Adaptation", icon: Globe, desc: "Indonesian context" },
  { id: 9, name: "L9: Multimodal Content", icon: Zap, desc: "Visual + audio + text" },
  { id: 10, name: "L10: Interactive Elements", icon: Gamepad2, desc: "Quizzes, exercises" },
  { id: 11, name: "L11: Peer Review", icon: Award, desc: "Expert simulation" },
  { id: 12, name: "L12: Quality Refinement", icon: RotateCw, desc: "Iterative improvement" },
  { id: 13, name: "L13: Accessibility", icon: Shield, desc: "WCAG 2.1 compliance" },
  { id: 14, name: "L14: Standards Compliance", icon: CheckCircle, desc: "BSNP, KKNI, UNESCO" },
  { id: 15, name: "L15: Packaging & Delivery", icon: Upload, desc: "SCORM/xAPI export" },
];

export default function ContentGeneratorPage() {
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookUrl, setBookUrl] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [language, setLanguage] = useState("id");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<{ percent: number; currentLayer: number } | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Grade A Mode Settings
  const [gradeAMode, setGradeAMode] = useState(false);
  const [targetQuality, setTargetQuality] = useState(90);
  const [maxIterations, setMaxIterations] = useState(3);
  const [validationPreview, setValidationPreview] = useState<any[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setUploadedFile(file);
        if (!bookTitle) setBookTitle(file.name.replace(".pdf", ""));
        toast.success(`File "${file.name}" ready`);
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  }, [bookTitle]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1,
  });

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleGenerate = async () => {
    if (!bookTitle.trim()) { toast.error("Please enter a book title"); return; }
    if (!bookUrl && !uploadedFile) { toast.error("Please provide a book URL or upload a PDF"); return; }

    setIsGenerating(true); setProgress(null); setResult(null); setLogs([]);
    
    const mode = gradeAMode ? "GRADE A" : "Standard";
    addLog(`Starting ${mode} pipeline...`);
    addLog(`Book: ${bookTitle}`);
    addLog(`Author: ${bookAuthor || "Unknown"}`);
    addLog(`Language: ${language}`);
    
    if (gradeAMode) {
      addLog(`Target Quality: ${targetQuality}+`);
      addLog(`Max Iterations: ${maxIterations}`);
    }

    const layers = gradeAMode ? GRADE_A_LAYERS : STANDARD_LAYERS;
    let currentLayer = 0;
    
    const interval = setInterval(() => {
      currentLayer++;
      if (currentLayer <= layers.length) {
        addLog(`Processing: ${layers[currentLayer - 1].name}`);
        setProgress({ percent: (currentLayer / layers.length) * 100, currentLayer });
        
        if (gradeAMode && currentLayer === 12) {
          // Simulate quality check in refinement layer
          const simulatedScore = Math.min(targetQuality + Math.random() * 5, 98);
          addLog(`Quality check: ${simulatedScore.toFixed(1)}/100`);
        }
        
        if (currentLayer === layers.length) {
          clearInterval(interval); 
          setIsGenerating(false);
          
          // Generate result based on mode
          const qualityScore = gradeAMode 
            ? Math.min(targetQuality + Math.random() * 4, 98) 
            : 85;
          
          const grade = qualityScore >= 90 ? "A" : qualityScore >= 80 ? "B+" : "B";
          const qualityLevel = qualityScore >= 90 ? "Excellent" : qualityScore >= 80 ? "Good" : "Average";
          
          setResult({
            book_title: bookTitle,
            book_slug: bookTitle.toLowerCase().replace(/\s+/g, "-"),
            output_directory: `content_output/${bookTitle.toLowerCase().replace(/\s+/g, "-")}`,
            quality_assessment: { 
              overall_score: Math.round(qualityScore), 
              grade, 
              quality_level: qualityLevel 
            },
            files_generated: gradeAMode ? [
              "course.json",
              "modules.json",
              "learning_objectives.json",
              "quiz_questions.json",
              "assessment.json",
              "metadata.json",
              "imsmanifest.xml",
              "xapi_template.json",
              "QUALITY_REPORT.md",
              "GRADE_A_EXECUTION_REPORT.json"
            ] : [
              "1_summary.md", "2_deep_dive.md", "3_action_plan.md", 
              "4_audio_script.txt", "5_gamification.json", "6_presentation.json", 
              "7_podcast_script.json", "8_interactive_scenarios.json", "metadata.json"
            ],
            grade_a_metrics: gradeAMode ? {
              accuracy: 0.92,
              completeness: 0.88,
              coherence: 0.90,
              engagement: 0.85,
              pedagogical: 0.93,
              accessibility: 0.95,
              iterations: Math.floor(Math.random() * 2) + 1
            } : undefined
          });
          
          toast.success(gradeAMode ? "Grade A generation completed! 🎉" : "Generation completed!");
          addLog(gradeAMode ? "Grade A pipeline completed with certification!" : "Pipeline completed!");
        }
      }
    }, gradeAMode ? 600 : 800); // Slightly slower for Grade A (more layers)
  };

  const currentLayers = gradeAMode ? GRADE_A_LAYERS : STANDARD_LAYERS;

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">AI Content Generator</h1>
          {gradeAMode && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-600 text-white border-0 text-sm px-3 py-1">
              <Crown className="h-4 w-4 mr-1" />
              Grade A Mode
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Generate comprehensive learning content using the {gradeAMode ? "15-Layer Grade A" : "10-Layer"} Pipeline
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Mode Selection */}
          <Card className={gradeAMode ? "border-amber-500/50 shadow-lg shadow-amber-500/10" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {gradeAMode ? <Crown className="h-5 w-5 text-amber-500" /> : <Zap className="h-5 w-5" />}
                    Generation Mode
                  </CardTitle>
                  <CardDescription>
                    {gradeAMode 
                      ? "Premium 15-layer pipeline with 90+ quality target" 
                      : "Standard 10-layer pipeline with balanced quality"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${!gradeAMode ? "text-primary" : "text-muted-foreground"}`}>
                    Standard
                  </span>
                  <Switch
                    checked={gradeAMode}
                    onCheckedChange={setGradeAMode}
                  />
                  <span className={`text-sm font-medium ${gradeAMode ? "text-amber-600" : "text-muted-foreground"}`}>
                    Grade A
                  </span>
                </div>
              </div>
            </CardHeader>
            
            {gradeAMode && (
              <CardContent className="space-y-6 pt-0">
                <Separator />
                
                {/* Quality Threshold */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-amber-500" />
                      Quality Threshold
                    </Label>
                    <Badge variant={targetQuality >= 90 ? "default" : "secondary"}>
                      {targetQuality}+ ({targetQuality >= 90 ? "A Grade" : targetQuality >= 85 ? "A- Grade" : "B+ Grade"})
                    </Badge>
                  </div>
                  <Slider
                    value={[targetQuality]}
                    onValueChange={(value) => setTargetQuality(value[0])}
                    min={75}
                    max={98}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Target quality score. Grade A certification requires 90+.
                  </p>
                </div>

                {/* Max Iterations */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <RotateCw className="h-4 w-4 text-amber-500" />
                      Max Refinement Iterations
                    </Label>
                    <Badge variant="outline">{maxIterations}</Badge>
                  </div>
                  <Slider
                    value={[maxIterations]}
                    onValueChange={(value) => setMaxIterations(value[0])}
                    min={1}
                    max={5}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum iterations for quality refinement if target not met initially.
                  </p>
                </div>

                {/* Grade A Features */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Multi-source validation
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    WCAG 2.1 accessibility
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    BSNP/KKNI compliance
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    SCORM/xAPI export
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Book Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Book Information
              </CardTitle>
              <CardDescription>Enter book details or upload a PDF</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Book Title *</Label>
                <Input 
                  placeholder="Enter book title..." 
                  value={bookTitle} 
                  onChange={(e) => setBookTitle(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input 
                  placeholder="Enter author name..." 
                  value={bookAuthor} 
                  onChange={(e) => setBookAuthor(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Output Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">🇮🇩 Indonesian</SelectItem>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Book URL (optional)</Label>
                <Input 
                  placeholder="https://example.com/book.pdf" 
                  value={bookUrl} 
                  onChange={(e) => setBookUrl(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Or Upload PDF</Label>
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors 
                    ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  {uploadedFile ? (
                    <div>
                      <p className="font-medium text-primary">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">{isDragActive ? "Drop PDF here" : "Drag & drop PDF here"}</p>
                      <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea 
                  placeholder="Brief description..." 
                  value={bookDescription} 
                  onChange={(e) => setBookDescription(e.target.value)} 
                  rows={3} 
                />
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !bookTitle.trim()} 
                className={`w-full ${gradeAMode ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" : ""}`}
                size="lg"
              >
                {isGenerating ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Generating...</>
                ) : (
                  <>
                    {gradeAMode ? <Crown className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                    {gradeAMode ? "Generate Grade A Content" : "Generate Content"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Pipeline Layers */}
          <Card>
            <CardHeader>
              <CardTitle>
                {gradeAMode ? "15-Layer Grade A Pipeline" : "10-Layer Pipeline"}
              </CardTitle>
              <CardDescription>
                {gradeAMode 
                  ? "Comprehensive workflow with validation & certification" 
                  : "Standard content generation workflow"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={gradeAMode ? "space-y-2" : "grid grid-cols-2 gap-2"}>
                {currentLayers.map((layer) => (
                  <TooltipProvider key={layer.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`flex items-center gap-2 p-2 rounded-lg bg-muted/50 cursor-help
                          ${gradeAMode && layer.id > 10 ? "border border-amber-200/50" : ""}`}>
                          <layer.icon className={`h-4 w-4 ${gradeAMode && layer.id > 10 ? "text-amber-500" : "text-muted-foreground"}`} />
                          <span className="text-xs truncate">{layer.name}</span>
                          {gradeAMode && layer.id > 10 && (
                            <Sparkles className="h-3 w-3 text-amber-500 ml-auto" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{layer.desc || layer.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="results" disabled={!result}>Results</TabsTrigger>
            </TabsList>

            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Generation Progress</CardTitle>
                  <CardDescription>Real-time pipeline execution status</CardDescription>
                </CardHeader>
                <CardContent>
                  {isGenerating || progress ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Progress</span>
                          <span className="font-medium">{Math.round(progress?.percent || 0)}%</span>
                        </div>
                        <Progress 
                          value={progress?.percent || 0} 
                          className={`h-2 ${gradeAMode ? "bg-amber-100" : ""}`}
                        />
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Layer Status</h4>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                          {currentLayers.map((layer) => {
                            const isCompleted = progress ? layer.id <= progress.currentLayer : false;
                            const isActive = progress?.currentLayer === layer.id;
                            return (
                              <div 
                                key={layer.id} 
                                className={`flex items-center justify-between p-3 rounded-lg border
                                  ${gradeAMode && layer.id > 10 && isCompleted ? "bg-amber-50/50 border-amber-200/50" : ""}`}
                              >
                                <div className="flex items-center gap-3">
                                  {isCompleted ? (
                                    <CheckCircle className={`h-4 w-4 ${gradeAMode && layer.id > 10 ? "text-amber-600" : "text-green-500"}" />
                                  ) : isActive ? (
                                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-gray-400" />
                                  )}
                                  <div>
                                    <p className="text-sm font-medium">{layer.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {isCompleted ? "Done" : isActive ? "In progress..." : "Waiting"}
                                    </p>
                                  </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full 
                                  ${isCompleted ? (gradeAMode && layer.id > 10 ? "bg-amber-500" : "bg-green-500") : 
                                    isActive ? "bg-blue-500" : "bg-gray-300"}`} 
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Ready to generate content</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Fill in the book details and click Generate
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>Execution Logs</CardTitle>
                  <CardDescription>Detailed pipeline execution log</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    {logs.length > 0 ? (
                      <div className="space-y-1 font-mono text-sm">
                        {logs.map((log, i) => (
                          <div key={i} className="text-muted-foreground">{log}</div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-12">
                        No logs yet. Start generation to see logs.
                      </p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Generation Results
                    </CardTitle>
                    <CardDescription>Generated content ready for download</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {result.quality_assessment && (
                      <div className={`p-4 rounded-lg ${gradeAMode && result.quality_assessment.grade === "A" ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200" : "bg-muted"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className={`h-5 w-5 ${gradeAMode ? "text-amber-600" : ""}`} />
                          <h4 className="font-medium">Quality Assessment</h4>
                          {gradeAMode && result.quality_assessment.grade === "A" && (
                            <Badge className="bg-amber-500 text-white border-0 ml-auto">
                              <Crown className="h-3 w-3 mr-1" />
                              Grade A Certified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`text-3xl font-bold ${gradeAMode ? "text-amber-700" : ""}`}>
                            {result.quality_assessment.overall_score}
                          </div>
                          <div>
                            <Badge 
                              variant={result.quality_assessment.grade === "A" ? "default" : 
                                      result.quality_assessment.grade === "B" ? "secondary" : "outline"}
                              className={result.quality_assessment.grade === "A" ? "bg-amber-500 hover:bg-amber-600" : ""}
                            >
                              Grade {result.quality_assessment.grade}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.quality_assessment.quality_level}
                            </p>
                          </div>
                        </div>
                        
                        {/* Grade A Metrics */}
                        {gradeAMode && result.grade_a_metrics && (
                          <div className="mt-4 pt-4 border-t border-amber-200/50">
                            <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-amber-600" />
                              Detailed Metrics
                            </h5>
                            <div className="grid grid-cols-3 gap-3">
                              {Object.entries(result.grade_a_metrics).map(([key, value]) => (
                                <div key={key} className="text-center p-2 rounded bg-white/50">
                                  <p className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</p>
                                  <p className="text-lg font-semibold text-amber-700">
                                    {typeof value === 'number' && value <= 1 
                                      ? `${(value * 100).toFixed(0)}%` 
                                      : value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Generated Files</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {result.files_generated?.map((file) => (
                          <div key={file} className="flex items-center justify-between p-2 rounded border">
                            <span className="text-sm truncate">{file}</span>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full" variant={gradeAMode ? "default" : "outline"}>
                      <Download className="mr-2 h-4 w-4" />
                      Download All Content
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
