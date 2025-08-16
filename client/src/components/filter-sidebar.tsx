import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp, Filter, ExternalLink } from "lucide-react";
import { getTagColor } from "@/lib/tag-colors";
import { Prompt } from "@shared/schema";

interface FilterSidebarProps {
  onFiltersChange: (filters: {
    tags: string[];
    models: string[];
    tokenRange: string;
  }) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}


export function FilterSidebar({ onFiltersChange, isCollapsed, onToggleCollapse }: FilterSidebarProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [tokenRange, setTokenRange] = useState<string>("");
  const [, navigate] = useLocation();

  // Fetch all prompts to extract available tags and models
  const { data: allPrompts = [] } = useQuery({
    queryKey: ["/api/prompts"],
    select: (data) => data as Prompt[],
  });

  // Extract unique tags from all prompts with counts
  const tagCounts = allPrompts.reduce((acc: Record<string, number>, prompt) => {
    prompt.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});
  
  const availableTags = Object.keys(tagCounts).sort();
  
  // Extract unique models from testedOn field
  const availableModels = Array.from(
    new Set(allPrompts.flatMap(prompt => prompt.testedOn || []))
  ).sort();

  const handleTagChange = (value: string) => {
    if (value && !selectedTags.includes(value)) {
      const newTags = [...selectedTags, value];
      setSelectedTags(newTags);
      onFiltersChange({
        tags: newTags,
        models: selectedModels,
        tokenRange
      });
    }
  };

  const handleModelChange = (value: string) => {
    if (value && !selectedModels.includes(value)) {
      const newModels = [...selectedModels, value];
      setSelectedModels(newModels);
      onFiltersChange({
        tags: selectedTags,
        models: newModels,
        tokenRange
      });
    }
  };

  const removeTagFilter = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    onFiltersChange({
      tags: newTags,
      models: selectedModels,
      tokenRange
    });
  };

  const removeModelFilter = (model: string) => {
    const newModels = selectedModels.filter(m => m !== model);
    setSelectedModels(newModels);
    onFiltersChange({
      tags: selectedTags,
      models: newModels,
      tokenRange
    });
  };

  const handleTokenRangeChange = (value: string) => {
    setTokenRange(value);
    onFiltersChange({
      tags: selectedTags,
      models: selectedModels,
      tokenRange: value
    });
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedModels.length > 0 || tokenRange;

  return (
    <div className="bg-card rounded-xl border border-border">
      {/* Toggle Button - Always Visible */}
      <div className="flex items-center justify-center p-3 border-b border-border">
        <Button 
          onClick={onToggleCollapse}
          variant="ghost"
          className="flex items-center gap-2 text-muted-foreground hover:text-card-foreground"
        >
          <Filter className="h-4 w-4" />
          <span className="font-display-small">Filter Prompts</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {selectedTags.length + selectedModels.length + (tokenRange ? 1 : 0)}
            </Badge>
          )}
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Collapsible Filter Content */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-display-small text-card-foreground">Tags</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/category/all')}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              View all categories
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
          
          {/* Popular Tags */}
          <div className="mb-3">
            <div className="text-xs text-muted-foreground mb-2">Popular:</div>
            <div className="flex flex-wrap gap-1">
              {availableTags.slice(0, 8).map(tag => (
                <button
                  key={tag}
                  onClick={() => navigate(`/tag/${encodeURIComponent(tag)}`)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)} hover:opacity-80 transition-opacity flex items-center gap-1`}
                >
                  {tag}
                  <span className="text-xs opacity-70">({tagCounts[tag]})</span>
                </button>
              ))}
            </div>
          </div>
          
          <Select onValueChange={handleTagChange}>
            <SelectTrigger>
              <SelectValue placeholder="Add tag filter" />
            </SelectTrigger>
            <SelectContent>
              {availableTags.filter(tag => !selectedTags.includes(tag)).map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag} ({tagCounts[tag]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedTags.map(tag => (
                <span key={tag} className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)} flex items-center gap-1`}>
                  {tag}
                  <button
                    onClick={() => removeTagFilter(tag)}
                    className="hover:bg-black/10 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm font-display-small text-card-foreground mb-2 block">Tested On</Label>
          <Select onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Add model filter" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.filter(model => !selectedModels.includes(model)).map(model => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedModels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedModels.map(model => (
                <Badge key={model} variant="secondary" className="text-xs">
                  {model}
                  <button
                    onClick={() => removeModelFilter(model)}
                    className="ml-1 hover:bg-slate-300 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm font-display-small text-card-foreground mb-2 block">Token Range</Label>
          <Select value={tokenRange} onValueChange={handleTokenRangeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Any length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any length</SelectItem>
              <SelectItem value="short">Short (&lt; 100 tokens)</SelectItem>
              <SelectItem value="medium">Medium (100-500 tokens)</SelectItem>
              <SelectItem value="long">Long (&gt; 500 tokens)</SelectItem>
            </SelectContent>
          </Select>
        </div>
          </div>
        </div>
      )}
    </div>
  );
}
