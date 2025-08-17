import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Heart, Share, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Prompt } from "@shared/schema";
import { 
  generateChatGPTLink, 
  generateClaudeLink, 
  generateGeminiLink
} from "@/lib/deep-links";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { extractVariables, formatVariableName } from "@/lib/prompt-utils";
import { getTagColor } from "@/lib/tag-colors";

interface PromptCardProps {
  prompt: Prompt;
  onNext: () => void;
  onPrevious: () => void;
  onUse: () => void;
}

export function PromptCard({ prompt, onNext, onPrevious, onUse }: PromptCardProps) {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isLLMButtonHovered, setIsLLMButtonHovered] = useState(false);
  const [showTipOverlay, setShowTipOverlay] = useState(false);

  const promptVariables = extractVariables(prompt.prompt);

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({ ...prev, [variable]: value }));
  };

  const handleCopyPrompt = async () => {
    let finalPrompt = prompt.prompt;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      finalPrompt = finalPrompt.replace(regex, value);
    });

    try {
      await navigator.clipboard.writeText(finalPrompt);
      toast({
        title: "Copied to clipboard",
        description: "Prompt has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy prompt to clipboard",
        variant: "destructive",
      });
    }
  };

  // Check if variables are empty
  const hasEmptyVariables = promptVariables.length > 0 && promptVariables.some(variable => !variables[variable]?.trim());

  const handleTryInPlatform = async (platform: 'chatgpt' | 'claude' | 'gemini') => {
    // Show tip overlay if variables are empty
    if (hasEmptyVariables) {
      setShowTipOverlay(true);
      setTimeout(() => setShowTipOverlay(false), 2000);
    }
    
    onUse();
    
    let link = '';
    switch (platform) {
      case 'chatgpt':
        link = generateChatGPTLink({ prompt: prompt.prompt, variables });
        break;
      case 'claude':
        link = generateClaudeLink({ prompt: prompt.prompt, variables });
        break;
      case 'gemini':
        // Gemini does not reliably support URL prefill; copy then open app
        try {
          let finalPrompt = prompt.prompt;
          Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            finalPrompt = finalPrompt.replace(regex, value);
          });
          await navigator.clipboard.writeText(finalPrompt);
          toast({ title: 'Prompt copied', description: 'Paste into Gemini after it opens' });
        } catch {}
        link = 'https://gemini.google.com/app';
        break;
    }

    if (link) window.open(link, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: prompt.title,
      text: prompt.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Prompt link has been copied to your clipboard",
        });
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Prompt link has been copied to your clipboard",
      });
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border mb-6">
      {/* Navigation - Sticky */}
      <div className="sticky top-0 bg-card border-b border-border px-8 py-4 rounded-t-xl z-10">
        <div className="flex justify-between items-center">
          <Button onClick={onPrevious} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-4">
            {/* Share button moved to title area */}
          </div>
          
          <Button onClick={onNext} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-display-large text-card-foreground">
                {prompt.title}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground hover:text-card-foreground">
                <Share className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-muted-foreground mb-4">
              {prompt.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {prompt.tags.map(tag => (
                <span key={tag} className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-right ml-4">
            <div className="text-sm text-muted-foreground">
              ~{prompt.estimatedTokens} tokens
            </div>
          </div>
        </div>

        {/* Variable Fields */}
        {promptVariables.length > 0 && (
          <div className="mb-6 relative">
            <h4 className="font-display-small text-card-foreground mb-1">Customize Variables</h4>
            <p className="text-xs text-muted-foreground mb-3">To answer this well, fill your personal context below.</p>
            <div className="space-y-3">
              {promptVariables.map(variable => (
                <div key={variable}>
                  <Label className="text-sm font-medium text-card-foreground mb-1 block">
                    {formatVariableName(variable)}
                  </Label>
                  <Input
                    placeholder={(
                      (() => {
                        const map = (prompt as any)?.variableDescriptions || {};
                        return map[variable] ?? map[`{${variable}}`] ?? `Enter value for {${variable}}`;
                      })()
                    )}
                    value={variables[variable] || ''}
                    onChange={(e) => handleVariableChange(variable, e.target.value)}
                    className={`transition-all duration-300 ${
                      isLLMButtonHovered && hasEmptyVariables && !variables[variable]?.trim()
                        ? 'ring-2 ring-primary/50 ring-offset-2 animate-pulse'
                        : ''
                    }`}
                  />
                  {prompt.variableDescriptions && (prompt.variableDescriptions as Record<string, string>)[variable] && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {(prompt.variableDescriptions as Record<string, string>)[variable]}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Tip Overlay */}
            {showTipOverlay && (
              <div className="absolute top-0 left-0 right-0 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-3 rounded-lg shadow-lg border border-primary/20 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                  <span>💡</span>
                  <span>Tip: Add your details above for better results</span>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary/90"></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <Button
            onClick={() => handleTryInPlatform('chatgpt')}
            onMouseEnter={() => setIsLLMButtonHovered(true)}
            onMouseLeave={() => setIsLLMButtonHovered(false)}
            className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            ChatGPT
          </Button>
          <Button
            onClick={() => handleTryInPlatform('claude')}
            onMouseEnter={() => setIsLLMButtonHovered(true)}
            onMouseLeave={() => setIsLLMButtonHovered(false)}
            className="bg-orange-600 hover:bg-orange-700 text-white transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Claude
          </Button>
          <div className="flex flex-col items-stretch">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleTryInPlatform('gemini')}
                    onMouseEnter={() => setIsLLMButtonHovered(true)}
                    onMouseLeave={() => setIsLLMButtonHovered(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Gemini
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Copy & Paste only</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="text-[10px] text-muted-foreground mt-1 text-center uppercase tracking-wide">Copy & Paste only</div>
          </div>
          {/* OpenRouter removed */}
        </div>

        {/* Prompt Preview */}
        <div className="bg-secondary rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display-small text-card-foreground">Prompt Preview</h4>
            <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="bg-card border border-border rounded-md p-4 font-mono text-sm whitespace-pre-wrap">
            {prompt.prompt}
          </div>
        </div>

        {/* Prompt Meta */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display-small text-card-foreground">Created by</h4>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">
                    {prompt.creatorName.charAt(0)}
                  </span>
                </div>
                <span className="text-muted-foreground">{prompt.creatorName}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Used {prompt.useCount?.toLocaleString() || 0} times</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
