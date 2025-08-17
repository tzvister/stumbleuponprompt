export interface DeepLinkOptions {
  prompt: string;
  variables?: Record<string, string>;
}

export function generateChatGPTLink({ prompt, variables = {} }: DeepLinkOptions): string {
  const finalPrompt = substituteVariables(prompt, variables);
  // Use the + encoding format that ChatGPT prefers
  const encodedPrompt = encodeURIComponent(finalPrompt).replace(/%20/g, '+');
  return `https://chatgpt.com/?q=${encodedPrompt}`;
}

export function generateClaudeLink({ prompt, variables = {} }: DeepLinkOptions): string {
  const finalPrompt = substituteVariables(prompt, variables);
  const encodedPrompt = encodeURIComponent(finalPrompt);
  return `https://claude.ai/new?q=${encodedPrompt}`;
}

export function generateGeminiLink({ prompt, variables = {} }: DeepLinkOptions): string {
  // We avoid relying on q= prefill; caller handles clipboard then opens app
  void prompt; void variables;
  return `https://gemini.google.com/app`;
}

export function generateGrokLink({ prompt, variables = {} }: DeepLinkOptions): string {
  const finalPrompt = substituteVariables(prompt, variables);
  const encodedPrompt = encodeURIComponent(finalPrompt);
  return `https://grok.com/?q=${encodedPrompt}`;
}

export function generateOpenRouterLink({ prompt, variables = {} }: DeepLinkOptions): string {
  // OpenRouter deep link removed from UI; keep placeholder if referenced elsewhere
  const finalPrompt = substituteVariables(prompt, variables);
  const encodedPrompt = encodeURIComponent(finalPrompt);
  return `https://openrouter.ai/playground?prompt=${encodedPrompt}`;
}

function substituteVariables(prompt: string, variables: Record<string, string>): string {
  let result = prompt;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'gi');
    result = result.replace(regex, value);
  });
  
  return result;
}
