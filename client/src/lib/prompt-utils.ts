export function extractVariables(promptContent: string): string[] {
  const variableRegex = /\{([^}]+)\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = variableRegex.exec(promptContent)) !== null) {
    const variable = match[1];
    if (!variables.includes(variable)) {
      variables.push(variable);
    }
  }
  
  return variables;
}

export function formatVariableName(variable: string): string {
  return variable
    .split(/[/_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function validatePromptContent(content: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!content.trim()) {
    errors.push("Prompt content cannot be empty");
  }
  
  if (content.length < 20) {
    errors.push("Prompt content should be at least 20 characters long");
  }
  
  if (content.length > 5000) {
    errors.push("Prompt content should be less than 5000 characters");
  }
  
  // Check for unmatched brackets
  const openBrackets = (content.match(/\{/g) || []).length;
  const closeBrackets = (content.match(/\}/g) || []).length;
  
  if (openBrackets !== closeBrackets) {
    errors.push("Mismatched curly brackets in variable definitions");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}
