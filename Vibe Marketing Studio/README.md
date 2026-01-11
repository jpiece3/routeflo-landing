# Claude Code Skills Repository

This repository contains custom skills for Claude Code that enhance its capabilities with specialized knowledge and repeatable workflows.

## What Are Skills?

Skills are reusable instructions that teach Claude Code how to perform specific tasks in a consistent, structured way. They act like specialized templates that Claude follows when you need particular types of help.

## Repository Structure

```
ClaudeCodeSkills/
├── README.md                    # This file
├── code-explainer/              # Skill: Explains code clearly
│   └── SKILL.md
├── marketing-copy-writer/       # Skill: Creates compelling marketing copy
│   └── SKILL.md
└── [your-skill-name]/           # Add more skills here
    └── SKILL.md
```

## How to Create a Skill

### Required Format

Each skill must be in its own folder with a `SKILL.md` file containing:

1. **YAML Frontmatter** - Metadata about the skill
2. **Markdown Content** - Instructions Claude will follow

### Template

```markdown
---
name: your-skill-name
description: Clear description of what this skill does and when to use it
---

# Your Skill Name

[Instructions that Claude will follow when this skill is active]

## Structure

- Main workflow steps
- Key components to focus on
- Expected outputs

## Guidelines

- Best practices
- Important considerations
- Edge cases to handle

## Examples

- Example usage 1
- Example usage 2

## When to Use This Skill

- Specific trigger scenario 1
- Specific trigger scenario 2
```

### Field Requirements

**Frontmatter (Required):**
- `name`: Unique identifier (lowercase, use hyphens instead of spaces)
- `description`: Complete description of purpose and when Claude should use it

**Content Sections (Recommended):**
- Instructions/Structure
- Guidelines
- Examples
- When to Use

## How to Use Skills

### Method 1: Install as Plugin

From within Claude Code:
```
/plugin install /Users/jamespinder/ClaudeCodeSkills/code-explainer
```

Or install the entire collection:
```
/plugin install /Users/jamespinder/ClaudeCodeSkills
```

### Method 2: Reference Directly

Ask Claude to use a specific skill:
```
"Use the code-explainer skill to explain this function"
```

### Method 3: Let Claude Decide

If skills are installed as plugins, Claude will automatically choose the right skill based on your request and the skill's description.

## Available Skills

### code-explainer
**Purpose:** Explains code in a clear, structured, and educational way

**Use when:**
- You want to understand how code works
- Learning a new codebase
- Need detailed explanation of algorithms or functions
- Teaching others about code

**Provides:**
- High-level purpose summary
- Key components breakdown
- Step-by-step execution flow
- Important details and edge cases
- Context within the larger system

### marketing-copy-writer
**Purpose:** Creates compelling, conversion-focused marketing copy for various formats

**Use when:**
- Writing ad copy (Google, Facebook, LinkedIn)
- Creating email campaigns
- Drafting landing page content
- Writing social media posts
- Improving existing marketing copy
- Developing value propositions and CTAs

**Provides:**
- AIDA framework (Attention, Interest, Desire, Action)
- Format-specific templates (emails, ads, landing pages, social)
- Power words and proven copywriting principles
- Benefits vs features guidance
- Quality checklist and examples

## Best Practices for Creating Skills

### 1. Be Specific
- Clearly define when the skill should be used
- Provide concrete examples
- Include edge cases and constraints

### 2. Keep It Focused
- One skill = one specialized task
- Don't try to make a skill do too many things
- Break complex workflows into multiple skills if needed

### 3. Provide Structure
- Use clear sections and formatting
- Include examples of expected output
- Define success criteria

### 4. Test Thoroughly
- Try the skill with various inputs
- Ensure it works in different contexts
- Refine based on actual usage

### 5. Write Clear Descriptions
- The description determines when Claude uses the skill
- Be explicit about triggers and use cases
- Include both what it does and when to use it

## Skill Ideas

Here are some useful skills you might want to create:

- **test-writer**: Generates comprehensive test cases
- **code-reviewer**: Reviews code for best practices and issues
- **commit-message-generator**: Creates meaningful commit messages
- **documentation-writer**: Writes clear technical documentation
- **refactoring-guide**: Suggests refactoring improvements
- **security-checker**: Identifies security vulnerabilities
- **performance-optimizer**: Suggests performance improvements
- **api-designer**: Helps design RESTful APIs
- **error-handler**: Creates robust error handling code
- **accessibility-checker**: Ensures code meets accessibility standards

## Resources

- **Official Skills Repository**: https://github.com/anthropics/skills
- **Creating Custom Skills Guide**: https://support.claude.com/en/articles/12512198-creating-custom-skills
- **Claude Code Documentation**: https://code.claude.com/docs/en/overview.md

## Contributing

To add a new skill to this repository:

1. Create a new folder with your skill name (lowercase, hyphenated)
2. Add a `SKILL.md` file with proper frontmatter and instructions
3. Test the skill thoroughly
4. Update this README with the skill description
5. Install or reference the skill in Claude Code

## Tips for Effective Skills

- **Start Simple**: Create basic skills first, then enhance them based on usage
- **Iterate**: Skills can be updated and improved over time
- **Document Examples**: Real examples help Claude understand the expected format
- **Be Consistent**: Use similar structure across skills for predictability
- **Context Matters**: Include information about when NOT to use the skill too

## License

Skills in this repository are for personal use with Claude Code.
