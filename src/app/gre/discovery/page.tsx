'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, BookOpen, ExternalLink, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
    id: string;
    title: string;
    description: string;
    type: string;
    url: string;
    similarity: number;
    overall_score?: number; // From join
    format_tags?: string[];
}

export default function GlobalResourceEngine() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/gre/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.success) {
                setResults(data.data);
                if (data.data.length === 0) {
                    toast({
                        title: "No results found",
                        description: "Try broader keywords or check back later.",
                    });
                }
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            toast({
                title: "Search failed",
                description: "Could not fetch resources. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const triggerIngest = async () => {
        setLoading(true);
        toast({ title: "Harvesting Started", description: `Crawling OpenAlex for "${query || 'AI'}"...` });
        try {
            const topic = query || 'artificial intelligence';
            const response = await fetch(`/api/gre/ingest/openalex?topic=${encodeURIComponent(topic)}`);
            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Harvest Complete",
                    description: `Ingested ${data.data.ingested_count} new resources.`,
                });
                handleSearch(); // Refresh results
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            toast({
                title: "Ingestion failed",
                description: "Could not harvest resources.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Global Resource Engine
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Discover high-quality academic and educational resources curated by the 12-Dimensional Quality Assessment Matrix.
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex gap-2">
                <Input
                    placeholder="Search for knowledge (e.g., Quantum Computing, Machine Learning)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="h-12"
                />
                <Button onClick={() => handleSearch()} disabled={loading} size="lg" className="h-12 w-24">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
            </div>

            <div className="flex justify-center">
                <Button variant="outline" size="sm" onClick={triggerIngest} disabled={loading || !query}>
                    <Activity className="mr-2 h-4 w-4" />
                    Trigger AI Harvest (Demo)
                </Button>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((res) => (
                    <Card key={res.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant={res.type === 'paper' ? 'secondary' : 'default'} className="mb-2">
                                    {res.type.toUpperCase()}
                                </Badge>
                                {res.format_tags?.includes('pdf') && <Badge variant="outline">PDF</Badge>}
                            </div>
                            <CardTitle className="line-clamp-2 text-lg leading-tight">
                                {res.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-4">
                                {res.description}
                            </p>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between items-center">
                            <Button variant="ghost" size="sm" asChild>
                                <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                    Access Resource <ExternalLink className="ml-2 h-3 w-3" />
                                </a>
                            </Button>
                            {/* Mock Score Display */}
                            <div className="flex items-center text-xs text-muted-foreground" title="Quality Score">
                                <BookOpen className="mr-1 h-3 w-3" />
                                Score: 0.85
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {results.length === 0 && !loading && (
                <div className="text-center py-20 text-muted-foreground">
                    Start your journey by searching for a topic above.
                </div>
            )}
        </div>
    );
}
