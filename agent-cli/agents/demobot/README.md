# DemoBot

**Type:** content_repurposer
**Description:** Repurposes long-form content into multiple formats

## Configuration
- Business: Vibe Marketing
- Target Customer: small service businesses
- Trigger: webhook
- Tools: web_search

## Deploy to Railway
1. Create new GitHub repo
2. Push this directory
3. Deploy to Railway
4. Add ANTHROPIC_API_KEY env variable

## Test Locally
```bash
export ANTHROPIC_API_KEY='your_key'
python agent.py
```

## Webhook URL
After deployment: `https://your-app.railway.app/run`

## Example Request
```bash
curl -X POST https://your-app.railway.app/run \
  -H "Content-Type: application/json" \
  -d '{"input": "test"}'
```


## SDK Version (agent_sdk.py)

This agent now has an SDK version that uses the Anthropic Agent SDK for automatic agentic loops.

### Running SDK Version
```bash
export ANTHROPIC_API_KEY='your_key'
python agent_sdk.py
```

### Benefits of SDK Version
- Automatic agentic loop handling
- Cleaner tool integration
- Better error handling
- Same webhook compatibility

### Switching Between Versions
- Original: `python agent.py`
- SDK: `python agent_sdk.py`

Both versions work with the same webhook endpoint and return compatible JSON.
