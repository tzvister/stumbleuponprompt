export interface DeepLinkOptions {
  prompt: string;
  variables?: Record<string, string>;
}

export function generateChatGPTLink({ prompt, variables = {} }: DeepLinkOptions): string {
  const finalPrompt = substituteVariables(prompt, variables);
  const encodedPrompt = encodeURIComponent(finalPrompt);
  return `https://chat.openai.com/?q=${encodedPrompt}`;
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
  
  // Debug logging
  console.log('Original prompt:', prompt);
  console.log('Variables to substitute:', variables);
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'gi');
    const beforeReplace = result;
    result = result.replace(regex, value);
    
    // Debug logging
    if (beforeReplace !== result) {
      console.log(`Replaced {${key}} with: "${value}"`);
    } else {
      console.log(`No replacement made for {${key}} - pattern not found`);
    }
  });
  
  console.log('Final substituted prompt:', result);
  return result;
}
