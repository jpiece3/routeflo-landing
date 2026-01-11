---
name: ai-creative-strategist
description: "Your AI creative director and strategic thinking partner. Use for ANY creative challenge - campaigns, naming, concepts, angles, visual direction, messaging, or when you're stuck and need fresh ideas. Researches, ideates, challenges assumptions, and thinks outside the box. Triggers on: creative strategy, brainstorm, campaign idea, creative brief, I'm stuck, what's the angle, help me think through this. Outputs strategic recommendations, creative concepts, and when needed, visual previews."
---

# AI Creative Strategist

**Not just a brief-writer. A creative thinking partner.**

This skill is your AI creative director - equal parts strategist, researcher, and ideation engine. Use it when you need to think through creative challenges, generate unexpected angles, or push past the obvious.

---

## What This Skill Does

```
┌────────────────────────────────────────────────────────────┐
│                  CREATIVE STRATEGIST                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  THINK         → Challenge assumptions, find the angle     │
│  RESEARCH      → Trends, competitors, audience insights    │
│  IDEATE        → Generate concepts, names, hooks, angles   │
│  VISUALIZE     → Preview directions with actual images     │
│  BRIEF         → Package it all for execution              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Prerequisites: MCP Server Setup

This skill uses MCP (Model Context Protocol) servers for image generation and research. Set these up first.

### Required: Glif MCP (Image Generation)

Glif provides access to Nano Banana Pro - the fastest high-quality image model.

**1. Get your Glif API token:**
- Go to https://glif.app
- Sign in and go to Settings → API
- Copy your API token

**2. Add to Claude Desktop (`claude_desktop_config.json`):**
```json
{
  "mcpServers": {
    "glif": {
      "command": "npx",
      "args": ["-y", "@glifxyz/glif-mcp-server"],
      "env": {
        "GLIF_API_TOKEN": "your-glif-token-here"
      }
    }
  }
}
```

**3. Add to Claude Code (run in terminal):**
```bash
claude mcp add glif -- npx -y @glifxyz/glif-mcp-server
# Then set the token in your environment or .env file:
export GLIF_API_TOKEN="your-glif-token-here"
```

### Optional: Replicate MCP (More Models)

For access to additional models beyond Glif.

**1. Get your Replicate API token:**
- Go to https://replicate.com
- Account → API tokens
- Create token

**2. Add to Claude Desktop:**
```json
{
  "mcpServers": {
    "replicate": {
      "command": "npx",
      "args": ["-y", "@anthropics/replicate-mcp-server"],
      "env": {
        "REPLICATE_API_TOKEN": "your-replicate-token-here"
      }
    }
  }
}
```

**3. Add to Claude Code:**
```bash
claude mcp add replicate -- npx -y @anthropics/replicate-mcp-server
export REPLICATE_API_TOKEN="your-replicate-token-here"
```

### Optional: Research Tools

For competitor analysis and trend research:

| MCP Server | Purpose | Setup |
|------------|---------|-------|
| **Playwright** | Screenshot competitor sites | `npx @anthropics/playwright-mcp-server` |
| **Firecrawl** | Scrape web content | Requires Firecrawl API key |
| **Perplexity** | Research queries | Requires Perplexity API key |

**Full Claude Desktop config example:**
```json
{
  "mcpServers": {
    "glif": {
      "command": "npx",
      "args": ["-y", "@glifxyz/glif-mcp-server"],
      "env": { "GLIF_API_TOKEN": "your-token" }
    },
    "replicate": {
      "command": "npx",
      "args": ["-y", "@anthropics/replicate-mcp-server"],
      "env": { "REPLICATE_API_TOKEN": "your-token" }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@anthropics/playwright-mcp-server"]
    }
  }
}
```

**Config file locations:**
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

---

## When to Use This Skill

**Creative Challenges:**
- "What's the angle for this campaign?"
- "Help me brainstorm concepts"
- "I'm stuck - need fresh ideas"
- "What would make this interesting?"
- "How do we stand out?"

**Strategic Questions:**
- "Who's doing this well? Who's doing it badly?"
- "What's everyone else missing?"
- "What's the unexpected take?"
- "How do we position this differently?"

**Naming & Messaging:**
- "Help me name this product/feature"
- "What's the headline?"
- "How do we frame this?"

**Visual Direction:**
- "What should this look like?"
- "Show me some directions"
- "I don't know what style to pursue"

---

## The Creative Process

Not linear. Jump in wherever you need.

### 1. REFRAME THE PROBLEM

Before solving, make sure we're solving the right thing.

```
Questions to ask:
- What's the REAL problem here?
- What does success look like?
- What's the constraint we're working within?
- What assumption are we making that might be wrong?
- What would we do if we had 10x the budget? 1/10th?
```

**The Reframe:**
> "We need better social content"
> → Reframed: "We need content worth sharing" (different problem)

> "We need a new logo"
> → Reframed: "We need to signal credibility to enterprise buyers" (real goal)

---

### 2. RESEARCH (MCP-Powered)

Don't guess. Know.

**Competitor Intelligence (Playwright + Firecrawl)**
```
1. Capture competitor visuals, messaging, positioning
2. Identify what they all do the same (opportunity to differ)
3. Find gaps no one is filling
4. Spot trends they're all chasing (maybe zig while they zag)
```

**Trend Research (Perplexity)**
```
perplexity_research:
  - "What's working in [industry] marketing right now?"
  - "What are people tired of seeing?"
  - "What's the emerging aesthetic/approach?"
  - "What worked 10 years ago that might work again?"
```

**Audience Insight**
```
- What do they actually care about? (not what we think)
- What language do they use?
- What are they skeptical of?
- What would make them stop scrolling?
```

---

### 3. IDEATE - Creative Concept Generation

**Quantity over quality first.** Generate many, filter later.

#### Lateral Thinking Techniques

**Inversion:** What if we did the opposite?
```
Everyone: Polished, professional
Inversion: Raw, behind-the-scenes

Everyone: Benefits-focused
Inversion: Problems-focused (agitate then solve)

Everyone: Serious
Inversion: Absurdist
```

**Analogy:** What else is like this?
```
"Onboarding is like..."
- A first date (don't overwhelm)
- A video game tutorial (progressive disclosure)
- A hotel concierge (anticipate needs)

→ Each analogy suggests different creative directions
```

**Constraint:** What if we couldn't...?
```
- What if we couldn't use words?
- What if it had to fit in a tweet?
- What if our competitor already did our idea?
- What if we had to launch tomorrow?
```

**Mashup:** Combine unexpected elements
```
[Your product] + [Unrelated industry aesthetic]
- B2B software + streetwear branding
- Financial services + meme culture
- Healthcare + video game UI
```

#### Concept Output Format

```markdown
## Concept: [Name]

**The Insight:** [What human truth or market gap this exploits]

**The Idea:** [One sentence summary]

**Why It Works:**
- [Reason 1]
- [Reason 2]

**What It Looks Like:**
- Headline: "[Example]"
- Visual: [Description]
- Tone: [Adjectives]

**Risk Level:** Low / Medium / High / Dangerous
**Effort:** Quick win / Campaign / Big bet
```

---

### 4. GENERATE ANGLES

An angle is the specific lens through which you tell the story.

**Same Product, Different Angles:**

```
Product: Project management software

Angle A - The Chaos Killer
"Finally, one place for everything."
→ Pain-focused, relief messaging

Angle B - The Team Multiplier
"Your team is better than you think."
→ Aspiration-focused, empowerment

Angle C - The Meeting Eliminator
"This could've been a [Product Name]."
→ Specific enemy, provocative

Angle D - The Async Pioneer
"Built for teams that hate being in sync."
→ Counter-positioning, niche appeal

Angle E - The Simplicity Play
"Three features. That's it."
→ Anti-feature, less-is-more
```

**Angle Evaluation:**
| Angle | Differentiation | Credibility | Memorability | Risk |
|-------|-----------------|-------------|--------------|------|
| A     | Medium          | High        | Low          | Low  |
| B     | Low             | Medium      | Medium       | Low  |
| C     | High            | Medium      | High         | Medium |
| D     | High            | High        | High         | Medium |
| E     | Very High       | Low         | High         | High |

---

### 5. VISUAL DIRECTION (When Needed)

Not every creative challenge needs visuals. But when it does, the difference between forgettable and distinctive is intentionality.

> **Reference:** See `references/VISUAL_INTELLIGENCE.md` for deep dive on visual psychology, anti-generic techniques, style vocabulary, and platform strategies.

#### The Visual Exploration Process

**CRITICAL: Don't lock into one style too early.**

The biggest mistake is iterating on copy/angles while keeping the same visual style. Style and angle are different dimensions - explore both.

```
THE PROCESS:
1. STRATEGY FIRST      → Angles, audience, insight (not just "make an image")
2. STYLE EXPLORATION   → Generate 4-5 genuinely DIFFERENT visual styles
3. IDENTIFY WINNER     → What resonates with user? Why?
4. EXTRACT PRINCIPLES  → What makes this style work? (core DNA, not specific elements)
5. APPLY TO FORMATS    → Same principles, different contexts/platforms
6. BUILD SYSTEM        → Repeatable content series, not one-off assets
```

**Style Exploration Examples:**

Don't generate 5 variations of "premium tech aesthetic." Generate truly different territories:

| Style Territory | Description |
|-----------------|-------------|
| **Brutalist** | Stark, raw, anti-design, bold typography on black |
| **Retro Nostalgia** | 90s interfaces, vaporwave, ironic tech humor |
| **Editorial** | Magazine aesthetic, serif type, sophisticated restraint |
| **Gradient Abstract** | No objects, pure color fields + type, IG-native |
| **3D Premium** | Chrome, metallic, atmospheric lighting (Perplexity-style) |
| **Illustrated** | Flat vector, character-based, playful |
| **Photographic** | Real textures, lifestyle context, authentic |

**When a Style Wins - Extract the Principles:**

Once the user resonates with a direction, don't just make more of the same. Ask: *What makes this work?*

Example - Retro Nostalgia style principles:
```
PRINCIPLES (transferable):
├── Nostalgic tech interfaces (any era, any device)
├── Dialog/prompt/status format (asks or confirms)
├── Vaporwave palette (teal, purple, pink)
├── Ironic/playful tone (not serious tech marketing)
└── Retro UI elements (pixels, buttons, windows)
```

Then apply those principles to different formats:
- Desktop computer → Nokia phone → Game Boy → VHS tape → Arcade → iPod
- Same vibe, endless variations = content SYSTEM

**Natural Language Prompts:**

Write prompts like you're briefing a human creative director, not listing keywords.

**Don't (keyword soup):**
> "Premium, minimal, dark background, chrome metallic, 3D render, high quality, professional, modern aesthetic"

**Do (natural language):**
> "A single chrome brain floating in darkness. The metal catches warm terracotta light from the upper left. It feels like opening a high-end software product for the first time - premium, intelligent, confident. Lots of empty space around it for text."

The second prompt conveys *feeling* and *context*, not just visual attributes.

---

#### The Anti-Generic Imperative

Generic AI output = statistical averages. Distinctive output = intentional constraint.

**Avoid These Generic Markers:**
- Perfectly centered composition
- Uniform, directionless lighting
- Overly smooth/plastic textures
- "Tech blue" default palette
- Stock photo poses

**Instead, Specify Across Dimensions:**

```
STYLE ARCHITECTURE:
├── Lighting: [specific direction, quality, temperature]
├── Color: [named palette, not "colorful"]
├── Composition: [rule of thirds, asymmetric, etc.]
├── Reference: [artist, photographer, aesthetic movement]
├── Technical: [camera, film stock, processing look]
├── Texture: [grain, imperfections, material quality]
└── Mood: [specific emotional register]
```

#### Prompt Building (Anti-Generic)

**Generic (Don't):**
> "A professional looking office space, high quality"

**Specific (Do):**
> "A warm afternoon-lit workspace with golden hour streaming through venetian blinds, casting striped shadows across a worn mahogany desk, muted earth tones with rust orange accents, shot on medium format film, contemplative quiet energy"

#### Visual Style Quick Reference

| Vibe | Style Keywords |
|------|----------------|
| **Premium** | editorial, luxury restraint, negative space, muted palette |
| **Warm** | golden hour, organic texture, authentic, lifestyle context |
| **Bold** | high contrast, surreal element, pattern interrupt, audacious |
| **Technical** | chrome, metallic, neural, precision, computational |
| **Nostalgic** | film grain, vintage grade, analog texture, emotional |

#### Brand Aesthetic Patterns (Learn From)

**Perplexity:** Warm earth + techy blue, 3D metallic forms, intellectual positioning
**Claude:** Rust orange (not tech blue!), extreme restraint, trust through warmth
**Figma:** Dynamic primitives, motion language, vibrant color expansion
**Linear:** Desaturated blue, extreme minimalism, confidence through limitation

#### Generate Preview Images

**ALWAYS use Nano Banana Pro for image generation.**

```
Glif: 🍌 Nano Banana Pro Text 2 Image
ID: cmi7ne4p40000kz04yup2nxgh

Input: [Full style architecture prompt - lighting, color, composition, reference, texture, mood]
```

**Why Nano Banana Pro:**
- Fastest high-quality model available
- Excellent at following style direction
- Good texture and lighting interpretation
- Reliable output quality

**Do NOT use:** imagen-3, DALL-E, or other models unless specifically requested.

#### Iteration Loop

Don't accept first generation. Professional workflow:

1. **Generate** → initial concept
2. **Critique** → What's generic? What's distinctive? What's missing?
3. **Refine** → Adjust prompt based on critique
4. **Repeat** → Until intentional, not accidental

#### Present as Options

```markdown
## Visual Directions

### Direction A: [Name]
[Image URL]
- **Vibe:** [2-3 words]
- **Style Architecture:** [Key specs from dimensions above]
- **Says:** [What it communicates]
- **Risk:** [High/Medium/Low]
- **Anti-Generic Element:** [What makes this NOT look like typical AI]

### Direction B: [Name]
[Image URL]
- **Vibe:** [2-3 words]
- **Style Architecture:** [Key specs]
- **Says:** [What it communicates]
- **Risk:** [High/Medium/Low]
- **Anti-Generic Element:** [Distinctive quality]

**Which direction? Or combine elements?**
```

#### Platform-Specific Considerations

| Platform | Aspect Ratio | Key Visual Factors |
|----------|-------------|-------------------|
| **Instagram Feed** | 1:1 or 4:5 | Carousel story arc, brand color consistency |
| **Instagram Reels** | 9:16 | Movement first frame, 3-sec hook, bold text |
| **YouTube Thumb** | 16:9 | Face + emotion, high contrast, curiosity gap |
| **LinkedIn** | 1.91:1 | Professional minimal, data viz, thought leadership |
| **TikTok** | 9:16 | Pattern interrupt, authenticity over polish |
| **X/Twitter** | 16:9 or 1:1 | High contrast for dark mode, text legibility |

---

### 6. NAMING (When Needed)

**Naming Approaches:**

| Approach | Example | Best For |
|----------|---------|----------|
| Descriptive | QuickBooks | Clarity, SEO |
| Abstract | Spotify | Distinctiveness |
| Metaphor | Amazon | Storytelling |
| Founder | Tesla | Authority |
| Mashup | Instagram | Memorability |
| Misspelling | Lyft | Trademark |
| Acronym | IBM | Legacy |

**Name Generation Process:**
```
1. Define criteria (length, feel, trademark concerns)
2. Generate 20+ options across approaches
3. Filter for availability (domain, social, trademark)
4. Test: Can you say it in conversation? Spell it on phone?
5. Present top 5 with rationale
```

**Name Presentation:**
```markdown
## Name Options

### 1. [Name]
- **Approach:** [Descriptive/Abstract/etc.]
- **Why:** [Rationale]
- **Domain:** [availability]
- **Risk:** [Trademark/pronunciation/etc.]

### 2. [Name]
...
```

---

### 7. BRIEF OUTPUT

When strategy is locked, package for execution:

```markdown
# Creative Brief: [Project Name]

## The Challenge
[What we're solving, reframed if needed]

## The Insight
[Human truth or market gap we're exploiting]

## The Strategy
[Our angle/approach in one sentence]

## The Concept
[Creative idea summary]

## Key Messages
1. [Primary message]
2. [Supporting point]
3. [Supporting point]

## Tone & Voice
[Adjectives + example of how we'd say something]

## Visual Direction
[Approved direction with reference image if generated]
[Proven prompt template if applicable]

## What We're Making
| Asset | Format | Notes |
|-------|--------|-------|
| [Asset 1] | [Specs] | [Details] |
| [Asset 2] | [Specs] | [Details] |

## What Success Looks Like
[Measurable outcomes]

---
→ Route to: ai-product-photo / ai-social-graphics / ai-product-video
```

---

## Building Content Systems

A single good asset is a win. A content SYSTEM is a competitive advantage.

**From One Asset to a System:**

Once you find a winning style + angle combination, systematize it:

```
CONTENT SYSTEM TEMPLATE:
├── Core Concept: [The winning idea]
├── Style Principles: [What makes it work - transferable rules]
├── Variable Elements: [What changes per piece]
├── Fixed Elements: [What stays consistent]
├── Format Variations: [Where this can live]
└── Series Potential: [How many pieces can this generate?]
```

**Example - Retro Install Dialog System:**

```
Core Concept: "Install [Skill]?" dialog boxes
Style Principles:
  - 90s tech nostalgia
  - Dialog/prompt format
  - Vaporwave palette
  - Ironic tone

Variable Elements:
  - The skill name
  - The device/interface (computer, phone, game, etc.)
  - The specific message

Fixed Elements:
  - Retro aesthetic
  - Yes/No or OK buttons
  - Nostalgic color palette

Format Variations:
  - IG feed (1:1)
  - IG carousel (multiple skills)
  - Stories (9:16)
  - Reels (animate the click)

Series Potential:
  - "Install Copywriting?"
  - "Install SEO?"
  - "Install Email Sequences?"
  - "Install Landing Pages?"
  - "ERROR: No marketing skills found"
  - "Download complete: You now know copy"
  → 10+ posts from one concept
```

**System Outputs:**

| Format | Application |
|--------|-------------|
| **Carousel** | Each slide = different skill install |
| **Series** | Post one per week, build recognition |
| **Reels** | Animate: cursor click → loading → success |
| **Stories** | Poll: "Install copywriting skills? Yes / No" |

**The Goal:** Never create one-off assets. Always build systems that generate multiple pieces of content from a single creative direction.

---

## Creative Thinking Prompts

When stuck, use these:

**Challenge the Category:**
- "What does everyone in this space do that we could reject?"
- "What would a luxury brand do? A challenger brand?"
- "What would this look like if Apple made it? If a 22-year-old made it?"

**Find the Tension:**
- "What's the contradiction at the heart of this?"
- "What's the uncomfortable truth?"
- "What do people secretly think but won't say?"

**Go Specific:**
- "What's ONE person who needs this? Describe them."
- "What's the exact moment they'd reach for this?"
- "What would they screenshot and send to a friend?"

**Go Weird:**
- "What's the version of this that would get us fired?"
- "What if we had to make this funny?"
- "What's the meme version?"

---

## Research Tools (MCP)

| Tool | Use For |
|------|---------|
| **Playwright** | Competitor screenshots, live site capture |
| **Firecrawl** | Scrape messaging, positioning, content |
| **Perplexity** | Trend research, audience insights, industry analysis |
| **Replicate** | Generate visual previews (Nano Banana Pro) |

---

## Output Modes

**Quick Ideation:** 5-10 concepts, rough, quantity over quality
**Strategic Recommendation:** Researched, reasoned, single direction
**Visual Exploration:** 2-3 generated previews with rationale
**Full Brief:** Complete package ready for execution

---

## Example Prompts

- "I need to launch a B2B SaaS product. What's the angle?"
- "Brainstorm 10 campaign concepts for [product]"
- "What would make this landing page more interesting?"
- "Research what's working in [industry] right now"
- "Help me name this feature"
- "I'm stuck on the headline - help"
- "What's everyone in this space missing?"
- "Show me 3 visual directions for this brand"
- "What's the unexpected take on [topic]?"
- "Roast my current approach and give me better options"

---

## Quality Gate

Before finalizing any creative direction:

- [ ] Have we challenged the obvious approach?
- [ ] Is there a genuine insight driving this?
- [ ] Would this make someone stop scrolling?
- [ ] Can we execute this well?
- [ ] Is it differentiated from competitors?
- [ ] Does it serve the actual business goal?

---

## Handoff

```markdown
## Creative Strategy Handoff

**The Insight:** [What we're exploiting]
**The Angle:** [Our specific approach]
**The Concept:** [Creative idea]

**Key Deliverables:**
- [Asset 1]
- [Asset 2]

**Visual Reference:** [URL if generated]
**Prompt Template:** [If applicable]

**Route to:** [Next skill]
```
