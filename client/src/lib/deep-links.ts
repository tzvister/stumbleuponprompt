export interface DeepLinkOptions {
  prompt: string;
  variables?: Record<string, string>;
}

export function generateChatGPTLink({ prompt, variables = {} }: DeepLinkOptions): string {
  const finalPrompt = substituteVariables(prompt, variables);
  const encodedPrompt = encodeURIComponent(finalPrompt);
  return `https://chat.openai.com/?model=gpt-4&q=${encodedPrompt}`;
}

export function generateClaudeLink({ prompt, variables = {} }: DeepLinkOptions): string {
  const finalPrompt = substituteVariables(prompt, variables);
  const encodedPrompt = encodeURIComponent(finalPrompt);
  return `https://claude.ai/chat?q=${encodedPrompt}`;
}

export function generateGeminiLink({ prompt, variables = {} }: DeepLinkOptions): string {
  const finalPrompt = substituteVariables(prompt, variables);
  const encodedPrompt = encodeURIComponent(finalPrompt);
  return `https://gemini.google.com/app?q=${encodedPrompt}`;
}

export function generateOpenRouterLink({ prompt, variables = {} }: DeepLinkOptions): string {
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
