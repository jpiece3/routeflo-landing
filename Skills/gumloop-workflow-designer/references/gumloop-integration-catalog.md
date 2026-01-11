# Gumloop Integration Catalog

Comprehensive reference for 100+ Gumloop integrations, organized by category. Use this catalog to understand which systems you can connect, their capabilities, and common use cases.

---

## How to Use This Catalog

1. **Find your integration** in the categories below
2. **Review capabilities** to understand what data you can read/write
3. **Check rate limits** to plan your workflow design
4. **Reference common fields** when designing data transformations
5. **See use cases** for inspiration on what to build

---

## Google Workspace

### Gmail

**Category:** Email

**Capabilities:**
- Send emails with attachments
- Search and read emails
- Create drafts
- Add labels and filters
- Mark as read/unread/spam

**Common Use Cases:**
- Automated email responses
- Email parsing and data extraction
- Lead capture from inbound emails
- Alert notifications via email
- Newsletter automation

**Rate Limits:**
- Send: 500 emails/day (Gmail free), 2,000/day (Workspace)
- Read: Subject to Gmail API quota (1 billion quota units/day)

**Authentication:** OAuth 2.0

**Common Fields:**
```
Send Email:
  to: "recipient@example.com"
  subject: "Email subject"
  body_html: "<p>HTML content</p>"
  attachments: [file URLs or base64]

Read Email:
  from: "sender@example.com"
  subject: "Subject line"
  body: "Plain text body"
  received_date: "2025-01-02T10:00:00Z"
```

**Gotchas:**
- Daily send limits are strict
- Attachments must be < 25MB
- HTML emails may render differently across clients

---

### Google Sheets

**Category:** Database / Spreadsheet

**Capabilities:**
- Read data from sheets (rows, columns, ranges)
- Write/update data to sheets
- Create new sheets
- Append rows
- Batch operations

**Common Use Cases:**
- Use spreadsheet as database
- Export workflow results to sheet
- Data sync between systems via spreadsheet
- Team-friendly reporting dashboards
- Collect form responses

**Rate Limits:**
- Read/write: 100 requests per 100 seconds per user
- 10 million cells maximum per spreadsheet

**Authentication:** OAuth 2.0

**Common Fields:**
```
Read Range:
  spreadsheet_id: "abc123..."
  range: "Sheet1!A1:D10"
  → Returns: [[row1], [row2], ...]

Append Row:
  spreadsheet_id: "abc123..."
  range: "Sheet1!A:D"
  values: [["value1", "value2", "value3", "value4"]]
```

**Gotchas:**
- A1 notation can be tricky (Sheet1!A:A vs Sheet1!A1:A1000)
- Formulas are preserved when reading, not calculated values (use valueRenderOption)
- Large sheets (>1M cells) can be slow to process

---

### Google Drive

**Category:** Storage

**Capabilities:**
- Upload files
- Download files
- List files and folders
- Share/permission management
- Search for files

**Common Use Cases:**
- Store workflow outputs (PDFs, CSVs, images)
- Backup data to cloud storage
- Share files automatically with team
- Organize documents programmatically

**Rate Limits:**
- 1,000 requests per 100 seconds per user
- 10,000 requests per 100 seconds (overall)

**Authentication:** OAuth 2.0

**Common Fields:**
```
Upload File:
  file_name: "report.pdf"
  file_content: [base64 or URL]
  folder_id: "folder123..." (optional)

List Files:
  folder_id: "folder123..."
  query: "name contains 'report' and modifiedTime > '2025-01-01'"
  → Returns: [{id, name, mimeType, createdTime}, ...]
```

**Gotchas:**
- File IDs are permanent even if file is renamed
- Shared drives have different permissions than "My Drive"
- Large file uploads (>5MB) require resumable uploads

---

### Google Calendar

**Category:** Scheduling

**Capabilities:**
- Create events
- Update/delete events
- List events by date range
- Add attendees and send invitations
- Set reminders

**Common Use Cases:**
- Auto-schedule meetings from forms
- Send calendar invites automatically
- Sync events between systems
- Create recurring events from workflows

**Rate Limits:**
- 1,000,000 queries per day
- 50 requests per second

**Authentication:** OAuth 2.0

**Common Fields:**
```
Create Event:
  summary: "Meeting Title"
  start: {dateTime: "2025-01-02T14:00:00-05:00", timeZone: "America/New_York"}
  end: {dateTime: "2025-01-02T15:00:00-05:00", timeZone: "America/New_York"}
  attendees: [{email: "person@example.com"}]
  description: "Meeting agenda..."
```

**Gotchas:**
- Timezone handling is critical (always specify timeZone)
- Recurring events require RRULE syntax (complex)
- Free/busy queries have separate API endpoints

---

## CRM & Sales

### HubSpot

**Category:** CRM

**Capabilities:**
- Create/update/search contacts
- Manage companies
- Create deals in pipeline
- Log activities and engagements
- Custom properties

**Common Use Cases:**
- Sync leads from forms to HubSpot
- Enrich contacts with external data
- Automate deal creation from qualified leads
- Log customer interactions
- Segment contacts by behavior

**Rate Limits:**
- Free/Starter: 100 requests per 10 seconds
- Professional: 120 requests per 10 seconds
- Enterprise: 200 requests per 10 seconds
- Batch operations: 100 records per request

**Authentication:** API Key or OAuth 2.0

**Common Fields:**
```
Create Contact:
  {
    "properties": {
      "email": "john@example.com",
      "firstname": "John",
      "lastname": "Doe",
      "company": "Acme Corp",
      "phone": "+1-555-0100"
    }
  }

Create Deal:
  {
    "properties": {
      "dealname": "Acme Corp - Annual Plan",
      "amount": "10000",
      "dealstage": "qualifiedtobuy",
      "pipeline": "default"
    },
    "associations": {
      "contacts": [contact_id]
    }
  }
```

**Gotchas:**
- Custom properties must be created in HubSpot first
- Deal stages are pipeline-specific
- Contact merging can cause ID changes
- API calls consume from shared rate limit pool

---

### Salesforce

**Category:** CRM

**Capabilities:**
- Create/update/query Leads, Contacts, Accounts, Opportunities
- SOQL queries for complex filtering
- Custom objects and fields
- Bulk API for large operations

**Common Use Cases:**
- Sync contacts between Salesforce and other CRMs
- Create opportunities from qualified leads
- Update records from external data sources
- Generate reports from Salesforce data

**Rate Limits:**
- API calls: 15,000 per 24 hours (varies by license)
- Bulk API: 10,000 batches per 24 hours
- 200 concurrent API requests

**Authentication:** OAuth 2.0

**Common Fields:**
```
Create Lead:
  {
    "FirstName": "John",
    "LastName": "Doe",
    "Company": "Acme Corp",
    "Email": "john@example.com",
    "Status": "New"
  }

SOQL Query:
  SELECT Id, Name, Email FROM Contact WHERE Company = 'Acme Corp' AND CreatedDate > 2025-01-01
```

**Gotchas:**
- Field API names differ from labels (FirstName vs First Name)
- SOQL has query limits (20,000 rows max)
- Sandbox vs Production have different API endpoints
- API version matters (v60.0 vs v59.0 have different fields)

---

## Team Communication

### Slack

**Category:** Communication

**Capabilities:**
- Send messages to channels or DMs
- Upload files
- Update messages
- Add reactions
- Post to Canvas
- Interactive buttons and blocks

**Common Use Cases:**
- Alert team of important events
- Send daily/weekly reports
- Create interactive approval workflows
- Log errors or system events
- Notify sales of high-value leads

**Rate Limits:**
- 1 message per second per channel
- File uploads: 20 per minute
- API calls: Tier-based (varies by workspace size)

**Authentication:** OAuth 2.0 or Bot Token

**Common Fields:**
```
Send Message:
  {
    "channel": "#general" or "U12345678",
    "text": "Message text",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Bold* and _italic_ text"
        }
      }
    ]
  }
```

**Gotchas:**
- Channel names need # prefix, DMs use user IDs
- Block Kit JSON can be complex
- Messages > 4000 chars are truncated
- Thread replies require thread_ts parameter

---

### Discord

**Category:** Communication

**Capabilities:**
- Send messages to channels
- Create/manage threads
- Add reactions
- Manage roles and permissions

**Common Use Cases:**
- Community notifications
- Game/bot integrations
- Alert communities of events
- Auto-moderation workflows

**Rate Limits:**
- 5 requests per 5 seconds per channel
- 50 requests per second globally

**Authentication:** Bot Token

**Common Fields:**
```
Send Message:
  {
    "content": "Message text",
    "embed": {
      "title": "Embed Title",
      "description": "Embed description",
      "color": 3447003
    }
  }
```

**Gotchas:**
- Channel IDs are long numbers (not names)
- Embeds have specific structure requirements
- Rate limits are per-route (channel, guild, user)

---

## Project Management

### Notion

**Category:** Database / Knowledge Base

**Capabilities:**
- Create/update/query database items
- Read page content
- Create new pages
- Update properties
- Search across workspace

**Common Use Cases:**
- Use Notion databases as workflow storage
- Auto-create tasks from forms
- Generate reports in Notion
- Sync data between Notion and other tools
- Create meeting notes automatically

**Rate Limits:**
- 3 requests per second per integration
- 1,000 requests per hour (soft limit)

**Authentication:** OAuth 2.0 or Internal Integration Token

**Common Fields:**
```
Create Database Item:
  {
    "parent": {"database_id": "abc123..."},
    "properties": {
      "Name": {
        "title": [{"text": {"content": "Task Name"}}]
      },
      "Status": {
        "select": {"name": "In Progress"}
      },
      "Due Date": {
        "date": {"start": "2025-01-15"}
      }
    }
  }

Query Database:
  {
    "filter": {
      "property": "Status",
      "select": {"equals": "In Progress"}
    },
    "sorts": [
      {"property": "Due Date", "direction": "ascending"}
    ]
  }
```

**Gotchas:**
- Property types (title vs text vs rich_text) are specific
- Database schemas must exist before adding properties
- Page content is in block format (complex structure)
- Search is workspace-wide (can be slow)

---

### Jira

**Category:** Project Management

**Capabilities:**
- Create/update issues
- Transition issue status
- Add comments
- Search with JQL
- Manage sprints and boards

**Common Use Cases:**
- Create tickets from support requests
- Auto-update issue status from deploys
- Generate reports from Jira data
- Sync bugs from error monitoring
- Create sprint reports

**Rate Limits:**
- Cloud: 10,000 requests per hour per app
- Self-hosted: Varies by configuration

**Authentication:** OAuth 2.0 or API Token

**Common Fields:**
```
Create Issue:
  {
    "fields": {
      "project": {"key": "PROJ"},
      "summary": "Issue summary",
      "description": "Detailed description",
      "issuetype": {"name": "Bug"},
      "priority": {"name": "High"}
    }
  }

JQL Search:
  project = PROJ AND status = "In Progress" AND assignee = currentUser()
```

**Gotchas:**
- Issue keys are unique per project (PROJ-123)
- Custom fields have IDs like customfield_10001
- Workflow transitions vary by project config
- JQL syntax is powerful but complex

---

### Linear

**Category:** Project Management

**Capabilities:**
- Create/update issues
- Manage projects and milestones
- Add comments
- Search and filter
- Update status/priority

**Common Use Cases:**
- Create issues from bug reports
- Sync issues across tools
- Generate development reports
- Auto-assign issues based on criteria

**Rate Limits:**
- 1,000 requests per hour per user
- Mutation limit: 50 per hour (creates/updates)

**Authentication:** OAuth 2.0 or API Key

**Common Fields:**
```
Create Issue (GraphQL):
  mutation {
    issueCreate(input: {
      title: "Issue title",
      description: "Issue description",
      teamId: "team_id",
      priority: 1,
      assigneeId: "user_id"
    }) {
      success
      issue {
        id
        identifier
      }
    }
  }
```

**Gotchas:**
- Uses GraphQL (not REST like others)
- Team IDs required for most operations
- Priority is numeric (0=None, 1=Urgent, 2=High, 3=Medium, 4=Low)

---

## Data & Analytics

### Airtable

**Category:** Database / Spreadsheet

**Capabilities:**
- Create/read/update records
- List bases and tables
- Attach files to records
- Filter and sort
- Linked records (relationships)

**Common Use Cases:**
- Use as flexible database
- Sync data between systems via Airtable
- Store workflow results
- Manage content calendars
- Track projects and tasks

**Rate Limits:**
- 5 requests per second per base
- 100,000 records per base (varies by plan)

**Authentication:** API Key or OAuth 2.0

**Common Fields:**
```
Create Record:
  {
    "fields": {
      "Name": "Record name",
      "Status": "In Progress",
      "Tags": ["tag1", "tag2"],
      "Related Records": ["recABC123"]
    }
  }

List Records:
  filterByFormula: "AND({Status} = 'Active', {Created} > '2025-01-01')"
  sort: [{field: "Created", direction: "desc"}]
  maxRecords: 100
```

**Gotchas:**
- Field names are case-sensitive
- Linked records require record IDs (recXXX)
- Attachment fields require file URLs
- Formula fields are read-only

---

### Snowflake

**Category:** Data Warehouse

**Capabilities:**
- Execute SQL queries
- Insert/update data
- Create tables
- Data transformations
- Load data from files

**Common Use Cases:**
- Query large datasets
- Store workflow results in data warehouse
- Generate analytics reports
- ETL pipelines
- Data aggregation

**Rate Limits:**
- Depends on warehouse size and configuration
- Query timeout: 3600 seconds default

**Authentication:** Username/Password or Key Pair

**Common Fields:**
```
Query:
  SELECT customer_id, SUM(amount) as total_revenue
  FROM sales
  WHERE date >= '2025-01-01'
  GROUP BY customer_id
  ORDER BY total_revenue DESC
  LIMIT 100

Insert:
  INSERT INTO customers (id, name, email, created_at)
  VALUES (123, 'John Doe', 'john@example.com', '2025-01-02')
```

**Gotchas:**
- Case sensitivity in table/column names
- Different SQL dialect than MySQL/PostgreSQL
- Query costs depend on warehouse size (larger = faster but more $)
- Semi-structured data (JSON) has specific syntax

---

## Social Media

### LinkedIn

**Category:** Social Media

**Capabilities:**
- Post updates (text, images, links)
- Scrape profile data
- Company page posting
- Schedule posts

**Common Use Cases:**
- Auto-post blog content to LinkedIn
- Share company updates
- Personal brand automation
- Lead generation from profile data

**Rate Limits:**
- Posting: 150 posts per day per person
- Profile API: Throttled by LinkedIn (undocumented)

**Authentication:** OAuth 2.0

**Common Fields:**
```
Create Post:
  {
    "author": "urn:li:person:abc123",
    "lifecycleState": "PUBLISHED",
    "specificContent": {
      "com.linkedin.ugc.ShareContent": {
        "shareCommentary": {
          "text": "Post content here"
        },
        "shareMediaCategory": "ARTICLE",
        "media": [{
          "status": "READY",
          "originalUrl": "https://example.com/article"
        }]
      }
    }
  }
```

**Gotchas:**
- Person URN format is specific (urn:li:person:abc123)
- Images must be uploaded first, then referenced
- Text-only posts vs link posts have different structures
- Company page posting requires separate permissions

---

### X (Twitter)

**Category:** Social Media

**Capabilities:**
- Post tweets (text, images, videos)
- Create threads
- Scrape tweets and profiles
- Search tweets
- Like/retweet

**Common Use Cases:**
- Auto-tweet blog posts
- Create scheduled tweet threads
- Monitor brand mentions
- Auto-respond to specific keywords
- Backup tweets

**Rate Limits:**
- Free tier: 1,500 tweets per month (read)
- Basic tier: 3,000 tweets per month, 50 posts per day
- Pro tier: Higher limits

**Authentication:** OAuth 2.0 or Bearer Token

**Common Fields:**
```
Create Tweet:
  {
    "text": "Tweet content (280 chars max)",
    "media": {
      "media_ids": ["123456789"]
    }
  }

Search Tweets:
  query: "from:username OR #hashtag -is:retweet"
  max_results: 100
```

**Gotchas:**
- 280 character limit strictly enforced
- Media must be uploaded separately first
- Thread replies require reply_to_tweet_id
- API v2 has different endpoints than v1.1

---

## Email & Marketing

### Mailgun

**Category:** Email Service Provider

**Capabilities:**
- Send transactional emails
- Track opens and clicks
- Validate email addresses
- Manage mailing lists
- Webhooks for events

**Common Use Cases:**
- Send automated emails at scale
- Transactional emails (receipts, notifications)
- Email verification
- Drip campaigns
- Bounce handling

**Rate Limits:**
- Free tier: 5,000 emails per month
- Paid plans: 100,000+ emails per month
- 1,000 emails per hour (varies by plan)

**Authentication:** API Key

**Common Fields:**
```
Send Email:
  {
    "from": "noreply@company.com",
    "to": "recipient@example.com",
    "subject": "Email subject",
    "html": "<p>HTML content</p>",
    "text": "Plain text fallback",
    "o:tracking": "yes",
    "o:tracking-clicks": "yes"
  }
```

**Gotchas:**
- Domain must be verified before sending
- SPF/DKIM records required for deliverability
- Free tier has Mailgun branding
- Bounce/complaint webhooks strongly recommended

---

## Developer Tools

### GitHub

**Category:** Version Control / Development

**Capabilities:**
- Create/update pull requests
- Manage issues
- Trigger workflows
- Access repository files
- Manage releases

**Common Use Cases:**
- Auto-create PRs from automation
- Sync issues with project management tools
- Deploy on merge workflows
- Release automation
- Code review automation

**Rate Limits:**
- Authenticated: 5,000 requests per hour
- Search API: 30 requests per minute
- Secondary rate limits for mutations

**Authentication:** Personal Access Token or OAuth App

**Common Fields:**
```
Create Pull Request:
  {
    "title": "PR title",
    "head": "feature-branch",
    "base": "main",
    "body": "PR description",
    "draft": false
  }

Create Issue:
  {
    "title": "Issue title",
    "body": "Issue description",
    "labels": ["bug", "priority-high"],
    "assignees": ["username"]
  }
```

**Gotchas:**
- Branch names can't have spaces or special chars
- PR requires head and base branches to exist
- Large files (>100MB) need Git LFS
- API v4 is GraphQL (different from REST v3)

---

## Storage & Files

### Amazon S3

**Category:** Object Storage

**Capabilities:**
- Upload files
- Download files
- List objects
- Set permissions (public/private)
- Generate presigned URLs

**Common Use Cases:**
- Store workflow outputs (images, PDFs, CSVs)
- Backup data
- Host static files
- Store user uploads
- Archive data

**Rate Limits:**
- 3,500 PUT/COPY/POST/DELETE per second
- 5,500 GET/HEAD per second per prefix
- No overall account limit

**Authentication:** AWS Access Key + Secret Key

**Common Fields:**
```
Upload Object:
  {
    "bucket": "my-bucket",
    "key": "path/to/file.pdf",
    "body": [file content or buffer],
    "contentType": "application/pdf",
    "ACL": "public-read" or "private"
  }

Generate Presigned URL:
  {
    "bucket": "my-bucket",
    "key": "path/to/file.pdf",
    "expires": 3600 (seconds)
  }
```

**Gotchas:**
- Bucket names are globally unique
- Keys (file paths) can contain slashes but aren't real folders
- Public files need both bucket policy AND object ACL
- Cross-region transfers can be slow/expensive

---

## Support & Help Desk

### Zendesk

**Category:** Customer Support

**Capabilities:**
- Create/update tickets
- Add comments
- Manage users
- Search tickets
- Set ticket status/priority
- Add tags

**Common Use Cases:**
- Auto-create tickets from forms
- Sync support tickets with CRM
- Escalate tickets to Slack
- SLA monitoring and alerts
- Generate support reports

**Rate Limits:**
- 400 requests per minute per account
- 200 requests per minute per user

**Authentication:** API Token or OAuth 2.0

**Common Fields:**
```
Create Ticket:
  {
    "ticket": {
      "subject": "Ticket subject",
      "comment": {
        "body": "Ticket description"
      },
      "requester": {
        "name": "Customer Name",
        "email": "customer@example.com"
      },
      "priority": "high",
      "status": "open",
      "tags": ["bug", "api"]
    }
  }
```

**Gotchas:**
- Requester must have email (creates user if doesn't exist)
- Private comments need "public": false
- Tags are lowercase and can't have spaces
- Status changes trigger automations/notifications

---

## Analytics & SEO

### Semrush

**Category:** SEO / Marketing

**Capabilities:**
- Domain analytics
- Keyword research
- Backlink analysis
- Position tracking
- Site audit data

**Common Use Cases:**
- Automated SEO reporting
- Competitor keyword tracking
- Backlink monitoring
- Content gap analysis
- Rank tracking

**Rate Limits:**
- Varies by subscription plan
- Typical: 3,000-40,000 API units per day

**Authentication:** API Key

**Common Fields:**
```
Domain Overview:
  domain: "example.com"
  → Returns: organic_keywords, organic_traffic, organic_cost, adwords_keywords

Keyword Difficulty:
  phrase: "best CRM software"
  → Returns: difficulty_score (0-100), search_volume
```

**Gotchas:**
- API units consumed varies by request type
- Historical data limited by plan
- Results cached (not real-time)
- Regional databases (US, UK, etc.) are separate

---

## Content Management

### WordPress

**Category:** CMS / Blog

**Capabilities:**
- Create/update posts
- Manage pages
- Upload media
- Manage categories/tags
- Custom post types

**Common Use Cases:**
- Auto-publish blog posts
- Sync content from Notion to WordPress
- Bulk import content
- Update posts programmatically
- Generate dynamic content

**Rate Limits:**
- Self-hosted: Unlimited (server dependent)
- WordPress.com: Varies by plan

**Authentication:** Application Passwords or OAuth 2.0

**Common Fields:**
```
Create Post:
  {
    "title": "Post Title",
    "content": "<p>HTML content</p>",
    "status": "publish" or "draft",
    "categories": [1, 5],
    "tags": [10, 15],
    "featured_media": media_id,
    "meta": {
      "custom_field": "value"
    }
  }
```

**Gotchas:**
- Featured images require separate media upload first
- Custom fields must be registered in theme/plugin
- Post slugs auto-generated from title (or specify manually)
- Publish immediately vs schedule (use "date" field)

---

## Forms & Surveys

### Typeform

**Category:** Forms / Surveys

**Capabilities:**
- Fetch form responses
- Get form structure
- Create webhooks for new responses
- List forms

**Common Use Cases:**
- Process form submissions in workflows
- Sync responses to CRM
- Send custom follow-ups based on answers
- Generate reports from survey data
- Trigger workflows on form completion

**Rate Limits:**
- Free: 10 responses per month
- Paid: Unlimited responses
- API: 60 requests per minute

**Authentication:** Personal Access Token or OAuth 2.0

**Common Fields:**
```
Get Responses:
  form_id: "abc123"
  completed: true
  → Returns: [{
    response_id: "xyz789",
    submitted_at: "2025-01-02T10:00:00Z",
    answers: [
      {
        field: {id: "field1", type: "short_text"},
        text: "Answer text"
      }
    ]
  }]
```

**Gotchas:**
- Webhook signature verification recommended
- Hidden fields available for tracking source
- File uploads return URLs (need separate download)
- Logic jumps affect which fields appear in responses

---

## Video & Media

### YouTube

**Category:** Video Platform

**Capabilities:**
- Upload videos
- Update video metadata
- List channel videos
- Get video analytics
- Manage playlists

**Common Use Cases:**
- Auto-upload video content
- Update video descriptions with links
- Schedule video publishing
- Generate video performance reports
- Create playlists automatically

**Rate Limits:**
- 10,000 quota units per day
- Video upload: 6 uploads per day (default)
- Complex operations consume more units

**Authentication:** OAuth 2.0

**Common Fields:**
```
Upload Video:
  {
    "snippet": {
      "title": "Video Title",
      "description": "Video description",
      "tags": ["tag1", "tag2"],
      "categoryId": "22"
    },
    "status": {
      "privacyStatus": "public" or "unlisted" or "private"
    }
  }
```

**Gotchas:**
- Video processing takes time (not instant)
- Upload limits strict for new channels
- Quota refreshes at midnight Pacific Time
- Video file size limit: 256GB or 12 hours

---

This integration catalog provides a foundation for understanding what's possible with Gumloop. For the most current integration list and detailed API documentation, always reference the official Gumloop and provider documentation.

**Notes:**
- Rate limits are approximate and may change
- Always test integrations in development before production
- Authentication methods vary (OAuth preferred for security)
- Most integrations support both read and write operations
- Error handling is critical (APIs fail, network issues happen)

For integration-specific questions or advanced use cases, consult the provider's API documentation directly.
