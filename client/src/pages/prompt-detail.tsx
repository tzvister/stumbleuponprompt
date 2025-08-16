import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { extractIdFromSlug, createPromptUrl } from "../../../lib/seo-utils";
import { SEOHead } from "@/components/seo-head";
import { PromptCard } from "@/components/prompt-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Prompt } from "@shared/schema";

export default function PromptDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  
  const promptId = slug ? extractIdFromSlug(slug) : null;
  
  const { data: prompt, isLoading, error } = useQuery<Prompt>({
    queryKey: ['/api/prompts', promptId],
    enabled: !!promptId,
  });

  const { data: allPrompts = [] } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded-lg w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
              <div className="h-96 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Prompt Not Found | StumbleUponPrompt" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Prompt Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The prompt you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/")} variant="default">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = allPrompts.findIndex((p: Prompt) => p.id === prompt.id);
  const previousPrompt = currentIndex > 0 ? allPrompts[currentIndex - 1] : null;
  const nextPrompt = currentIndex < allPrompts.length - 1 ? allPrompts[currentIndex + 1] : null;

  const handleNext = () => {
    if (nextPrompt) {
      const nextUrl = createPromptUrl(nextPrompt.title, nextPrompt.id);
      navigate(nextUrl);
    }
  };

  const handlePrevious = () => {
    if (previousPrompt) {
      const previousUrl = createPromptUrl(previousPrompt.title, previousPrompt.id);
      navigate(previousUrl);
    }
  };

  const handleUse = () => {
    // Increment use count
    fetch(`/api/prompts/${prompt.id}/use`, { method: 'POST' })
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        prompt={prompt} 
        canonicalUrl={window.location.href}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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

          {/* Prompt Card */}
          <div className="mb-12">
            <PromptCard 
              prompt={prompt} 
              onNext={handleNext}
              onPrevious={handlePrevious}
              onUse={handleUse}
            />
          </div>

          {/* Related Prompts */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Related Prompts</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {allPrompts
                .filter((p: Prompt) => p.id !== prompt.id && p.tags?.some((tag: string) => prompt.tags?.includes(tag)))
                .slice(0, 4)
                .map((relatedPrompt: Prompt) => (
                  <div 
                    key={relatedPrompt.id} 
                    className="cursor-pointer" 
                    onClick={() => {
                      const relatedUrl = createPromptUrl(relatedPrompt.title, relatedPrompt.id);
                      navigate(relatedUrl);
                    }}
                  >
                    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold mb-2">{relatedPrompt.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{relatedPrompt.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {relatedPrompt.tags?.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}