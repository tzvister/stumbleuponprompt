import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEOHead } from "@/components/seo-head";
import { PromptCard } from "@/components/prompt-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Prompt } from "@shared/schema";
import { createPromptUrl } from "../../../lib/seo-utils";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [, navigate] = useLocation();
  
  const decodedCategory = decodeURIComponent(category || '');
  
  const { data: allPrompts = [], isLoading } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts'],
  });

  const categoryPrompts = allPrompts.filter((prompt: Prompt) => 
    prompt.tags?.some((tag: string) => 
      tag.toLowerCase() === decodedCategory.toLowerCase()
    )
  );

  const handleUse = (promptId: string) => {
    fetch(`/api/prompts/${promptId}/use`, { method: 'POST' })
      .catch(console.error);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pageTitle = `${decodedCategory} AI Prompts | StumbleUponPrompt`;
  const pageDescription = `Discover high-quality ${decodedCategory.toLowerCase()} AI prompts for ChatGPT, Claude, and Gemini. ${categoryPrompts.length} curated prompts ready to use.`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={window.location.href}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              onClick={() => navigate("/")} 
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Discovery
            </Button>
          </div>

          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{decodedCategory} Prompts</h1>
            <p className="text-lg text-muted-foreground">
              {categoryPrompts.length} high-quality AI prompts for {decodedCategory.toLowerCase()}
            </p>
          </div>

          {/* Prompts Grid */}
          {categoryPrompts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryPrompts.map((prompt: Prompt) => (
                <div 
                  key={prompt.id}
                  className="cursor-pointer"
                  onClick={() => {
                    const promptUrl = createPromptUrl(prompt.title, prompt.id);
                    navigate(promptUrl);
                  }}
                >
                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow h-full">
                    <h3 className="font-semibold mb-3 text-lg">{prompt.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{prompt.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {prompt.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>By {prompt.creatorName}</span>
                      <span>{prompt.estimatedTokens} tokens</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">No prompts found</h2>
              <p className="text-muted-foreground mb-6">
                We don't have any prompts in the {decodedCategory} category yet.
              </p>
              <Button onClick={() => navigate("/")}>
                Browse All Prompts
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}