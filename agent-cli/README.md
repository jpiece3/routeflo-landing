# AI Agent CLI

A command-line tool for quickly generating production-ready AI agents with Claude. Create agents that automate business workflows, handle customer interactions, and process information intelligently.

## Features

- **10 Agent Templates** - Pre-built templates for common use cases
- **Interactive Wizard** - Step-by-step agent creation
- **Multi-Tool Support** - Web search, CRM, email, Notion, Slack, and more
- **Deploy-Ready** - Generates complete Flask apps ready for Railway, Render, or Heroku
- **Test Mode** - Built-in testing with sample data

## Quick Start

```bash
# Make executable
chmod +x agent-cli.py

# Interactive wizard (recommended for first time)
./agent-cli.py wizard

# Or create directly
./agent-cli.py create --type lead_scorer --name "LeadBot" --business "Your Business"
```

## Available Agent Templates

### 1. Lead Scorer
Automatically scores and qualifies leads based on ICP fit.
```bash
./agent-cli.py create --type lead_scorer --name "LeadBot"
```

### 2. Content Repurposer
Transforms long-form content into Twitter threads, LinkedIn posts, and more.
```bash
./agent-cli.py create --type content_repurposer --name "ContentBot"
```

### 3. Social Media Manager
Creates platform-specific posts, suggests timing, generates hashtags.
```bash
./agent-cli.py create --type social_media_manager --name "SocialBot"
```

### 4. Meeting Scheduler
Finds available times, sends invites, coordinates with attendees.
```bash
./agent-cli.py create --type meeting_scheduler --name "ScheduleBot"
```

### 5. Cold Outreach
Researches prospects and generates personalized outreach emails.
```bash
./agent-cli.py create --type cold_outreach --name "OutreachBot"
```

### 6. Content Researcher
Deep research on topics with structured output to Notion.
```bash
./agent-cli.py create --type content_researcher --name "ResearchBot"
```

### 7. Onboarding
Automates client onboarding with research, scheduling, and setup.
```bash
./agent-cli.py create --type onboarding --name "OnboardBot"
```

### 8. Proposal Writer
Generates custom proposals from discovery notes.
```bash
./agent-cli.py create --type proposal_writer --name "ProposalBot"
```

### 9. Monitor
Watches for specific events and triggers actions.
```bash
./agent-cli.py create --type monitor --name "MonitorBot"
```

### 10. Meeting Notes
Extracts action items and summaries from meeting transcripts.
```bash
./agent-cli.py create --type meeting_notes --name "NotesBot"
```

## Commands

### Create Agent
```bash
./agent-cli.py create \
  --type lead_scorer \
  --name "LeadBot" \
  --business "Vibe Marketing" \
  --target "creative agencies" \
  --voice "friendly, data-driven" \
  --tools "web_search,crm_access" \
  --trigger webhook
```

### Interactive Wizard
```bash
./agent-cli.py wizard
```
Walks you through agent creation step-by-step.

### List Agents
```bash
./agent-cli.py list
```
Shows all created agents with their configurations.

### Test Agent
```bash
./agent-cli.py test --name "LeadBot"
```
Generates test data and shows how to run the agent locally.

### Deploy Help
```bash
./agent-cli.py deploy --name "LeadBot"
```
Shows deployment instructions for Railway, Render, and Heroku.

## Available Tools

Agents can use any combination of these tools:

- **web_search** - Search the web for information
- **crm_access** - Read/write CRM data
- **email_sender** - Send emails
- **calendar** - Schedule meetings
- **notion_db** - Create/update Notion databases
- **slack_notification** - Send Slack messages
- **database_query** - Query SQL databases
- **file_storage** - Upload/download files

Specify tools with `--tools`:
```bash
--tools "web_search,notion_db,slack_notification"
```

## Generated Files

Each agent gets a complete deployment package:

```
agents/your_agent/
├── agent.py              # Main Flask app with agent logic
├── config.json           # Agent configuration
├── requirements.txt      # Python dependencies
├── Procfile             # Railway/Heroku config
├── runtime.txt          # Python version
├── test_data.json       # Sample test data
└── README.md            # Agent-specific documentation
```

## Testing Locally

```bash
# Set API key
export ANTHROPIC_API_KEY='your_key_here'

# Run agent
cd agents/your_agent
python agent.py

# In another terminal, test it
curl -X POST http://localhost:5000/run \
  -H "Content-Type: application/json" \
  -d @test_data.json
```

## Deployment

### Railway (Recommended)

```bash
cd agents/your_agent
railway init
railway up
railway variables set ANTHROPIC_API_KEY=your_key
```

Your agent will be live at: `https://your-agent.railway.app`

### Render

1. Connect GitHub repo
2. Create new Web Service
3. Point to agent directory
4. Add `ANTHROPIC_API_KEY` environment variable

### Heroku

```bash
cd agents/your_agent
heroku create your-agent-name
git push heroku main
heroku config:set ANTHROPIC_API_KEY=your_key
```

## Webhook Integration

Once deployed, trigger your agent via webhook:

```bash
curl -X POST https://your-agent.railway.app/run \
  -H "Content-Type: application/json" \
  -d '{
    "input": "your data here"
  }'
```

### Zapier Integration

1. Create Zapier webhook trigger
2. Add webhook action pointing to your agent
3. Map input data to agent parameters

### Make.com Integration

1. Create HTTP module
2. Set URL to your agent endpoint
3. Configure JSON body with required fields

## Customization

After generation, customize your agent by editing:

1. **agent.py** - Modify the prompt or tool logic
2. **config.json** - Update configuration
3. **Add tools** - Implement real tool logic in `execute_agent()`

## Examples

### Example 1: Lead Scoring Agent
```bash
./agent-cli.py create \
  --type lead_scorer \
  --name "QualifyBot" \
  --business "SaaS Startup" \
  --target "B2B companies with 50-500 employees"
```

Then trigger via webhook with:
```json
{
  "company": "Acme Corp",
  "website": "acme.com",
  "employee_count": 250,
  "industry": "Technology"
}
```

### Example 2: Content Repurposer
```bash
./agent-cli.py create \
  --type content_repurposer \
  --name "RepurposeBot" \
  --business "Content Agency" \
  --voice "witty, engaging, data-driven"
```

Trigger with:
```json
{
  "content": "Long form blog post content here..."
}
```

Gets back:
- Twitter thread
- LinkedIn post
- Instagram caption
- Email snippet

## Requirements

- Python 3.11+
- Anthropic API key
- Flask (installed automatically)

## Environment Variables

Required:
- `ANTHROPIC_API_KEY` - Your Claude API key

Optional:
- `PORT` - Port to run on (default: 5000)

## Troubleshooting

### Agent not creating
- Check that agent name doesn't conflict with existing agent
- Ensure you have write permissions in the directory

### Agent failing to run
- Verify `ANTHROPIC_API_KEY` is set
- Check that all dependencies are installed: `pip install -r requirements.txt`

### Tool calls failing
- Tool responses are currently mocked - implement real logic in `execute_agent()`
- Add error handling for your specific tools

## Roadmap

- [ ] Real tool implementations (not just mocks)
- [ ] Agent monitoring dashboard
- [ ] Automatic testing suite
- [ ] Multi-agent orchestration
- [ ] Built-in vector database support
- [ ] Agent marketplace

## Contributing

Ideas for new agent templates? Open an issue!

## License

MIT License - use freely for commercial projects.

## Support

Questions? Check out:
- [Anthropic Documentation](https://docs.anthropic.com)
- [Claude API Reference](https://docs.anthropic.com/claude/reference/)
