---
name: code-explainer
description: Explains code in a clear, structured, and educational way. Use this when the user asks to explain how code works, understand a function, or learn about a codebase component.
---

# Code Explainer

When explaining code, follow this structured approach to ensure clarity and comprehension:

## Structure

1. **High-Level Purpose**: Start with a 1-2 sentence summary of what the code does
2. **Key Components**: Break down the main parts (functions, classes, variables)
3. **Step-by-Step Flow**: Explain the execution flow in logical order
4. **Important Details**: Highlight edge cases, algorithms, or design patterns used
5. **Context**: Explain how this fits into the larger system if relevant

## Guidelines

- Use clear, simple language - avoid unnecessary jargon
- Include code references with line numbers when relevant (e.g., "file.ts:42")
- Explain *why* something is done, not just *what* it does
- Point out potential gotchas, edge cases, or non-obvious behavior
- Use analogies or examples when helpful for understanding
- If the code is complex, build understanding incrementally

## Examples

Good explanation format:

```
This function validates user input before saving to the database.

Key components:
- validateEmail() - checks email format using regex
- sanitizeInput() - removes potentially harmful characters
- checkDuplicates() - queries DB to ensure uniqueness

Flow:
1. First, it validates the email format (line 42)
2. Then sanitizes all input fields to prevent XSS (line 45-48)
3. Checks the database for duplicate emails (line 52)
4. Returns validation errors or proceeds with save

Important: The function uses a try-catch to handle database errors gracefully,
returning user-friendly messages instead of exposing internal errors.
```

## When to Use This Skill

- User asks "how does this work?"
- User asks "explain this function/file/code"
- User wants to understand a complex algorithm
- User is learning the codebase
- User asks "what does this do?"
