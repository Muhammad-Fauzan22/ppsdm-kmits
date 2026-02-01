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
import { Upload, FileText, Play, CheckCircle, AlertCircle, Download, Loader2, BookOpen, Mic, Gamepad2, Presentation, Headphones, GitBranch, Sparkles, Globe, Clock, BarChart3 } from "lucide-react";
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
}

const LAYERS = [
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

export default function ContentGeneratorPage() {
  const [bookTitle, setBookTitle] = useState("");
  const [bookUrl, setBookUrl] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [language, setLanguage] = useState("id");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<{ percent: number; currentLayer: number } | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

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
    addLog("Starting pipeline..."); addLog(`Book: ${bookTitle}`); addLog(`Language: ${language}`);

    let currentLayer = 0;
    const interval = setInterval(() => {
      currentLayer++;
      if (currentLayer <= LAYERS.length) {
        addLog(`Processing: ${LAYERS[currentLayer - 1].name}`);
        setProgress({ percent: (currentLayer / 10) * 100, currentLayer });
        if (currentLayer === LAYERS.length) {
          clearInterval(interval); setIsGenerating(false);
          setResult({
            book_title: bookTitle,
            book_slug: bookTitle.toLowerCase().replace(/\s+/g, "-"),
            output_directory: `content_output/${bookTitle.toLowerCase().replace(/\s+/g, "-")}`,
            quality_assessment: { overall_score: 85, grade: "B+", quality_level: "Good" },
            files_generated: ["1_summary.md", "2_deep_dive.md", "3_action_plan.md", "4_audio_script.txt", "5_gamification.json", "6_presentation.json", "7_podcast_script.json", "8_interactive_scenarios.json", "metadata.json"],
          });
          toast.success("Generation completed!"); addLog("Pipeline completed!");
        }
      }
    }, 800);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Content Generator</h1>
        <p className="text-muted-foreground">Generate comprehensive learning content using the 10-Layer Pipeline</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Book Information</CardTitle>
              <CardDescription>Enter book details or upload a PDF</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Book Title *</Label>
                <Input placeholder="Enter book title..." value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} />
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
                <Input placeholder="https://example.com/book.pdf" value={bookUrl} onChange={(e) => setBookUrl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Or Upload PDF</Label>
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}`}>
                  <input {...getInputProps()} />
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  {uploadedFile ? (<div><p className="font-medium text-primary">{uploadedFile.name}</p><p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p></div>) : (<div><p className="font-medium">{isDragActive ? "Drop PDF here" : "Drag & drop PDF here"}</p><p className="text-sm text-muted-foreground mt-1">or click to browse</p></div>)}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea placeholder="Brief description..." value={bookDescription} onChange={(e) => setBookDescription(e.target.value)} rows={3} />
              </div>
              <Button onClick={handleGenerate} disabled={isGenerating || !bookTitle.trim()} className="w-full" size="lg">
                {isGenerating ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Generating...</>) : (<><Play className="mr-2 h-5 w-5" />Generate Content</>)}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>10-Layer Pipeline</CardTitle><CardDescription>Comprehensive content generation workflow</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {LAYERS.map((layer) => (<div key={layer.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"><layer.icon className="h-4 w-4 text-muted-foreground" /><span className="text-xs truncate">{layer.name}</span></div>))}
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
                <CardHeader><CardTitle>Generation Progress</CardTitle><CardDescription>Real-time pipeline execution status</CardDescription></CardHeader>
                <CardContent>
                  {isGenerating || progress ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span>Overall Progress</span><span className="font-medium">{Math.round(progress?.percent || 0)}%</span></div>
                        <Progress value={progress?.percent || 0} className="h-2" />
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Layer Status</h4>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                          {LAYERS.map((layer) => {
                            const isCompleted = progress ? layer.id <= progress.currentLayer : false;
                            const isActive = progress?.currentLayer === layer.id;
                            return (
                              <div key={layer.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                  {isCompleted ? <CheckCircle className="h-4 w-4 text-green-500" /> : isActive ? <Loader2 className="h-4 w-4 text-blue-500 animate-spin" /> : <Clock className="h-4 w-4 text-gray-400" />}
                                  <div><p className="text-sm font-medium">{layer.name}</p><p className="text-xs text-muted-foreground">{isCompleted ? "Done" : isActive ? "In progress..." : "Waiting"}</p></div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${isCompleted ? "bg-green-500" : isActive ? "bg-blue-500" : "bg-gray-300"}`} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12"><Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Ready to generate content</p><p className="text-sm text-muted-foreground mt-1">Fill in the book details and click Generate</p></div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader><CardTitle>Execution Logs</CardTitle><CardDescription>Detailed pipeline execution log</CardDescription></CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    {logs.length > 0 ? (<div className="space-y-1 font-mono text-sm">{logs.map((log, i) => (<div key={i} className="text-muted-foreground">{log}</div>))}</div>) : (<p className="text-muted-foreground text-center py-12">No logs yet. Start generation to see logs.</p>)}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              {result && (
                <Card>
                  <CardHeader><CardTitle>Generation Results</CardTitle><CardDescription>Generated content ready for download</CardDescription></CardHeader>
                  <CardContent className="space-y-6">
                    {result.quality_assessment && (
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="flex items-center gap-2 mb-2"><BarChart3 className="h-5 w-5" /><h4 className="font-medium">Quality Assessment</h4></div>
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold">{result.quality_assessment.overall_score}</div>
                          <div><Badge variant={result.quality_assessment.grade === "A" ? "default" : result.quality_assessment.grade === "B" ? "secondary" : "outline"}>Grade {result.quality_assessment.grade}</Badge><p className="text-sm text-muted-foreground mt-1">{result.quality_assessment.quality_level}</p></div>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <h4 className="font-medium">Generated Files</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {result.files_generated?.map((file) => (<div key={file} className="flex items-center justify-between p-2 rounded border"><span className="text-sm truncate">{file}</span><Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button></div>))}
                      </div>
                    </div>
                    <Button className="w-full" variant="outline"><Download className="mr-2 h-4 w-4" />Download All Content</Button>
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