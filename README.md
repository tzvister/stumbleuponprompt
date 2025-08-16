# StumbleUponPrompt

A discovery platform for high-quality AI prompts with a "stumble through" experience. Preview, customize, and try prompts instantly with your favorite AI models.

## Prompt Data Management

All prompts are stored in `data/prompts.json` as a JSON array. This file serves as the single source of truth for all prompt content displayed in the application.

### prompts.json Structure

Each prompt object in the array must follow this exact structure:

```json
{
  "title": "String - Required",
  "description": "String - Required",
  "prompt": "String - Required", 
  "tags": ["Array of strings - Required"],
  "estimatedTokens": 0,
  "creatorName": "String - Required",
  "variables": ["Array of strings - Required"],
  "testedOn": ["Array of strings - Required"],
  "version": "String - Required (semver format)"
}
```

### Field Guidelines

#### Required Fields

- **title**: Clear, descriptive title (max 100 characters recommended)
- **description**: Brief explanation of what the prompt does (max 300 characters recommended)
- **prompt**: The actual prompt text with variables in `{variable_name}` format
- **tags**: Array of relevant category tags for filtering
- **estimatedTokens**: Approximate token count for the prompt (integer)
- **creatorName**: Name or username of the prompt creator
- **variables**: Array of variable names that appear in the content (extracted from `{variable}` syntax)
- **testedOn**: Array of AI models this prompt has been tested with
- **version**: Semantic version string (e.g., "1.0.0")


### Tag Categories

Use these standardized tag categories for consistency:

**Content & Writing:**
- "Writing & Content"
- "Copywriting" 
- "Marketing"
- "Creative & Design"

**Analysis & Research:**
- "Analysis & Research"
- "Research"
- "Business Intelligence"
- "Analysis"

**Education & Learning:**
- "Education"
- "Learning"
- "Simplification"

**Business & Strategy:**
- "Business & Strategy" 
- "Business"
- "Strategy"
- "Innovation"
- "Problem Solving"
- "Productivity"

**Technical:**
- "Technical & Code"

### Tested Models

Use these standard model names:
- "GPT-4"
- "Claude 3"
- "Gemini Pro"

### Variable Syntax

Variables in prompt content should use curly brace syntax:
- `{variable_name}` - Single word variables
- `{variable with spaces}` - Multi-word variables
- `{specific_topic}` - Descriptive variable names

### Example Entry

```json
{
  "title": "Expert Teacher Prompt",
  "description": "Break down complex topics like you're explaining to a 5-year-old with 20 years of expertise.",
  "prompt": "Pretend you are an expert with 20 years of experience in {industry/topic}. Break down the core principles a total beginner must understand. Use analogies, step-by-step logic, and simplify everything like I'm 5.\n\nTopic to explain: {topic}",
  "tags": ["Education", "Learning", "Simplification", "Writing & Content"],
  "estimatedTokens": 120,
  "creatorName": "Sarah Chen",
  "variables": ["{industry/topic}", "{topic}"],
  "testedOn": ["GPT-4", "Claude 3", "Gemini Pro"],
  "version": "1.0.0"
}
```

### Adding New Prompts

1. Follow the exact JSON structure above
2. Ensure all required fields are present
3. Use standard tag categories from the list above
4. Test variables work correctly in prompt content
5. Validate JSON syntax before committing
6. Use semantic versioning for the version field

### Best Practices

- Keep titles concise but descriptive
- Make descriptions explain the prompt's purpose and use case
- Use clear, actionable variable names
- Include relevant tags for discoverability
- Estimate token counts accurately
- Test prompts with multiple AI models before adding
- Version prompts when making significant changes

### File Location

The prompts.json file must be located at:
```
data/prompts.json
```

This file is automatically loaded by the storage system when the application starts.