---
name: gumloop-workflow-designer
description: "Map existing Gumloop workflows or design new ones from requirements. Two modes: ANALYZE (reverse-engineer existing workflows) and BUILD (design from scratch). Outputs detailed specifications focused on maintainability, clarity, and efficiency. Use when you need to understand a Gumloop automation, plan a new workflow, or optimize existing processes. Triggers on: analyze this workflow, design a Gumloop automation, map this process, build workflow for, automate this with Gumloop, optimize this workflow."
---

# Gumloop Workflow Designer

Automation isn't about doing more. It's about thinking clearly.

The difference between brittle workflows and maintainable ones isn't complexity—it's clarity. Workflows fail not because they're simple, but because they're confusing. They break not because they're small, but because edge cases weren't considered. They become expensive not because they use APIs, but because they use them wastefully.

This skill helps you design Gumloop automations that are:
- **Understandable** at a glance (future you won't hate past you)
- **Efficient** by design (minimal API calls, optimal routing)
- **Maintainable** without documentation (self-documenting nodes and clear naming)

Whether you're reverse-engineering an existing workflow or building from scratch, the goal is the same: clear thinking produces clear automation.

---

## The Core Job

Create **workflow specifications** that can be implemented in Gumloop with confidence.

For existing workflows (ANALYZE mode), produce documentation that reveals how it works, where it's weak, and how to improve it.

For new workflows (BUILD mode), produce blueprints that are implementation-ready: clear structure, defined data flows, error handling, and quality gates.

**Output format:**
- Workflow specification document (detailed blueprint)
- Quality assessment (maintainability, efficiency, clarity scores)
- Implementation guidance (next steps, gotchas, considerations)

---

## Two Modes

### Mode 1: ANALYZE
**Use when:** You have an existing Gumloop workflow that needs understanding, documentation, or optimization.

**Process:** Reverse-engineer the workflow → Document architecture → Evaluate quality → Recommend improvements

**You'll need:**
- Workflow export (JSON/YAML if available)
- Screenshots of workflow canvas
- Description of what it's supposed to do
- Known issues or pain points

### Mode 2: BUILD
**Use when:** Starting fresh with a requirement that needs automation design.

**Process:** Gather requirements → Map the process → Design nodes → Create specification

**You'll need:**
- Clear understanding of the process to automate
- List of systems that need to connect
- Desired outcomes and success criteria
- Constraints (rate limits, budget, compliance needs)

### How to Choose

Ask: "Do you have an existing Gumloop workflow to analyze?"

- **Yes, analyze this workflow** → ANALYZE mode
- **No, I need to design one** → BUILD mode
- **I have a workflow but want to rebuild it better** → ANALYZE mode first (learn from it), then BUILD mode (redesign)

---

## Mode 1: ANALYZE - Reverse Engineering Workflows

The goal: Understand what the workflow does, evaluate how well it does it, and recommend improvements.

### Phase 1: Intake

First, gather everything you need to understand the workflow.

**Required Inputs:**
```
[ ] Workflow export (JSON/YAML if available from Gumloop)
[ ] Screenshots of workflow canvas (full view + detailed sections)
[ ] Description of what it's supposed to do
[ ] Known issues or pain points
[ ] Access to live workflow (optional but ideal for testing)
```

**Qualifying Questions:**

Ask these to get context:

1. **What does this workflow automate?** (high-level goal)
2. **What triggers it?** (webhook, schedule, manual button, API call)
3. **What systems does it connect to?** (HubSpot, Salesforce, Slack, etc.)
4. **What's working well?** (don't just focus on problems)
5. **What's breaking or underperforming?** (specific failure modes)
6. **Why are you analyzing it?** (understand for handoff, optimize performance, migrate platform, debug issues, prepare to extend)

**Document their answers.** They'll inform your evaluation.

---

### Phase 2: Workflow Mapping

Now reconstruct the workflow's architecture.

#### 1. Trigger Analysis

Document how this workflow starts:

**Type:**
- Webhook (from which service?)
- Schedule (cron pattern, timezone)
- Manual trigger (button click, API call)
- Event-based (file upload, form submission)

**Frequency/Conditions:**
- How often does it run?
- What conditions must be met?
- What's the expected payload structure?

**Example:**
```
TRIGGER: Webhook from HubSpot
Frequency: Real-time (when contact created)
Payload: {
  "email": "user@example.com",
  "firstname": "John",
  "properties": {...}
}
```

---

#### 2. Node Inventory

List every node in execution order:

**Format:**
```
1. [Node Name] — [Node Type] — [Purpose]
2. [Node Name] — [Node Type] — [Purpose]
   ├─ 2a. [Branch A Name] — [Condition]
   └─ 2b. [Branch B Name] — [Condition]
3. [Node Name] — [Node Type] — [Purpose]
```

**Node Types to Identify:**
- API Call (to external service)
- Data Transform (manipulate data structure)
- Condition (if/then logic)
- Loop (iterate over array)
- Webhook Response (send data back)
- Delay (wait for X time)
- Human-in-the-Loop (pause for approval)

**Example:**
```
1. Fetch Contact from HubSpot — API Call — Get full contact record
2. Enrich with Clearbit — API Call — Add company data
3. Check if Enterprise — Condition — Company size > 1000 employees
   ├─ 3a. Send to Sales Slack — Webhook — High-priority alert
   └─ 3b. Add to Standard Nurture — API Call — Update in marketing automation
4. Log Result to Notion — API Call — Track processing
```

---

#### 3. Data Flow Tracking

Trace how data transforms through the workflow.

**What to Document:**

**Input Data:**
- What enters the workflow (structure, source)

**Transformations:**
- How data changes at each node
- What fields are added, removed, or modified
- Where data branches or merges

**Output Data:**
- What leaves the workflow (structure, destination)

**Example:**
```
INPUT (HubSpot Webhook):
{
  "email": "john@startup.com",
  "firstname": "John",
  "company": "Startup Inc"
}

↓ [Enrich with Clearbit]

INTERMEDIATE STATE:
{
  "email": "john@startup.com",
  "firstname": "John",
  "company": {
    "name": "Startup Inc",
    "domain": "startup.com",
    "employee_count": 50,
    "industry": "SaaS"
  }
}

↓ [Check if Enterprise] → NO (employee_count < 1000)

↓ [Add to Standard Nurture]

OUTPUT (To Marketing Automation):
{
  "email": "john@startup.com",
  "segment": "SMB",
  "source": "gumloop_enrichment"
}
```

---

#### 4. Integration Points

For each external API called:

**Document:**
- **Endpoint:** URL pattern or service name
- **Method:** GET, POST, PUT, DELETE
- **Authentication:** API key, OAuth, Basic Auth
- **Rate Limits:** X calls per Y seconds (if known)
- **Data Mapping:** Which workflow fields map to which API fields

**Example:**
```
### HubSpot Integration

Endpoint: /contacts/v1/contact/email/{email}
Method: GET
Auth: API Key (hapikey)
Rate Limit: 100 calls/10 seconds

Data Mapping:
  Workflow → HubSpot
  email → email
  firstname → firstname
  company → company
```

---

#### 5. Logic Analysis

Identify all decision points and complex logic:

**Conditional Branching:**
- What conditions trigger different paths?
- Are all branches covered?
- What happens in edge cases?

**Loops:**
- What triggers the loop?
- What's the iteration logic?
- How does it exit?
- Is there a maximum iteration count?

**Error Handling:**
- Are there try/catch blocks?
- What happens when an API fails?
- Is there retry logic?
- Are errors logged or alerted?

**Edge Cases:**
- What if required data is missing?
- What if API returns empty results?
- What if rate limit is hit?
- What if webhook payload is malformed?

**Document gaps:** If error handling is missing, note it. If edge cases aren't handled, note it.

---

### Phase 3: Evaluation

Now assess the workflow's quality across three dimensions.

#### Maintainability Score

**Criteria:**
```
[ ] Clear node naming (describes WHAT the node does, not technical details)
[ ] Logical grouping of related operations (visually organized sections)
[ ] Minimal nested complexity (max 2-3 levels of nesting)
[ ] Error handling for each integration point
[ ] Readable data transformations (not overly clever or obscure)
[ ] Comments/notes on complex logic
```

**Scoring:**
- ✅ **5-6 checks:** Strong maintainability
- ⚠️ **3-4 checks:** Needs improvement
- ❌ **0-2 checks:** Requires refactor

**Examples:**

✅ **Good:**
```
Node: fetch_customer_from_stripe
Purpose: Get customer payment history
Clear, descriptive, obvious
```

❌ **Bad:**
```
Node: api_call_1
Purpose: Stripe API
Vague, unhelpful, unclear
```

---

#### Efficiency Score

**Criteria:**
```
[ ] Minimal API calls (batching where possible, avoiding redundant fetches)
[ ] Parallel execution where nodes are independent
[ ] Appropriate use of loops vs individual calls
[ ] Caching of repeated data fetches
[ ] Conditional execution to skip unnecessary work
```

**Scoring:**
- ✅ **4-5 checks:** Strong efficiency
- ⚠️ **2-3 checks:** Needs improvement
- ❌ **0-1 checks:** Requires optimization

**Examples:**

✅ **Efficient:**
```
Batch API Call: Fetch 100 contacts in one request
Parallel: Fetch HubSpot contact + Stripe subscription simultaneously (independent operations)
Early Exit: Check if customer exists BEFORE fetching full profile (conditional)
```

❌ **Inefficient:**
```
Loop: 100 iterations, each makes individual API call (should batch)
Sequential: Fetch HubSpot, wait, then fetch Stripe (could parallelize)
Always Execute: Fetches full data even when not needed (should conditionally execute)
```

---

#### Clarity Score

**Criteria:**
```
[ ] Obvious what each section does (self-documenting structure)
[ ] Data flow is traceable (easy to follow input → output)
[ ] Variable names are descriptive (not x, y, temp, data1)
[ ] No "clever" shortcuts that obscure intent
[ ] Someone unfamiliar could maintain this
```

**Scoring:**
- ✅ **4-5 checks:** Strong clarity
- ⚠️ **2-3 checks:** Needs improvement
- ❌ **0-1 checks:** Requires simplification

**Examples:**

✅ **Clear:**
```
Section: Customer Enrichment
  ↓
  fetch_contact_from_hubspot
  enrich_with_clearbit_company_data
  merge_hubspot_and_clearbit_profiles

Data flow obvious, steps logical, purpose clear
```

❌ **Unclear:**
```
Section: Processing
  ↓
  process_data_1
  transform
  handler

What's being processed? Why? How? Unclear.
```

---

### Phase 4: Insights & Recommendations

Compile everything into an actionable analysis report.

**Output Format:**

```markdown
## Workflow Analysis: [Workflow Name]

### What It Does

[Plain English description of purpose and outcome]

Example: "This workflow enriches new HubSpot contacts with company data from Clearbit, segments them by company size, and routes enterprise leads to sales while adding SMB leads to automated nurture sequences."

---

### Architecture Overview

```
TRIGGER: [Type and conditions]
  ↓
NODE SEQUENCE:
1. [Node name] — [Purpose]
2. [Node name] — [Purpose]
   ↓ (branches)
   2a. [Condition A path] — [What happens]
   2b. [Condition B path] — [What happens]
3. [Node name] — [Purpose]
  ↓
OUTPUT: [What gets produced/sent]
```

Example:
```
TRIGGER: HubSpot webhook (contact created)
  ↓
NODE SEQUENCE:
1. fetch_contact_from_hubspot — Get full contact record
2. enrich_with_clearbit — Add company data (size, industry)
   ↓ (branches)
   2a. IF company_size > 1000 → send_to_sales_slack (high-priority)
   2b. IF company_size ≤ 1000 → add_to_nurture_sequence (automated)
3. log_to_notion — Track enrichment result
  ↓
OUTPUT: Contact enriched, routed to appropriate team
```

---

### Data Flow

```
INPUT: [Structure and source]
  ↓
TRANSFORMATIONS:
  → Step 1: [What changes]
  → Step 2: [What changes]
  → Step 3: [What changes]
  ↓
OUTPUT: [Final structure and destination]
```

Example:
```
INPUT (HubSpot):
{"email": "...", "firstname": "...", "company": "..."}
  ↓
TRANSFORM 1 (Clearbit enrichment):
{"email": "...", "company": {"name": "...", "size": 50, "industry": "SaaS"}}
  ↓
TRANSFORM 2 (Segmentation):
{"email": "...", "segment": "SMB", "priority": "standard"}
  ↓
OUTPUT (Marketing Automation):
{"email": "...", "segment": "SMB", "source": "gumloop"}
```

---

### Quality Assessment

#### Maintainability: [Strong / Needs Improvement / Requires Refactor]

- ✅ **What's good:**
  - Node names are descriptive
  - Error handling present for API calls

- ⚠️ **What's concerning:**
  - Some sections lack comments
  - Nested conditions are 3-4 levels deep

- ❌ **What's broken:**
  - No error handling for Clearbit API failures

---

#### Efficiency: [Strong / Needs Improvement / Requires Refactor]

- ✅ **What's optimized:**
  - HubSpot and Clearbit calls run in parallel (good!)

- ⚠️ **What could be better:**
  - Fetches full contact data even when only email needed

- ❌ **What's wasteful:**
  - Logs to Notion on every run (could batch log every 100 contacts)

---

#### Clarity: [Strong / Needs Improvement / Requires Refactor]

- ✅ **What's clear:**
  - Visual sections are well-organized
  - Data flow is traceable

- ⚠️ **What's confusing:**
  - Some variable names are generic (data, result, output)

- ❌ **What's incomprehensible:**
  - One transformation uses complex regex without explanation

---

### Improvement Opportunities

#### Quick Wins (low effort, high impact)

1. **Add error handling for Clearbit API**
   - Before: API fails → workflow stops silently
   - After: Retry 3 times, fallback to basic data if still fails

2. **Rename generic variables**
   - Before: `data` → `temp` → `output`
   - After: `hubspot_contact` → `enriched_contact` → `segmented_contact`

---

#### Structural Improvements (medium effort, high impact)

1. **Batch Notion logging**
   - Current: Logs every contact individually (100 contacts = 100 API calls)
   - Better: Collect results in array, batch log every 50 contacts (100 contacts = 2 API calls)

2. **Simplify nested conditions**
   - Current: 4 levels of if/then nesting (hard to follow)
   - Better: Use early returns, flatten to 2 levels max

---

#### Rethink Needed (high effort, transformative)

1. **Consider caching Clearbit data**
   - Issue: Re-fetches same company data for employees of same company
   - Solution: Cache company data by domain, reuse for subsequent contacts
   - Impact: 80% reduction in Clearbit API calls

---

### Potential Issues

#### Current Risks:

- **Clearbit rate limit:** No handling if daily quota exceeded → workflow breaks
- **Missing data:** If Clearbit returns null for company_size, condition fails
- **Webhook failures:** No retry mechanism if HubSpot webhook delivery fails

#### Edge Cases Not Handled:

- What if email domain doesn't match company? (e.g., Gmail)
- What if contact is updated multiple times in quick succession?
- What if Slack channel is archived or bot is removed?

---

### Next Steps

**Prioritized Action Plan:**

1. **Immediate (do first):** Add error handling for Clearbit API
2. **This week:** Rename variables for clarity, add comments to complex sections
3. **Next sprint:** Implement Clearbit data caching, batch Notion logging
4. **Future consideration:** Add webhook retry mechanism

**Estimated Impact:**
- Reliability: +40% (error handling)
- Cost: -60% (caching + batching)
- Maintainability: +30% (naming + comments)
```

---

## Mode 2: BUILD - Designing New Workflows

The goal: Turn a process requirement into an implementation-ready workflow specification.

### Phase 1: Requirements Gathering

Before designing nodes, deeply understand what needs to happen.

**The Intake Questions:**

Ask these 20 questions across 4 categories:

#### Goal Definition

1. **What manual process are we automating?**
   (e.g., "When a lead fills out our form, we manually look them up in Clearbit, check if they're enterprise, and route to sales or marketing")

2. **What's the desired end result?**
   (e.g., "Enterprise leads get to sales within 5 minutes, others go to nurture sequence")

3. **Who or what triggers this process?**
   (e.g., "Form submission on our website")

4. **How often does this need to run?**
   (e.g., "Real-time for every form submission" or "Batch process overnight")

5. **What does success look like?**
   (e.g., "Zero enterprise leads slip through cracks, SMB leads get nurtured automatically, ops team saves 10 hours/week")

---

#### Data & Integrations

6. **What systems need to talk to each other?**
   (e.g., "Webflow form → Clearbit API → HubSpot CRM → Slack")

7. **What data needs to flow between them?**
   (e.g., "Email, name, company from form → enriched company data → CRM contact record → Slack notification")

8. **Are there any rate limits or API constraints?**
   (e.g., "Clearbit: 1,000 calls/month, HubSpot: 100 calls/10 seconds")

9. **What credentials/permissions are needed?**
   (e.g., "Webflow webhook token, Clearbit API key, HubSpot OAuth, Slack bot token")

10. **Is there existing data to migrate or sync?**
    (e.g., "Yes, 5,000 existing contacts need enrichment" or "No, starting fresh")

---

#### Complexity & Constraints

11. **Are there conditional paths?** (if/then logic)
    (e.g., "If company size > 1,000, route to sales; else route to marketing")

12. **Are there loops?** (process multiple items)
    (e.g., "For each product in their cart, check inventory and reserve")

13. **What edge cases need handling?**
    (e.g., "What if Clearbit doesn't have company data?", "What if email is personal (Gmail)?")

14. **What's the acceptable error tolerance?**
    (e.g., "Can't lose any enterprise leads, okay if some SMB enrichment fails")

15. **Any regulatory/compliance requirements?**
    (e.g., "GDPR: need consent before enriching, SOC2: must log all data access")

---

#### Context

16. **Who will maintain this workflow?**
    (e.g., "Marketing ops team, semi-technical")

17. **How technical is the team?**
    (e.g., "Can edit configs but not write code")

18. **What's the budget for API calls?**
    (e.g., "Trying to minimize costs, prefer batching")

19. **Timeline for implementation?**
    (e.g., "Need working version in 2 weeks, can optimize later")

20. **Any systems this needs to integrate with later?**
    (e.g., "Eventually add Salesforce, but HubSpot for now")

---

**Document all answers.** They'll inform every design decision.

---

### Phase 2: Process Mapping

Before touching Gumloop, map the logical flow on paper.

#### Step 1: Write the Narrative

In plain English, describe the process flow:

**Template:**
```
When [TRIGGER happens],
the system should [ACTION 1],
then [ACTION 2],
and finally [ACTION 3].

If [CONDITION], instead do [ALTERNATIVE PATH].

The result should be [OUTPUT].
```

**Example:**
```
When a form is submitted on our website,
the system should:
  1. Extract the email from the form submission
  2. Look up the company in Clearbit using the email domain
  3. Check if the company has more than 1,000 employees

If YES (enterprise):
  - Send a high-priority alert to #sales-alerts in Slack
  - Create a contact in HubSpot with "Enterprise" tag
  - Assign to SDR for immediate follow-up

If NO (SMB):
  - Create contact in HubSpot with "SMB" tag
  - Add to automated nurture email sequence

The result should be: Every lead is enriched, tagged, and routed within 5 minutes.
```

---

#### Step 2: Identify Decision Points

List all conditional logic and loops:

**Decision Points:**
```
DECISION 1: After [step], check if [condition]
  → YES path: [what happens]
  → NO path: [what happens]

DECISION 2: For each [item in list]:
  → Process: [repeated action]
  → Continue until: [completion condition]
```

**Example:**
```
DECISION 1: After Clearbit lookup, check if company_size > 1,000
  → YES: Route to sales path
  → NO: Route to marketing path

DECISION 2: For each product in cart:
  → Check inventory availability
  → Reserve if available, mark as unavailable if not
  → Continue until all products processed
```

---

#### Step 3: Data Transformation Map

Trace how data changes at each step:

**Template:**
```
START DATA:
{
  field1: value,
  field2: value
}

TRANSFORM 1: [What changes and why]
↓
{
  new_field: derived_value,
  field1: value
}

TRANSFORM 2: [What changes and why]
↓
{
  final_structure: formatted_value
}

END DATA: [What gets sent where]
```

**Example:**
```
START DATA (Form Submission):
{
  "email": "john@startup.com",
  "name": "John Doe",
  "message": "Interested in Enterprise plan"
}

TRANSFORM 1 (Extract domain from email):
{
  "email": "john@startup.com",
  "name": "John Doe",
  "domain": "startup.com"
}

TRANSFORM 2 (Clearbit enrichment):
{
  "email": "john@startup.com",
  "name": "John Doe",
  "company": {
    "name": "Startup Inc",
    "size": 50,
    "industry": "SaaS"
  }
}

TRANSFORM 3 (Segmentation logic):
{
  "email": "john@startup.com",
  "name": "John Doe",
  "segment": "SMB",
  "priority": "standard"
}

END DATA (To HubSpot):
{
  "email": "john@startup.com",
  "firstname": "John",
  "lastname": "Doe",
  "company": "Startup Inc",
  "hs_lead_status": "SMB",
  "source": "gumloop_enrichment"
}
```

---

### Phase 3: Node Design

Now translate the process map into Gumloop nodes.

#### Node Naming Convention

Follow this pattern: `[ACTION]_[OBJECT]_[CONTEXT]`

**Actions:** fetch, transform, send, check, loop, create, update, delete, validate, enrich

**Objects:** contact, order, email, data, notification, record, company, product

**Context:** from_[source], to_[destination], for_[purpose], if_[condition]

**Examples:**

✅ **Good:**
```
fetch_contact_from_hubspot
transform_data_to_slack_format
send_notification_to_sales_team
check_if_enterprise_company
loop_through_order_items
create_contact_in_salesforce
validate_email_format
enrich_company_data_from_clearbit
```

❌ **Bad:**
```
api_call_1
data_manipulation
condition
loop
handler
process
```

---

#### Node Structure Template

For each node, document this:

```markdown
### Node: [Descriptive Name]

**Type:** [API Call / Data Transform / Condition / Loop / Webhook / Delay]

**Purpose:** [One sentence: what and why]

**Inputs:**
- [Field name]: [Source and type]
- [Field name]: [Source and type]

**Processing:**
[Detailed explanation of what this node does to the data]

**Outputs:**
- [Field name]: [Type and destination]
- [Field name]: [Type and destination]

**Error Handling:**
- If [error type]: [what happens]
- Retry logic: [yes/no and config]
- Fallback: [alternative path if exists]

**Dependencies:**
- Requires: [previous node outputs]
- Connects to: [next node(s)]
```

**Example:**

```markdown
### Node: enrich_company_data_from_clearbit

**Type:** API Call

**Purpose:** Fetch company information using email domain to determine company size and industry

**Inputs:**
- email: string (from form submission)
- domain: string (extracted from email)

**Processing:**
1. Call Clearbit Company API with domain
2. Extract company name, employee count, industry
3. Handle case where company not found (return null values)

**Outputs:**
- company_name: string (to HubSpot contact)
- company_size: number (to segmentation condition)
- industry: string (to HubSpot contact)

**Error Handling:**
- If API fails: Retry 3 times with exponential backoff (2s, 4s, 8s)
- If still fails: Continue workflow with company_size = null (triggers default SMB path)
- If rate limit hit: Queue request for retry in 1 hour

**Dependencies:**
- Requires: email domain from extract_domain_from_email node
- Connects to: check_if_enterprise_company condition node
```

---

### Phase 4: Workflow Specification

Compile everything into a complete blueprint.

**Full Template:**

```markdown
# Gumloop Workflow Specification: [Workflow Name]

## Overview

**Purpose:** [What this workflow automates in one sentence]

**Trigger:** [What starts this workflow]
- Type: [Webhook/Schedule/Manual/API]
- Frequency: [How often or conditions]
- Payload: [Expected input structure]

**End Result:** [What happens when it completes]

**Systems Involved:**
- [System 1]: [What it provides/receives]
- [System 2]: [What it provides/receives]
- [System 3]: [What it provides/receives]

---

## Process Flow

### High-Level Flow

```
[TRIGGER]
  ↓
[STEP 1: Description]
  ↓
[STEP 2: Description]
  ↓
[DECISION: Condition]
  ├─→ YES: [Path A]
  └─→ NO: [Path B]
  ↓
[STEP 3: Description]
  ↓
[COMPLETE]
```

### Detailed Node Sequence

#### 1. [Node Name]
**Type:** [Node type]
**Purpose:** [What and why]
**Config:**
- Input: [Data structure]
- Processing: [What it does]
- Output: [Result structure]
**Error Handling:** [How failures are managed]

#### 2. [Node Name]
[Same structure...]

[Continue for all nodes...]

---

## Data Flow Diagram

```
INPUT STRUCTURE:
{
  "trigger_field": "value",
  "data_payload": {
    "nested": "structure"
  }
}

↓ [node_name_1]

INTERMEDIATE STATE 1:
{
  "transformed_field": "new_value",
  "original_field": "preserved"
}

↓ [node_name_2]

INTERMEDIATE STATE 2:
{
  "final_structure": "formatted_value"
}

↓ [node_name_3]

OUTPUT:
{
  "status": "success",
  "timestamp": "2025-01-02T10:00:00Z"
}
```

---

## Integration Details

### [System 1 - e.g., HubSpot]

**API Calls Required:**
- Endpoint: [URL pattern]
- Method: [GET/POST/PUT/DELETE]
- Authentication: [Type and how to configure]
- Rate Limits: [X calls per Y seconds]

**Data Mapping:**
- Workflow field → API field
- [field1] → [external_field1]
- [field2] → [external_field2]

**Example Request:**
```json
{
  "email": "john@example.com",
  "properties": {
    "firstname": "John",
    "company": "Example Inc"
  }
}
```

**Example Response:**
```json
{
  "vid": 12345,
  "email": "john@example.com",
  "properties": {...}
}
```

[Repeat for each system...]

---

## Error Handling Strategy

### Critical Path Failures

**If [Node X] fails:**
- Retry: [X times with Y second delay]
- Fallback: [Alternative action or alert]
- Impact: [What breaks if this fails]

**Example:**
```
If Clearbit API fails:
- Retry: 3 times with exponential backoff (2s, 4s, 8s)
- Fallback: Continue with company_size = null (defaults to SMB path)
- Impact: Lead not segmented optimally, but still processed
```

---

### Data Validation

**Before [Node Y]:**
- Check: [Required fields present]
- Validate: [Data format correct]
- If invalid: [Reject with error message]

**Example:**
```
Before create_contact_in_hubspot:
- Check: email field is present and not empty
- Validate: email matches pattern user@domain.com
- If invalid: Log error, send alert to ops team, skip contact creation
```

---

### Edge Cases

**Scenario 1:** [Unusual but possible situation]
- Detection: [How workflow identifies this]
- Handling: [What happens]

**Example:**
```
Scenario: Email uses personal domain (Gmail, Yahoo)
- Detection: Check if domain in list of personal email providers
- Handling: Skip Clearbit enrichment, tag as "personal_email", route to default nurture
```

[Continue for each edge case...]

---

## Performance & Optimization

### API Call Optimization

- **Total API calls per run:** [Number]
- **Parallel execution opportunities:** [Which nodes can run simultaneously]
- **Batching opportunities:** [Where multiple calls could be combined]

**Example:**
```
Current: 3 API calls per contact (HubSpot fetch, Clearbit enrich, HubSpot update)
Optimization: Run HubSpot fetch + Clearbit enrich in parallel → saves 2-3 seconds per contact
Batching: If processing 100 contacts, batch HubSpot updates (1 call instead of 100)
```

---

### Expected Performance

- **Average execution time:** [Duration for typical run]
- **Max execution time:** [Duration for worst case]
- **Bottlenecks:** [Known slow points]

**Example:**
```
Average: 5 seconds per contact
Max: 15 seconds (if Clearbit API is slow + retries needed)
Bottleneck: Clearbit API response time (2-4 seconds typical)
```

---

## Maintenance Guide

### Node Naming Legend

```
[Action]_[Object]_[Context]

Actions: fetch, transform, send, check, loop, create, update, delete
Objects: contact, order, email, data, notification
Context: from_[source], to_[destination], for_[purpose]
```

---

### Common Modification Scenarios

**To add a new field:**
1. Update [Node X] to include field in fetch
2. Modify [Node Y] transformation to map new field
3. Update output schema in [Node Z]

**To change trigger conditions:**
1. Modify [Trigger Node] configuration
2. Update validation in [First Processing Node]
3. Test edge cases: [List scenarios]

**To add new integration:**
1. Create new node after [Node X]
2. Map data fields using same naming convention
3. Add error handling following existing patterns
4. Update documentation in this spec

---

## Testing Checklist

**Before deployment:**

```
[ ] Happy path tested (expected inputs, all conditions work)
[ ] Error path tested (API failures, missing data, malformed inputs)
[ ] Edge cases tested (empty lists, null values, max limits)
[ ] Rate limits respected (doesn't exceed API quotas)
[ ] Error messages clear and actionable
[ ] Retry logic works as expected
[ ] Logging captures necessary debug info
[ ] Manual override/stop mechanism works
[ ] Credentials are configured correctly
[ ] Webhooks deliver to correct endpoints
```

---

## Quality Gates

Before considering this workflow "done," verify:

### Maintainability

- [ ] Node names are descriptive (no "api_1", "data_transform")
- [ ] Logic is linear with minimal nesting (max 2-3 levels)
- [ ] Error handling for each integration point
- [ ] Someone unfamiliar could understand the flow

### Efficiency

- [ ] Minimal API calls (no redundant fetches)
- [ ] Parallel execution where nodes are independent
- [ ] Batching used for processing lists/arrays
- [ ] Early exits for failed conditions (don't process further if disqualified)

### Clarity

- [ ] Data flow is traceable (input → transform → output obvious)
- [ ] Each node has single clear purpose
- [ ] No "clever" tricks that obscure logic
- [ ] Variables named descriptively

---

## Implementation Notes

### Gumloop-Specific Considerations

**Node Types to Use:**
- [List specific Gumloop node recommendations]

**Credential Setup:**
- [Which integrations need authentication configured]

**Testing Approach:**
- [How to test in Gumloop environment before going live]

**Deployment:**
- [How to move from test to production]

---

### Next Steps

**Implementation Tasks:**
1. [First task]
2. [Second task]
3. [Testing task]
4. [Deployment task]

**Post-Launch Monitoring:**
- Monitor [specific metric] to ensure [expected behavior]
- Watch for [potential issue] in first 48 hours
- Review error logs daily for first week
```

---

## The Quality Framework

These principles guide every workflow design.

### Maintainability Principles

#### Principle 1: Readable Node Names

Node names should describe WHAT happens, not technical details.

**Bad:**
```
api_call_1
data_transform
condition_check
loop
handler
```

**Good:**
```
fetch_customer_from_stripe
format_order_data_for_slack
check_if_first_time_purchase
loop_through_cart_items
send_notification_to_support_team
```

**Why it matters:** In 6 months, you should understand what a node does from its name alone.

---

#### Principle 2: Logical Grouping

Group related operations visually in the workflow canvas.

**Example:**
```
[Customer Data Fetch]
  → fetch_customer_from_hubspot
  → enrich_with_clearbit_data
  → merge_customer_profiles

[Order Processing]
  → validate_order_items
  → calculate_totals_and_discounts
  → apply_promo_codes

[Payment & Fulfillment]
  → charge_stripe_payment
  → send_receipt_email
  → trigger_fulfillment_webhook
```

**Why it matters:** Sections make workflows scannable. You can understand structure at a glance.

---

#### Principle 3: Error Handling

Every integration point needs error handling.

**Required for each API call:**
- Retry logic (typically 3 attempts with exponential backoff)
- Clear error messages (what failed, why, what to check)
- Fallback behavior (alternative path or graceful degradation)
- Alerting (who gets notified of failures)

**Example:**
```
Node: fetch_customer_from_stripe

Error Handling:
- Retry: 3 times (delays: 2s, 4s, 8s)
- Error message: "Stripe API timeout - customer ID: {customer_id}"
- Fallback: Use cached customer data if available, else skip charge
- Alert: Send to #ops-alerts if all retries fail
```

**Why it matters:** APIs fail. Networks timeout. Workflows should handle this gracefully, not silently break.

---

### Efficiency Principles

#### Principle 1: Minimize API Calls

Every API call costs time and sometimes money. Batch when possible.

**DON'T:**
```
Loop through 100 contacts:
  For each contact:
    Fetch contact details from HubSpot (1 API call)

Total: 100 API calls
Time: ~100 seconds (assuming 1 sec per call)
```

**DO:**
```
Batch fetch all 100 contacts from HubSpot (1 API call)
Loop through results locally:
  Process each contact

Total: 1 API call
Time: ~2 seconds
```

**Why it matters:** 100 API calls vs 1 API call. 100 seconds vs 2 seconds. Less cost, faster execution.

---

#### Principle 2: Parallel Execution

If nodes don't depend on each other, run them simultaneously.

**Sequential (slow):**
```
fetch_hubspot_contact (3 seconds)
  ↓
fetch_stripe_subscription (4 seconds)
  ↓
Total: 7 seconds
```

**Parallel (fast):**
```
fetch_hubspot_contact (3 seconds)  ┐
                                    ├─→ Both run simultaneously
fetch_stripe_subscription (4 seconds) ┘
  ↓
Total: 4 seconds (limited by slower call)
```

**Why it matters:** Don't wait unnecessarily. If operations are independent, run them together.

---

#### Principle 3: Conditional Execution

Exit early if the path doesn't apply.

**Wasteful:**
```
fetch_customer_full_profile (expensive API call)
  ↓
check_if_customer_exists
  ↓
  NO → exit workflow (wasted the API call!)
```

**Efficient:**
```
check_if_customer_exists (cheap lookup)
  ↓
  NO → exit workflow early (saved the expensive call)
  YES → fetch_customer_full_profile (only when needed)
```

**Why it matters:** Don't fetch data you might not need. Check conditions first, fetch data second.

---

### Clarity Principles

#### Principle 1: Self-Documenting Workflows

Descriptive names make workflows readable without comments.

**Needs explanation:**
```
[node1] → [node2] → [condition1] → [node3]

You have to read each node's config to understand what's happening.
```

**Self-explanatory:**
```
[fetch_order_from_shopify] → [validate_payment_status] → [if_paid_send_confirmation] → [update_inventory]

You can understand the flow without opening any node.
```

**Why it matters:** Future you (or your teammate) shouldn't need to detective-work through the workflow.

---

#### Principle 2: Data Transformation Transparency

When transforming data, make the mapping obvious.

**Example:**
```
Node: transform_hubspot_to_slack_format

Input (HubSpot contact):
{
  "properties": {
    "email": "john@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "company": "Example Inc"
  }
}

Transformation:
  - Extract firstname, lastname, email, company
  - Format as Slack message
  - Add emoji and channel

Output (Slack message):
{
  "channel": "#new-leads",
  "text": "🎉 New lead: John Doe from Example Inc",
  "email": "john@example.com"
}
```

**Why it matters:** Someone maintaining this needs to know how data changes. Don't make it a mystery.

---

#### Principle 3: Single Responsibility Per Node

Each node should do ONE thing well.

**Bad (multi-purpose node):**
```
Node: fetch_and_transform_and_send_data

Does too much:
  - Fetches contact from HubSpot
  - Enriches with Clearbit
  - Formats for Slack
  - Sends notification
```

**Good (single-responsibility nodes):**
```
Node: fetch_contact_from_hubspot
  → Does one thing: Get contact data

Node: enrich_contact_with_clearbit
  → Does one thing: Add company data

Node: format_notification_for_slack
  → Does one thing: Transform to Slack format

Node: send_notification_to_sales_channel
  → Does one thing: Send to Slack
```

**Why it matters:** Debugging is easier. Reusability is higher. Changes are safer.

---

## Common Workflow Patterns

Pre-built patterns for common automation scenarios.

### Pattern 1: Data Sync Between Systems

**Use Case:** Keep two systems (e.g., HubSpot and Salesforce) in sync.

**When to Use:**
- You need contacts/deals in multiple CRMs
- Changes in one system should reflect in the other
- Avoiding manual duplicate entry

**Flow Diagram:**
```
TRIGGER: HubSpot contact created (webhook)
  ↓
[fetch_new_contact_details_from_hubspot]
  ↓
[check_if_contact_exists_in_salesforce]
  ├─→ YES: [update_salesforce_contact_with_new_data]
  └─→ NO: [create_salesforce_contact]
  ↓
[log_sync_result_to_database]
```

**Key Considerations:**
- **Deduplication:** Check before creating (search by email, phone, or unique ID)
- **Field mapping:** HubSpot fields ≠ Salesforce fields (map carefully)
- **Bidirectional sync prevention:** Avoid infinite loops (HubSpot→SF→HubSpot→SF...)
- **Conflict resolution:** If both systems have changes, which wins?

**Gotchas:**
- Personal email domains (Gmail) may not have company data
- Some fields may not have equivalents in the other system
- Rate limits differ between systems

**Example:**
```
Trigger: HubSpot webhook (contact created)
  ↓
fetch_contact_from_hubspot:
  - email, firstname, lastname, company, phone
  ↓
check_if_exists_in_salesforce (search by email):
  - Found? → update_salesforce_contact
  - Not found? → create_salesforce_contact
  ↓
log_to_notion:
  - Timestamp, contact email, action (created/updated), status
```

---

### Pattern 2: Notification/Alert Workflows

**Use Case:** Alert team when something important happens.

**When to Use:**
- High-value lead signs up
- Customer requests refund
- Error occurs in another system
- SLA threshold is breached

**Flow Diagram:**
```
TRIGGER: Event occurs (e.g., form submission)
  ↓
[fetch_context_data]
  ↓
[enrich_with_additional_info]
  ↓
[check_if_meets_alert_criteria]
  ├─→ YES:
  │   [format_high_priority_alert]
  │   [send_to_slack_channel]
  │   [send_email_to_on_call_person]
  │   [create_ticket_in_jira]
  └─→ NO:
      [log_event_for_later_review]
```

**Key Considerations:**
- **Scoring/filtering:** What qualifies as "alert-worthy"? (Don't alert on everything)
- **Message formatting:** Include actionable info (what happened, why it matters, what to do)
- **Multiple channels:** Slack + email + SMS for critical alerts
- **Alert fatigue:** Too many alerts = team ignores them

**Gotchas:**
- Slack channel might be archived or bot removed
- Email might go to spam
- Alert during off-hours (consider "do not disturb" windows)

**Example:**
```
Trigger: New user signup
  ↓
fetch_user_profile_data:
  - email, company, signup_source
  ↓
enrich_with_clearbit:
  - company_size, industry, funding
  ↓
check_if_enterprise (company_size > 1000):
  - YES:
      format_alert: "🚨 Enterprise Lead: {name} from {company} ({size} employees)"
      send_to_sales_slack: #enterprise-leads
      create_salesforce_opportunity: Priority = High
  - NO:
      send_standard_welcome_email
```

---

### Pattern 3: Data Enrichment Pipeline

**Use Case:** Enhance contact/company data with additional information.

**When to Use:**
- Contacts have minimal info (just email)
- Need to qualify leads by company data
- Building lead scoring models

**Flow Diagram:**
```
TRIGGER: New contact added to list
  ↓
[extract_email_domain]
  ↓
[lookup_company_via_clearbit_or_similar]
  ↓
[fetch_company_linkedin_or_other_source]
  ↓
[calculate_lead_score_based_on_enriched_data]
  ↓
[update_contact_in_crm_with_enriched_data]
```

**Key Considerations:**
- **API rate limits:** Enrichment APIs often have tight quotas (batch carefully)
- **Caching:** Don't re-fetch same company data for multiple employees
- **Partial success:** Some enrichments may fail (handle gracefully)
- **Cost:** Enrichment APIs charge per lookup (minimize waste)

**Gotchas:**
- Personal email domains (Gmail) won't have company data
- Startups may not be in enrichment databases yet
- International companies may have incomplete data

**Example:**
```
Trigger: Contact added to "enrich_queue" tag in HubSpot
  ↓
extract_domain_from_email:
  - john@startup.com → startup.com
  ↓
lookup_company_clearbit (use domain):
  - Company name, size, industry, funding
  ↓
fetch_linkedin_company_data (if available):
  - Employee growth rate, recent posts
  ↓
calculate_lead_score:
  - Company size > 100: +20 points
  - Industry = SaaS: +10 points
  - Recent funding: +15 points
  ↓
update_hubspot_contact:
  - Add all enriched fields + lead score
  - Remove from "enrich_queue", add to "enriched"
```

---

### Pattern 4: Multi-Step Approval Workflow

**Use Case:** Content, purchases, or decisions need approval before proceeding.

**When to Use:**
- Content must be reviewed before publishing
- Expenses over threshold need manager approval
- Legal review required for contracts

**Flow Diagram:**
```
TRIGGER: Draft submitted or purchase requested
  ↓
[fetch_item_details]
  ↓
[send_to_reviewer_1_via_slack_or_email]
  ↓
[wait_for_approval_response] (pause workflow)
  ├─→ APPROVED:
  │   [send_to_reviewer_2_if_needed]
  │   [wait_for_final_approval]
  │   ├─→ APPROVED: [execute_action_publish_or_purchase]
  │   └─→ REJECTED: [notify_requester_of_rejection]
  └─→ REJECTED:
      [notify_requester_of_rejection]
```

**Key Considerations:**
- **State management:** Workflow must pause and resume (not all platforms support this)
- **Timeout handling:** What if reviewer doesn't respond within X days?
- **Notification escalation:** Remind reviewer after 24h, 48h, then escalate to manager
- **Audit trail:** Log who approved, when, and any comments

**Gotchas:**
- Workflow paused too long may time out
- Reviewer permissions might change (person leaves company)
- Multiple pending approvals can create backlog

**Example:**
```
Trigger: Blog post moved to "ready_for_review" in Notion
  ↓
fetch_post_content_and_metadata:
  - title, author, word_count, publish_date
  ↓
send_slack_message_to_editor:
  - "Review needed: {title} by {author}"
  - Include link + approve/reject buttons
  ↓
wait_for_slack_response (pause workflow):
  - Timeout: 48 hours
  ├─→ APPROVED:
  │   send_to_legal_reviewer (if contains legal claims):
  │     wait_for_legal_approval (pause 24h)
  │     ├─→ APPROVED:
  │     │   publish_to_cms
  │     │   notify_author: "Published!"
  │     └─→ REJECTED:
  │         notify_author: "Legal rejected: {reason}"
  │
  ├─→ REJECTED:
  │   notify_author: "Editor feedback: {comments}"
  │
  └─→ TIMEOUT (no response after 48h):
      escalate_to_managing_editor
```

---

### Pattern 5: Scheduled Batch Processing

**Use Case:** Run reports, cleanup tasks, or batch operations on a schedule.

**When to Use:**
- Daily reports (sales, traffic, errors)
- Nightly data cleanup (delete old records)
- Weekly summaries (top performers, issues)

**Flow Diagram:**
```
TRIGGER: Cron schedule (e.g., every day at 9 AM)
  ↓
[calculate_date_range_for_report]
  ↓
[fetch_data_from_source_1]
  ↓
[fetch_data_from_source_2]
  ↓
[merge_and_calculate_metrics]
  ↓
[generate_report_document_or_visualization]
  ↓
[send_report_to_team_email_or_slack]
  ↓
[archive_report_in_storage_notion_or_drive]
```

**Key Considerations:**
- **Date range calculations:** "Yesterday", "last 7 days", "last month" (timezone matters!)
- **Data freshness:** Ensure all source systems have updated data before running
- **Report formatting:** Make it readable and actionable (charts > raw numbers)
- **Failure notifications:** If report fails, alert ops team immediately

**Gotchas:**
- Timezone mismatches (9 AM where? UTC? Local?)
- Data not ready yet (some systems lag by hours)
- Report generation might timeout for large datasets

**Example:**
```
Trigger: Cron (Monday at 9 AM UTC)
  ↓
calculate_date_range:
  - start_date: 7 days ago
  - end_date: yesterday
  ↓
fetch_sales_data_from_stripe (date range):
  - total_revenue, num_transactions, avg_order_value
  ↓
fetch_traffic_data_from_google_analytics (date range):
  - sessions, pageviews, conversion_rate
  ↓
calculate_metrics:
  - revenue_per_session = revenue / sessions
  - week_over_week_growth = (this_week - last_week) / last_week
  ↓
generate_report_in_notion:
  - Create new page in "Weekly Reports" database
  - Add charts, tables, key insights
  ↓
send_summary_to_slack (#general):
  - "📊 Weekly Report: Revenue up 12%, traffic flat"
  - Include link to full report
```

---

## Integration with Existing Skills

This skill is domain-agnostic (works for any Gumloop workflow), but integrates with marketing skills when automation is needed.

### FROM Marketing Skills TO gumloop-workflow-designer

When a marketing skill produces output that needs automation:

**content-atomizer → gumloop-workflow-designer:**
- Scenario: "I've atomized content across 6 platforms. Automate the posting."
- Input to Gumloop skill: List of platform posts + schedule preferences
- Output: Workflow that auto-posts to each platform on schedule

**email-sequences → gumloop-workflow-designer:**
- Scenario: "I've written a 5-email nurture sequence. Automate delivery."
- Input to Gumloop skill: Email content + trigger conditions + timing
- Output: Workflow that sends emails based on user behavior

**lead-magnet → gumloop-workflow-designer:**
- Scenario: "I've created a lead magnet PDF. Automate delivery."
- Input to Gumloop skill: Lead magnet file + landing page webhook
- Output: Workflow that delivers PDF when form submitted

**seo-content → gumloop-workflow-designer:**
- Scenario: "I've written SEO content. Schedule and publish automatically."
- Input to Gumloop skill: Content + CMS details + publish schedule
- Output: Workflow that publishes content on schedule

---

### FROM gumloop-workflow-designer TO Marketing Skills

When a Gumloop workflow generates output that needs marketing skill processing:

**gumloop-workflow-designer → content-atomizer:**
- Scenario: Workflow collects user-generated content, needs distribution strategy
- Output from Gumloop: Raw content pieces
- Route to content-atomizer: Create platform-specific versions

**gumloop-workflow-designer → keyword-research:**
- Scenario: Workflow collects search queries or customer questions
- Output from Gumloop: List of questions/topics
- Route to keyword-research: Identify SEO opportunities

**gumloop-workflow-designer → email-sequences:**
- Scenario: Workflow segments users by behavior
- Output from Gumloop: User segments and triggers
- Route to email-sequences: Design sequence for each segment

---

### Handoff Protocol

When routing to/from this skill, use this template:

```markdown
## Gumloop Workflow Designer Handoff

**Mode Used:** [ANALYZE / BUILD]

**Input Received:**
- [What was provided to this skill]
- [Relevant context from previous skill]

**Output Generated:**
- [Workflow specification document]
- [Quality assessment if ANALYZE mode]

**Quality Gates Passed:**
- Maintainability: [Strong / Needs Improvement]
- Efficiency: [Strong / Needs Improvement]
- Clarity: [Strong / Needs Improvement]

**Next Steps:**
- [ ] Implement workflow in Gumloop
- [ ] Test with sample data
- [ ] Deploy to production
- [ ] Monitor for first 48 hours

**If routing to another skill:**
- Route to [skill name] for [reason]
- Context to pass: [specific data/decisions]
```

---

## Reference Materials

This skill includes reference documents in the `/references/` directory.

### Available References

1. **workflow-patterns-library.md**
   - 20-30 proven workflow patterns
   - Categories: Data sync, Notifications, Enrichment, Approvals, Batch processing
   - Each pattern includes: Use case, flow diagram, key nodes, considerations, examples

2. **gumloop-integration-catalog.md**
   - 100+ Gumloop integrations
   - Grouped by category (CRM, Email, Analytics, Storage, etc.)
   - Per integration: Use cases, rate limits, auth methods, common fields, example nodes

3. **data-transformation-cookbook.md**
   - 30-40 data manipulation recipes
   - Categories: JSON, Arrays, Strings, Dates, Conditionals, Validation, Merging
   - Each recipe: Use case, input, transform steps, output, Gumloop implementation

4. **optimization-playbook.md**
   - Techniques for optimizing slow/expensive workflows
   - Profiling, API call reduction, parallelization, caching, cost optimization

5. **error-handling-framework.md**
   - Comprehensive error handling strategies
   - Retry logic, graceful degradation, alerting, logging, recovery workflows

6. **node-type-reference.md**
   - Deep dive on each Gumloop node type
   - Capabilities, limitations, best practices, performance characteristics

7. **real-world-examples.md**
   - 10-15 complete workflow specifications
   - Various complexity levels and integration combinations

8. **gumloop-vs-alternatives.md**
   - When to use Gumloop vs Zapier, Make, n8n, etc.
   - Feature comparisons, cost comparisons, migration considerations

**Usage:** Reference these documents when designing workflows for proven patterns and best practices.

---

## Quality Gate

Before considering a workflow specification complete, verify:

### For ANALYZE Mode

**Documentation Completeness:**
- [ ] All nodes are documented with purpose
- [ ] Data flow is traced from input to output
- [ ] Integration points are identified with rate limits
- [ ] Error handling (or lack thereof) is noted

**Quality Assessment:**
- [ ] Maintainability scored with specific examples
- [ ] Efficiency scored with specific examples
- [ ] Clarity scored with specific examples

**Recommendations:**
- [ ] Quick wins identified (low effort, high impact)
- [ ] Structural improvements identified (medium effort)
- [ ] Rethink opportunities identified (high effort, transformative)
- [ ] Recommendations are actionable and specific

---

### For BUILD Mode

**Requirements Clarity:**
- [ ] All 20 intake questions answered
- [ ] Process narrative written in plain English
- [ ] Decision points identified
- [ ] Data transformation map created

**Specification Completeness:**
- [ ] Every node documented with purpose, inputs, outputs, error handling
- [ ] Data flow diagram shows all transformations
- [ ] Integration details include rate limits, auth, field mapping
- [ ] Error handling strategy defined for critical paths
- [ ] Performance expectations documented

**Quality Verification:**
- [ ] Node names follow naming convention
- [ ] No nodes with multiple responsibilities
- [ ] API calls minimized (batching/parallelization considered)
- [ ] Error handling for every integration point
- [ ] Testing checklist provided

---

### For Both Modes

**Implementation Readiness:**
- [ ] Specification is clear enough for someone else to implement
- [ ] Next steps are prioritized and actionable
- [ ] Potential issues and edge cases are documented
- [ ] Success criteria are defined

---

## When This Skill Is Done

You've successfully used this skill when:

**For ANALYZE mode:**
- You understand what the workflow does, how it does it, and where it's weak
- You have a quality assessment with objective scores
- You have a prioritized list of improvements
- You can confidently implement or delegate improvements

**For BUILD mode:**
- You have a complete, implementation-ready workflow specification
- Every node is documented with purpose, data flow, and error handling
- Quality gates (maintainability, efficiency, clarity) are met
- You can hand this spec to someone and they can build it without asking questions

**Next action:** Implement the workflow in Gumloop or route to another skill if additional planning needed.
