import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    
    setSelectedCategories(newCategories);
    onFiltersChange({
      categories: newCategories,
      models: selectedModels,
      tokenRange
    });
  };

  const handleModelChange = (model: string, checked: boolean) => {
    const newModels = checked 
      ? [...selectedModels, model]
      : selectedModels.filter(m => m !== model);
    
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
      <h3 className="font-semibold text-slate-900 mb-4">Filter Prompts</h3>
      
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">Categories</Label>
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox 
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label 
                  htmlFor={category}
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">Model Compatibility</Label>
          <div className="space-y-2">
            {models.map(model => (
              <div key={model} className="flex items-center space-x-2">
                <Checkbox 
                  id={model}
                  checked={selectedModels.includes(model)}
                  onCheckedChange={(checked) => handleModelChange(model, checked as boolean)}
                />
                <Label 
                  htmlFor={model}
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  {model}
                </Label>
              </div>
            ))}
          </div>
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
