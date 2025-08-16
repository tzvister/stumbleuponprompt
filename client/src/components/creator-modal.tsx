import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertPromptSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { extractVariables, validatePromptContent, estimateTokens } from "@/lib/prompt-utils";
import { z } from "zod";

const formSchema = insertPromptSchema.extend({
  tags: z.string(),
  compatibleModels: z.array(z.string()).min(1, "Select at least one compatible model"),
});

type FormData = z.infer<typeof formSchema>;

interface CreatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


const models = [
  "GPT-4",
  "Claude 3", 
  "Gemini Pro"
];

export function CreatorModal({ open, onOpenChange }: CreatorModalProps) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      tags: "",
      creatorName: "",
      compatibleModels: [],
      estimatedTokens: 0,
      variables: [],
      examples: [],
      version: "1.0.0",
    },
  });

  const createPromptMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { tags, ...rest } = data;
      const promptData = {
        ...rest,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        content,
        variables: extractVariables(content),
        estimatedTokens: estimateTokens(content),
      };

      const response = await apiRequest("POST", "/api/prompts", promptData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      toast({
        title: "Prompt published!",
        description: "Your prompt has been successfully published.",
      });
      onOpenChange(false);
      form.reset();
      setContent("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish prompt. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const validation = validatePromptContent(content);
    if (!validation.isValid) {
      toast({
        title: "Invalid prompt content",
        description: validation.errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    createPromptMutation.mutate(data);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    form.setValue("content", value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display-large text-slate-900">Share Your Prompt</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Give your prompt a clear, descriptive title" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <Label htmlFor="content">Prompt Content</Label>
              <Textarea
                id="content"
                rows={8}
                placeholder="Paste your prompt here. Use {variable_name} for user-customizable fields."
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="mt-1"
              />
              <div className="text-xs text-slate-500 mt-1">
                Tip: Use {"{brackets}"} around parts users should customize
              </div>
              {content && (
                <div className="text-xs text-slate-500 mt-1">
                  Estimated tokens: {estimateTokens(content)}
                </div>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={2}
                      placeholder="Briefly explain what this prompt does and when to use it"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="creatorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., analysis, productivity, business"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="compatibleModels"
              render={() => (
                <FormItem>
                  <FormLabel>Compatible Models</FormLabel>
                  <div className="space-y-2">
                    {models.map(model => (
                      <FormField
                        key={model}
                        control={form.control}
                        name="compatibleModels"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={model}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(model)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, model])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== model
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {model}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
              <Button 
                type="button" 
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createPromptMutation.isPending}
                className="bg-primary hover:bg-blue-700"
              >
                {createPromptMutation.isPending ? "Publishing..." : "Publish Prompt"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
