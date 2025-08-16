import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterSidebarProps {
  onFiltersChange: (filters: {
    categories: string[];
    models: string[];
    tokenRange: string;
  }) => void;
}

const categories = [
  "Writing & Content",
  "Analysis & Research", 
  "Creative & Design",
  "Business & Strategy",
  "Technical & Code"
];

const models = [
  "GPT-4",
  "Claude 3",
  "Gemini Pro"
];

export function FilterSidebar({ onFiltersChange }: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [tokenRange, setTokenRange] = useState<string>("");

  const handleCategoryChange = (value: string) => {
    if (value && !selectedCategories.includes(value)) {
      const newCategories = [...selectedCategories, value];
      setSelectedCategories(newCategories);
      onFiltersChange({
        categories: newCategories,
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
        categories: selectedCategories,
        models: newModels,
        tokenRange
      });
    }
  };

  const removeCategoryFilter = (category: string) => {
    const newCategories = selectedCategories.filter(c => c !== category);
    setSelectedCategories(newCategories);
    onFiltersChange({
      categories: newCategories,
      models: selectedModels,
      tokenRange
    });
  };

  const removeModelFilter = (model: string) => {
    const newModels = selectedModels.filter(m => m !== model);
    setSelectedModels(newModels);
    onFiltersChange({
      categories: selectedCategories,
      models: newModels,
      tokenRange
    });
  };

  const handleTokenRangeChange = (value: string) => {
    setTokenRange(value);
    onFiltersChange({
      categories: selectedCategories,
      models: selectedModels,
      tokenRange: value
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-900 mb-4">Filter Prompts</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">Categories</Label>
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Add category filter" />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(cat => !selectedCategories.includes(cat)).map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedCategories.map(category => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                  <button
                    onClick={() => removeCategoryFilter(category)}
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
          <Label className="text-sm font-medium text-slate-700 mb-2 block">Model Compatibility</Label>
          <Select onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Add model filter" />
            </SelectTrigger>
            <SelectContent>
              {models.filter(model => !selectedModels.includes(model)).map(model => (
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
          <Label className="text-sm font-medium text-slate-700 mb-2 block">Token Range</Label>
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
  );
}
