import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dice1, Search, Plus } from "lucide-react";
import { PromptCard } from "@/components/prompt-card";
import { FilterSidebar } from "@/components/filter-sidebar";
import { CreatorModal } from "@/components/creator-modal";
import { Prompt } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState({
    tags: [] as string[],
    models: [] as string[],
    tokenRange: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true); // Collapsed by default
  const queryClient = useQueryClient();

  // Fetch all prompts
  const { data: allPrompts, isLoading } = useQuery({
    queryKey: ["/api/prompts"],
    select: (data) => data as Prompt[],
  });

  // Stumble (get random prompt)
  const stumbleMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/prompts/random");
      return response.json();
    },
    onSuccess: (prompt: Prompt) => {
      setCurrentPrompt(prompt);
      // Find the index of this prompt in the current filtered list
      const index = prompts.findIndex(p => p.id === prompt.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch random prompt",
        variant: "destructive",
      });
    },
  });

  // Track prompt usage
  const usePromptMutation = useMutation({
    mutationFn: async (promptId: string) => {
      await apiRequest("POST", `/api/prompts/${promptId}/use`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
    },
  });

  // Filter and search prompts
  useEffect(() => {
    if (!allPrompts) return;

    let filtered = [...allPrompts];

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(p => filters.tags.some(tag => p.tags.includes(tag)));
    }

    // Apply model filter
    if (filters.models.length > 0) {
      filtered = filtered.filter(p => 
        filters.models.some(model => p.compatibleModels.includes(model))
      );
    }

    // Apply token range filter
    if (filters.tokenRange && filters.tokenRange !== "all") {
      switch (filters.tokenRange) {
        case "short":
          filtered = filtered.filter(p => (p.estimatedTokens || 0) < 100);
          break;
        case "medium":
          filtered = filtered.filter(p => {
            const tokens = p.estimatedTokens || 0;
            return tokens >= 100 && tokens <= 500;
          });
          break;
        case "long":
          filtered = filtered.filter(p => (p.estimatedTokens || 0) > 500);
          break;
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setPrompts(filtered);
    
    // Reset to first prompt if current prompt is not in filtered results
    if (filtered.length > 0) {
      if (!currentPrompt || !filtered.find(p => p.id === currentPrompt.id)) {
        setCurrentPrompt(filtered[0]);
        setCurrentIndex(0);
      }
    } else {
      setCurrentPrompt(null);
      setCurrentIndex(0);
    }
  }, [allPrompts, filters, searchQuery, currentPrompt]);

  const handleStumble = () => {
    stumbleMutation.mutate();
  };

  const handleNext = () => {
    if (prompts.length === 0) return;
    const newIndex = (currentIndex + 1) % prompts.length;
    setCurrentIndex(newIndex);
    setCurrentPrompt(prompts[newIndex]);
  };

  const handlePrevious = () => {
    if (prompts.length === 0) return;
    const newIndex = currentIndex === 0 ? prompts.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setCurrentPrompt(prompts[newIndex]);
  };

  const handleUsePrompt = () => {
    if (currentPrompt) {
      usePromptMutation.mutate(currentPrompt.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading prompts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Dice1 className="text-2xl text-foreground" />
                <h1 className="text-xl font-bold text-foreground">StumbleUponPrompt</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Discover Amazing
            <span className="text-primary"> AI Prompts</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A dead-simple way to stumble through high-quality prompts. Preview them, customize them, and try them instantly in your favorite AI model.
          </p>
          
          {/* Stumble Button */}
          <div className="mb-8">
            <Button onClick={handleStumble} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold rounded-full">
              STUMBLE
            </Button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground">
            <span>Try instantly in:</span>
            <div className="flex items-center space-x-3">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">ChatGPT</span>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">Claude</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Gemini</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">OpenRouter</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {/* Filter Sidebar */}
          <div className="w-full">
            <FilterSidebar 
              onFiltersChange={setFilters} 
              isCollapsed={isFiltersCollapsed}
              onToggleCollapse={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
            />
          </div>

          {/* Prompt Display */}
          <div className="w-full">
            {currentPrompt ? (
              <PromptCard
                prompt={currentPrompt}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onUse={handleUsePrompt}
              />
            ) : (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <h3 className="text-xl font-semibold text-card-foreground mb-4">No prompts found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or click the stumble button to discover a random prompt.
                </p>
                <Button onClick={handleStumble} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Dice1 className="mr-2 h-4 w-4" />
                  Stumble a Prompt
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Create Button */}
      <Button
        onClick={() => setIsCreatorModalOpen(true)}
        className="fixed bottom-6 right-6 bg-accent hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Creator Modal */}
      <CreatorModal 
        open={isCreatorModalOpen}
        onOpenChange={setIsCreatorModalOpen}
      />
    </div>
  );
}
