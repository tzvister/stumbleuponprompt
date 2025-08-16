import { useState } from "react";
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
  generateGeminiLink, 
  generateOpenRouterLink 
} from "@/lib/deep-links";
import { extractVariables, formatVariableName } from "@/lib/prompt-utils";

interface PromptCardProps {
  prompt: Prompt;
  onNext: () => void;
  onPrevious: () => void;
  onUse: () => void;
}

export function PromptCard({ prompt, onNext, onPrevious, onUse }: PromptCardProps) {
  const [variables, setVariables] = useState<Record<string, string>>({});

  const promptVariables = extractVariables(prompt.content);

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({ ...prev, [variable]: value }));
  };

  const handleCopyPrompt = async () => {
    let finalPrompt = prompt.content;
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

  const handleTryInPlatform = (platform: 'chatgpt' | 'claude' | 'gemini' | 'openrouter') => {
    onUse();
    
    let link = '';
    switch (platform) {
      case 'chatgpt':
        link = generateChatGPTLink({ prompt: prompt.content, variables });
        break;
      case 'claude':
        link = generateClaudeLink({ prompt: prompt.content, variables });
        break;
      case 'gemini':
        link = generateGeminiLink({ prompt: prompt.content, variables });
        break;
      case 'openrouter':
        link = generateOpenRouterLink({ prompt: prompt.content, variables });
        break;
    }

    window.open(link, '_blank');
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
      {/* Navigation - Sticky */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-4 rounded-t-xl z-10">
        <div className="flex justify-between items-center">
          <Button onClick={onPrevious} className="bg-primary hover:bg-blue-700 text-white">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-4">
            {/* Share button moved to title area */}
          </div>
          
          <Button onClick={onNext} className="bg-primary hover:bg-blue-700 text-white">
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-slate-900">
                {prompt.title}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleShare} className="text-slate-400 hover:text-slate-600">
                <Share className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-slate-600 mb-4">
              {prompt.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {prompt.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-700">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="text-right ml-4">
            <div className="text-sm text-slate-500">
              ~{prompt.estimatedTokens} tokens
            </div>
          </div>
        </div>

        {/* Variable Fields */}
        {promptVariables.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-slate-900 mb-3">Customize Variables</h4>
            <div className="space-y-3">
              {promptVariables.map(variable => (
                <div key={variable}>
                  <Label className="text-sm font-medium text-slate-700 mb-1 block">
                    {formatVariableName(variable)}
                  </Label>
                  <Input
                    placeholder={`Enter value for {${variable}}`}
                    value={variables[variable] || ''}
                    onChange={(e) => handleVariableChange(variable, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Button
            onClick={() => handleTryInPlatform('chatgpt')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            ChatGPT
          </Button>
          <Button
            onClick={() => handleTryInPlatform('claude')}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Claude
          </Button>
          <Button
            onClick={() => handleTryInPlatform('gemini')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Gemini
          </Button>
          <Button
            onClick={() => handleTryInPlatform('openrouter')}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            OpenRouter
          </Button>
        </div>

        {/* Prompt Preview */}
        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-slate-900">Prompt Preview</h4>
            <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="bg-white border border-slate-200 rounded-md p-4 font-mono text-sm whitespace-pre-wrap">
            {prompt.content}
          </div>
        </div>

        {/* Prompt Meta */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Created by</h4>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {prompt.creatorInitials}
                  </span>
                </div>
                <span className="text-slate-600">{prompt.creatorName}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Used {prompt.useCount?.toLocaleString() || 0} times</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
