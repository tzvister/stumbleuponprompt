import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Prompt } from "@shared/schema";
import { createPromptUrl } from "../../../lib/seo-utils";

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const [, navigate] = useLocation();
  
  const decodedTag = decodeURIComponent(tag || '');
  
  const { data: allPrompts = [], isLoading } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts'],
  });

  const tagPrompts = allPrompts.filter((prompt: Prompt) => 
    prompt.tags?.some((promptTag: string) => 
      promptTag.toLowerCase() === decodedTag.toLowerCase()
    )
  );

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

  const pageTitle = `${decodedTag} AI Prompts | StumbleUponPrompt`;
  const pageDescription = `Explore ${tagPrompts.length} AI prompts tagged with ${decodedTag.toLowerCase()}. Find the perfect prompt for ChatGPT, Claude, and Gemini.`;

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

          {/* Tag Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                #{decodedTag}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Prompts tagged with "{decodedTag}"</h1>
            <p className="text-lg text-muted-foreground">
              {tagPrompts.length} prompts to help you with {decodedTag.toLowerCase()}-related tasks
            </p>
          </div>

          {/* Prompts Grid */}
          {tagPrompts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tagPrompts.map((prompt: Prompt) => (
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
                      {prompt.tags?.slice(0, 4).map((promptTag: string) => (
                        <span 
                          key={promptTag} 
                          className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors ${
                            promptTag.toLowerCase() === decodedTag.toLowerCase() 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary hover:bg-secondary/80'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (promptTag.toLowerCase() !== decodedTag.toLowerCase()) {
                              navigate(`/tag/${encodeURIComponent(promptTag)}`);
                            }
                          }}
                        >
                          {promptTag}
                        </span>
                      ))}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>By {prompt.creatorName}</span>
                      <div className="flex items-center gap-2">
                        <span>{prompt.estimatedTokens} tokens</span>
                        {prompt.useCount > 0 && (
                          <span>• {prompt.useCount} uses</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">No prompts found</h2>
              <p className="text-muted-foreground mb-6">
                We don't have any prompts tagged with "{decodedTag}" yet.
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