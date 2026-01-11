# TOOL #4: The Automation Builder
## Problem: Doing the same manual tasks over and over

### What It Fixes
- Repetitive data entry
- Moving information between tools
- Manual follow-ups and reminders
- Copy/paste workflows
- Boring tasks that waste your time

### The Tool: Gumloop

**Why Gumloop (not Zapier or Make):**
- Built for the AI era (not just connecting apps, actually intelligent)
- Easier to use than the old-school tools
- Has AI built in (can read, understand, and process information)
- More powerful for less money
- The handyman's choice for automation

**Cost:**
- Free tier: 1,000 credits/month (plenty to start)
- Pro: $20/month (unlimited workflows)

**Time to Set Up:** 20-30 minutes for first automation

**Time Saved:** 5-15 hours per week (compounds over time)

**Website:** gumloop.com

---

### Why I Recommend Gumloop Over the Old Tools

**Zapier/Make.com (old way):**
- Just moves data between apps
- No intelligence
- Breaks easily
- Limited to simple if/then logic

**Gumloop (handyman way):**
- Can actually READ and UNDERSTAND information (AI-powered)
- Processes data intelligently
- Handles complex workflows easily
- Built for modern business

**Example:**
- **Old tool:** "When form submitted, add to spreadsheet" (dumb copy/paste)
- **Gumloop:** "When form submitted, read their answers, categorize the lead, add to correct spreadsheet, send personalized email based on their needs, create task in CRM" (intelligent automation)

**That's the difference.**

---

### Step-by-Step Setup

**Step 1: Sign Up for Gumloop**
- Go to gumloop.com
- Sign up for free account
- Connect your most-used tools (Gmail, Google Sheets, CRM, etc.)

**Step 2: Your First Automation - Smart Lead Capture**

**What it does:** When someone fills out your lead form, Gumloop reads their information, categorizes them, adds them to the right place, and sends a personalized welcome email.

**Setup in Gumloop:**
1. Create new workflow
2. **Trigger:** "New form submission" (connect your form tool)
3. **AI Node:** "Read submission and categorize lead type"
   - Prompt: "Based on this form submission, categorize as: Hot Lead, Warm Lead, or Just Browsing"
4. **Action:** Add to Google Sheet in correct tab based on category
5. **AI Node:** "Write personalized welcome email based on their answers"
   - Prompt: "Write a friendly welcome email addressing their specific needs mentioned in: [form answers]"
6. **Action:** Send email via Gmail
7. Activate workflow

**Time saved:** 20-30 minutes per day + every lead gets perfect personalized response

**The old tools can't do this.** They'd just copy/paste. Gumloop actually thinks.

---

### Step 3: AI-Powered Email Follow-Up

**What it does:** Automatically follows up with leads who haven't responded, with AI writing personalized messages based on context.

**Setup:**
1. **Trigger:** Lead added to spreadsheet
2. **Wait:** 3 days
3. **Check:** Have they responded? (check email thread)
4. **If no response:**
   - **AI Node:** "Write follow-up email that references their original inquiry and adds value"
   - Prompt: "They asked about [original topic]. Write a helpful follow-up that doesn't feel pushy, adds one useful tip related to their question, and makes it easy to respond."
5. **Action:** Send via Gmail
6. **Wait:** 7 more days
7. **Repeat** with different AI prompt for second follow-up

**This is AI handyman work.** Not dumb automation. Smart automation.

---

### Step 4: Content Repurposing Workflow

**What it does:** When you post on LinkedIn, Gumloop reads it, repurposes it for other platforms, and schedules everything automatically.

**Setup:**
1. **Trigger:** New LinkedIn post (your profile)
2. **AI Node:** "Read this LinkedIn post"
3. **AI Node:** "Rewrite for Twitter (under 280 characters, punchier)"
4. **AI Node:** "Rewrite for Instagram (casual tone, add context)"
5. **AI Node:** "Rewrite for email newsletter (longer form)"
6. **Action:** Save all versions to Google Doc
7. **Action:** Schedule posts to each platform (or save as drafts)

**One post becomes four.** Automatically. With AI adapting the message for each platform.

---

### Step 5: Client Onboarding Automation

**What it does:** When someone becomes a client, Gumloop handles the entire onboarding - personalized emails, task creation, document sharing, everything.

**Setup:**
1. **Trigger:** New payment received (Stripe, PayPal, etc.)
2. **Action:** Send immediate "Thank you" email
3. **AI Node:** "Create personalized onboarding checklist based on what they purchased"
4. **Action:** Send onboarding Email 1 with custom checklist
5. **Action:** Create client folder in Google Drive, add to CRM
6. **Wait:** 2 days
7. **AI Node:** "Check if they've completed step 1. If not, write encouraging reminder email."
8. **Action:** Send Email 2 (personalized based on their progress)
9. **Wait:** 5 days
10. **Action:** Send Email 3 (check-in)

**Every client gets perfect onboarding. You do nothing.**

---

### Top 5 Gumloop Automations to Build (Priority Order)

**1. Smart Lead Capture & Nurture**
   - Categorizes leads automatically
   - Sends personalized responses
   - Follows up intelligently
   - **Old tools:** Can't do this
   - **Gumloop:** Easy

**2. Content Repurposing Machine**
   - One post → multiple platforms
   - AI rewrites for each audience
   - Schedules or saves as drafts
   - **Time saved:** 5-8 hours/week

**3. Email Inbox Manager**
   - Reads incoming emails
   - Categorizes by urgency/type
   - Drafts responses to common questions
   - Flags important ones for you
   - **Time saved:** 10+ hours/week

**4. Research & Summary Bot**
   - Give it a topic
   - It researches, reads articles, synthesizes
   - Outputs clean summary
   - Saves to your knowledge base
   - **Time saved:** 5-10 hours/week

**5. Client Onboarding System**
   - Triggers on purchase
   - Handles all emails, documents, setup
   - Personalizes based on what they bought
   - Checks in on progress
   - **Time saved:** 3-5 hours per client

---

### Gumloop Prompt Templates for ChatGPT

**To design your workflow, use ChatGPT first:**

```
I want to automate [PROCESS] using Gumloop.

Current manual process:
1. [STEP 1]
2. [STEP 2]
3. [STEP 3]

Design a Gumloop workflow that:
- Automates the repetitive parts
- Uses AI where intelligent decisions are needed
- Handles edge cases

Describe:
1. What triggers the workflow
2. What nodes to use (triggers, actions, AI nodes, conditions)
3. What AI prompts to use in AI nodes
4. What the end result looks like
```

**For AI node prompts within Gumloop:**

```
I have an AI node in Gumloop that needs to [TASK].

Input data: [WHAT THE AI RECEIVES]

Write the prompt I should put in the AI node to:
- [WHAT IT SHOULD DO]
- [HOW IT SHOULD FORMAT OUTPUT]
- [WHAT TO AVOID]

Keep the prompt clear and specific.
```

---

### Real Gumloop Use Cases (AI Handyman Style)

**Case 1: The Lead Categorizer**
```
Problem: Getting 50 leads/day, manually sorting them into hot/warm/cold
Manual time: 30 minutes per day

Gumloop automation:
→ Reads form submission
→ AI analyzes answers to categorize lead quality
→ Adds to correct spreadsheet tab
→ Sends appropriate email (detailed for hot leads, nurture for warm)

Time now: 0 minutes
```

**Case 2: The Content Multiplier**
```
Problem: Writing content for LinkedIn, Twitter, newsletter separately
Manual time: 6 hours per week

Gumloop automation:
→ Trigger: New LinkedIn post
→ AI reads post
→ AI rewrites for Twitter (punchy, under 280 chars)
→ AI rewrites for Instagram (visual description added)
→ AI expands for newsletter (adds context, examples)
→ Saves all to content calendar

Time now: 30 minutes per week (just write once)
```

**Case 3: The Smart Follow-Upper**
```
Problem: Manually tracking who to follow up with and when
Manual time: 1 hour per day

Gumloop automation:
→ Checks spreadsheet daily for leads with no response
→ For each one: AI reads original conversation
→ AI writes personalized follow-up (references specific points)
→ Sends email
→ Updates tracking

Time now: 0 minutes
```

---

### Before & After

**BEFORE:**
- Manually copying data between tools (30 min/day)
- Forgetting to follow up (losing deals)
- Writing same emails over and over (1-2 hours/day)
- Repurposing content manually (6 hours/week)

**AFTER:**
- Gumloop moves data automatically + intelligently categorizes
- AI-powered follow-ups never miss a lead
- AI writes personalized emails based on context
- One piece of content becomes 4+ automatically

**TOTAL TIME SAVED:** 15-20 hours per week

**Real Example:**
"I was manually processing leads, writing follow-ups, and repurposing content. 15+ hours per week on repetitive BS. Set up 3 Gumloop workflows. Now it all happens automatically, and the AI makes it feel personal, not robotic. Best tool I've found." - Marcus, Marketing Agency Owner

---

### Why This Is the Handyman's Favorite Tool

**Old automation tools (Zapier, Make):**
- Like having a helper who can only do exactly what you say
- No thinking, no adapting
- "If this, then that" - dumb rules

**Gumloop:**
- Like having an assistant who actually understands context
- Can read, think, and make decisions
- Handles complexity without breaking
- Built for modern AI-powered business

**As the AI Handyman, I fix businesses with the best tools available. Gumloop is the best automation tool I've found.**

**Not sponsored. Just works.**

---

### Getting Started Checklist

- [ ] Sign up at gumloop.com (free)
- [ ] Connect your tools (Gmail, Sheets, CRM, etc.)
- [ ] Build your first workflow: Lead Capture (20 minutes)
- [ ] Test it with a real form submission
- [ ] Let it run for 3 days
- [ ] Build workflow #2: Content Repurposing (30 minutes)
- [ ] Watch your time get freed up

**Start with lead capture. You'll see results immediately.**

---

### Need Help Setting This Up?

Gumloop is easier than the old tools, but if you get stuck:
1. Check Gumloop's template library (pre-built workflows)
2. Use ChatGPT to design your workflow (see prompts above)
3. Reply to my email - I'll help you fix it

This is what handymen do. We use the right tools and we help when you're stuck.

---

**Bottom line:**
- **Zapier/Make** = Old way (dumb automation)
- **Gumloop** = Handyman way (smart automation)

Build your first workflow this week. You'll never go back.
