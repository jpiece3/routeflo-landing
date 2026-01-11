# Workflow Patterns Library

Pre-built patterns for common Gumloop automation scenarios. Each pattern is proven, adaptable, and includes implementation guidance.

---

## How to Use This Library

1. **Find your scenario** in the categories below
2. **Copy the flow diagram** and adapt node names to your use case
3. **Reference the considerations** to avoid common pitfalls
4. **Implement in Gumloop** following the node structure

**Categories:**
- Data Sync & Integration
- Notifications & Alerts
- Data Enrichment
- Approval Workflows
- Batch Processing & Reports
- Content Automation
- Lead Management
- E-commerce & Orders
- Customer Support
- Webhooks & APIs

---

## Data Sync & Integration

### Pattern 1: Bi-Directional CRM Sync

**Use Case:** Keep HubSpot and Salesforce contacts in sync (or any two CRMs)

**When to Use:**
- Sales team uses Salesforce, marketing uses HubSpot
- Need single source of truth across both systems
- Avoid manual duplicate entry

**Flow Diagram:**
```
TRIGGER: Webhook from System A (contact created/updated)
  ↓
[extract_contact_data_from_webhook]
  ↓
[check_if_contact_exists_in_system_b]
  ├─→ EXISTS:
  │   [fetch_existing_record_from_system_b]
  │   [compare_timestamps_to_determine_newer_data]
  │   [update_system_b_if_system_a_is_newer]
  └─→ NOT_EXISTS:
      [create_new_contact_in_system_b]
  ↓
[log_sync_result_to_tracking_database]
[set_sync_flag_to_prevent_loop]
```

**Key Nodes:**
1. **Webhook trigger:** Capture create/update events from System A
2. **Deduplication check:** Search System B by email or unique ID
3. **Timestamp comparison:** Avoid overwriting newer data with older
4. **Sync flag:** Mark record as "synced_from_A" to prevent infinite loop
5. **Error logging:** Track failures for manual review

**Considerations:**
- **Infinite loop prevention:** Add custom field "last_synced_from" to track source
- **Field mapping:** Create explicit mapping document (email → email__c, etc.)
- **Conflict resolution:** If both changed since last sync, which wins? (newest timestamp? System A always? Manual review?)
- **Delete handling:** When record deleted in one system, delete or archive in other?

**Example:**
```
HubSpot contact updated → Webhook to Gumloop
  ↓
Extract: email, firstname, lastname, company, phone
  ↓
Search Salesforce by email
  ├─→ Found:
  │   Compare modified_date fields
  │   HubSpot newer? → Update Salesforce
  │   Salesforce newer? → Skip (or update HubSpot instead)
  └─→ Not found:
      Create Salesforce lead
      Map fields: firstname → FirstName, company → Company
  ↓
Add note: "Synced from HubSpot at {timestamp}"
```

---

### Pattern 2: Database to Spreadsheet Sync

**Use Case:** Keep Google Sheets or Airtable synced with database changes

**When to Use:**
- Non-technical team needs visibility into database
- Reporting dashboards pull from spreadsheet
- Backup of critical data in accessible format

**Flow Diagram:**
```
TRIGGER: Schedule (every hour) OR Database webhook
  ↓
[fetch_new_or_updated_records_since_last_sync]
  ↓
[transform_data_to_spreadsheet_format]
  ↓
[check_if_row_exists_in_spreadsheet]
  ├─→ EXISTS: [update_existing_row]
  └─→ NOT_EXISTS: [append_new_row]
  ↓
[update_last_sync_timestamp]
```

**Key Nodes:**
1. **Incremental fetch:** Only get records modified since last sync (timestamp filter)
2. **Data transformation:** Format dates, booleans, nulls for spreadsheet
3. **Row matching:** Find row by unique ID or email
4. **Batch operations:** Update/append in batches of 100 for efficiency

**Considerations:**
- **Timestamp tracking:** Store "last_sync_at" to avoid re-processing all records
- **Spreadsheet limits:** Google Sheets max 10M cells, Airtable max 50k records
- **Formula preservation:** Don't overwrite spreadsheet formulas with static values
- **Rate limits:** Google Sheets API: 100 requests/100 seconds/user

**Example:**
```
Schedule: Every hour
  ↓
Fetch from PostgreSQL:
  SELECT * FROM contacts WHERE updated_at > {last_sync_timestamp}
  ↓
Transform:
  created_at: "2025-01-02T10:00:00Z" → "01/02/2025 10:00 AM"
  is_active: true → "Yes"
  ↓
For each record:
  Search Google Sheet for row where Column A = contact_id
  ├─→ Found: Update row
  └─→ Not found: Append new row
  ↓
Update tracking: last_sync_timestamp = now()
```

---

### Pattern 3: Multi-System Data Aggregation

**Use Case:** Combine data from multiple sources into one unified view

**When to Use:**
- Customer data scattered across Stripe, HubSpot, Intercom, etc.
- Need 360° view of customer
- Building data warehouse or analytics database

**Flow Diagram:**
```
TRIGGER: Customer ID provided OR Schedule (nightly batch)
  ↓
[fetch_customer_from_crm] ─┐
[fetch_subscription_from_stripe] ─┤
[fetch_support_tickets_from_zendesk] ─┤ (parallel)
[fetch_product_usage_from_analytics] ─┘
  ↓
[merge_all_data_sources_by_customer_id]
  ↓
[calculate_derived_metrics]
  ↓
[store_unified_profile_in_database_or_notion]
```

**Key Nodes:**
1. **Parallel fetches:** All API calls run simultaneously (faster)
2. **Data merging:** Combine by common key (customer_id, email)
3. **Conflict resolution:** If data conflicts, which source is truth?
4. **Derived metrics:** Calculate LTV, health score, etc.

**Considerations:**
- **Parallel execution:** Independent fetches should run simultaneously
- **Partial success:** If one API fails, still process others
- **Data staleness:** Some sources update hourly, others real-time
- **Cost:** Each API call costs time/money, optimize frequency

**Example:**
```
Trigger: Customer "cust_12345" viewed
  ↓
Parallel fetch (all run simultaneously):
  - HubSpot: Get contact details (name, email, company)
  - Stripe: Get subscription status (plan, MRR, next_bill_date)
  - Zendesk: Get recent tickets (count, status, satisfaction)
  - Mixpanel: Get usage metrics (logins_last_30d, feature_usage)
  ↓
Merge:
  {
    "customer_id": "cust_12345",
    "name": "John Doe" (from HubSpot),
    "subscription": {...} (from Stripe),
    "tickets": [...] (from Zendesk),
    "usage": {...} (from Mixpanel)
  }
  ↓
Calculate:
  - health_score = usage_score * 0.4 + satisfaction_score * 0.3 + payment_score * 0.3
  - churn_risk = "high" if health_score < 50
  ↓
Store in Notion "Customers" database
```

---

## Notifications & Alerts

### Pattern 4: Priority-Based Alerting

**Use Case:** Route alerts to different channels based on urgency/importance

**When to Use:**
- High-value events need immediate attention
- Standard events can wait for daily digest
- Avoid alert fatigue from too many notifications

**Flow Diagram:**
```
TRIGGER: Event occurs (form submission, error, threshold breach)
  ↓
[fetch_event_context_and_metadata]
  ↓
[enrich_with_additional_data_if_needed]
  ↓
[calculate_priority_score]
  ├─→ CRITICAL (score > 80):
  │   [send_to_pagerduty_or_oncall]
  │   [send_to_slack_with_mention]
  │   [send_sms_to_manager]
  │   [create_jira_p0_ticket]
  ├─→ HIGH (score 50-80):
  │   [send_to_slack_channel]
  │   [create_jira_p1_ticket]
  └─→ NORMAL (score < 50):
      [add_to_daily_digest_queue]
  ↓
[log_alert_to_tracking_system]
```

**Key Nodes:**
1. **Priority scoring:** Calculate based on multiple factors
2. **Channel routing:** Different urgency = different destinations
3. **Escalation:** If not acknowledged in X minutes, escalate
4. **Digest batching:** Collect low-priority alerts for daily summary

**Considerations:**
- **Scoring logic:** Define clear criteria (customer tier, $ amount, error type)
- **Alert fatigue:** Too many criticals = team ignores them
- **Acknowledgment:** Track who responded and when
- **Quiet hours:** Don't SMS at 3 AM for non-critical issues

**Example:**
```
Trigger: New lead form submission
  ↓
Fetch context:
  - Lead email, company, message
  ↓
Enrich with Clearbit:
  - company_size, industry, revenue
  ↓
Calculate priority:
  score = 0
  if company_size > 1000: score += 40
  if revenue > $100M: score += 30
  if industry in [target_industries]: score += 20
  if form contains "urgent": score += 10
  ↓
Route based on score:
  - score > 80 (Enterprise + urgent):
      Send to #sales-vip with @channel mention
      SMS to VP Sales: "Enterprise lead: {company}"
      Create Salesforce opp with Priority = P0
  - score 50-80 (Large company):
      Send to #sales-leads
      Create Salesforce lead
  - score < 50 (SMB):
      Add to nurture sequence
```

---

### Pattern 5: Anomaly Detection & Alerting

**Use Case:** Detect unusual patterns and alert team

**When to Use:**
- Monitor for sudden traffic spikes/drops
- Detect payment failures or churn signals
- Identify suspicious activity

**Flow Diagram:**
```
TRIGGER: Schedule (every 15 minutes)
  ↓
[fetch_current_metric_value]
  ↓
[fetch_historical_baseline_same_time_period]
  ↓
[calculate_deviation_from_baseline]
  ↓
[check_if_deviation_exceeds_threshold]
  ├─→ YES (anomaly detected):
  │   [format_alert_with_context_and_chart]
  │   [send_to_monitoring_channel]
  │   [create_incident_in_tracking_system]
  └─→ NO (within normal range):
      [log_metric_for_future_baseline]
```

**Key Nodes:**
1. **Baseline calculation:** Average of last 7 days, same hour
2. **Standard deviation:** Detect how far from normal
3. **Threshold check:** Alert if > 2 standard deviations
4. **Context enrichment:** Include chart, recent changes

**Considerations:**
- **Seasonality:** Monday traffic ≠ Saturday traffic (compare same day of week)
- **False positives:** Too sensitive = alert fatigue
- **Multiple metrics:** Monitor together (traffic + conversions, not just one)
- **Root cause hints:** Include recent deployments, marketing campaigns

**Example:**
```
Schedule: Every 15 minutes
  ↓
Fetch current signups (last 15 min):
  count = 5
  ↓
Fetch baseline (last 4 weeks, same 15-min window):
  avg = 45, std_dev = 8
  ↓
Calculate deviation:
  deviation = (current - avg) / std_dev
  = (5 - 45) / 8 = -5 (5 standard deviations below normal!)
  ↓
Anomaly detected (deviation < -2):
  Alert: "⚠️ Signups 89% below normal!"
  Context:
    - Current: 5 signups
    - Expected: 45 ± 16
    - Recent changes: Deploy 30 min ago, Marketing email sent 1h ago
  Send to: #ops-alerts with @engineering mention
```

---

### Pattern 6: SLA Breach Monitoring

**Use Case:** Alert when service level agreements are at risk

**When to Use:**
- Support tickets approaching response time SLA
- Orders at risk of missing fulfillment deadline
- Tasks stuck in pipeline too long

**Flow Diagram:**
```
TRIGGER: Schedule (every 5 minutes)
  ↓
[fetch_open_items_tickets_orders_tasks]
  ↓
[for_each_item_calculate_time_remaining_until_sla_breach]
  ↓
[filter_items_at_risk_less_than_threshold]
  ├─→ BREACH IMMINENT (< 15 min remaining):
  │   [send_urgent_alert_to_assignee]
  │   [escalate_to_manager]
  └─→ WARNING (< 1 hour remaining):
      [send_warning_to_assignee]
  ↓
[update_sla_status_field_in_source_system]
```

**Key Nodes:**
1. **Time calculation:** SLA deadline - current time
2. **Filtering:** Only alert on at-risk items
3. **Escalation tiers:** Different urgency levels
4. **Assignment routing:** Alert goes to right person

**Considerations:**
- **Business hours:** SLA clock only during 9-5? Or 24/7?
- **Priority tiers:** Enterprise customers have stricter SLAs
- **Pause SLA:** When waiting on customer response
- **Historical tracking:** Log SLA performance for reporting

**Example:**
```
Schedule: Every 5 minutes
  ↓
Fetch open support tickets from Zendesk:
  SELECT * FROM tickets WHERE status = 'open' AND sla_deadline IS NOT NULL
  ↓
For each ticket:
  time_remaining = sla_deadline - now()
  ├─→ time_remaining < 15 minutes:
  │   Send Slack DM to assignee: "🚨 Ticket #{id} SLA breach in {time_remaining}!"
  │   If assignee hasn't viewed: Escalate to manager
  │   Update ticket: priority = urgent, tag = sla_at_risk
  └─→ time_remaining < 60 minutes:
      Send Slack DM: "⚠️ Ticket #{id} SLA breach in {time_remaining}"
      Update ticket: tag = sla_warning
```

---

## Data Enrichment

### Pattern 7: Lead Enrichment Pipeline

**Use Case:** Enrich new leads with company and firmographic data

**When to Use:**
- Form captures only email and name
- Need to qualify leads by company size/industry
- Building lead scoring model

**Flow Diagram:**
```
TRIGGER: New lead captured (form submission, import, API)
  ↓
[extract_email_and_parse_domain]
  ↓
[lookup_company_data_from_clearbit_or_similar]
  ↓
[fetch_linkedin_company_profile_if_available]
  ↓
[calculate_lead_score_based_on_firmographics]
  ↓
[update_crm_contact_with_enriched_data]
  ↓
[route_to_appropriate_team_based_on_score]
```

**Key Nodes:**
1. **Domain extraction:** john@startup.com → startup.com
2. **Enrichment API:** Call Clearbit/ZoomInfo/etc.
3. **Lead scoring:** Company size + industry + role = score
4. **CRM update:** Write back enriched fields
5. **Routing logic:** Enterprise → sales, SMB → marketing

**Considerations:**
- **Personal emails:** Gmail/Yahoo won't have company data (handle gracefully)
- **API costs:** Enrichment APIs charge per lookup ($0.50-$2.00 each)
- **Caching:** Don't re-enrich same company for multiple employees
- **Partial data:** Some fields may be null (have defaults)

**Example:**
```
Trigger: Form submission on website
  ↓
Extract data:
  email = "john@acme-corp.com"
  domain = "acme-corp.com"
  ↓
Call Clearbit Enrichment API (domain):
  → company_name: "Acme Corp"
  → employee_count: 250
  → industry: "Manufacturing"
  → annual_revenue: "$50M"
  ↓
Calculate lead_score:
  score = 0
  if employee_count > 200: score += 30
  if industry in ["SaaS", "Technology"]: score += 20 (not match, +0)
  if revenue > "$10M": score += 25
  Total: 55/100
  ↓
Update HubSpot contact:
  - Add all enriched fields
  - Set lead_score = 55
  - Set segment = "Mid-Market"
  ↓
Route to sales team (score > 50)
```

---

### Pattern 8: Contact Deduplication & Merging

**Use Case:** Find and merge duplicate contacts in CRM

**When to Use:**
- Multiple form submissions from same person
- Imports created duplicates
- Different email addresses for same person

**Flow Diagram:**
```
TRIGGER: New contact created OR Schedule (weekly cleanup)
  ↓
[fetch_new_contact_data]
  ↓
[search_for_potential_duplicates_by_email_phone_name]
  ↓
[for_each_potential_match_calculate_similarity_score]
  ↓
[if_score_above_threshold_consider_duplicate]
  ├─→ HIGH CONFIDENCE (score > 90):
  │   [automatically_merge_contacts]
  │   [keep_most_complete_record_as_primary]
  └─→ MEDIUM CONFIDENCE (score 70-90):
      [create_manual_review_task_for_human]
  ↓
[log_merge_action_for_audit_trail]
```

**Key Nodes:**
1. **Fuzzy matching:** "john.doe@company.com" ≈ "jdoe@company.com"
2. **Similarity scoring:** Compare email, name, phone, company
3. **Merge logic:** Which record to keep? (most complete? oldest? newest?)
4. **Field conflict resolution:** If both have different phone numbers, which wins?

**Considerations:**
- **False positives:** Don't auto-merge John Smith (common name)
- **Data preservation:** Don't lose any data in merge (combine notes, tags)
- **Activity history:** Merge email opens, form submissions, etc.
- **Relationships:** Update any related records (deals, tickets)

**Example:**
```
Trigger: New contact created
  ↓
New contact:
  email: john.doe@acme.com
  name: John Doe
  phone: +1-555-0100
  ↓
Search for duplicates:
  - Search by exact email match → 0 results
  - Search by name + company → 1 result:
      email: jdoe@acme.com
      name: J. Doe
      phone: null
  ↓
Calculate similarity:
  email_similarity = 70% (same domain, similar local part)
  name_similarity = 90% ("John Doe" vs "J. Doe")
  company_match = 100% (both acme.com)
  total_score = 87%
  ↓
Medium confidence (70-90):
  Don't auto-merge
  Create task: "Review potential duplicate: John Doe vs J. Doe"
  Assign to: data ops team
```

---

## Approval Workflows

### Pattern 9: Multi-Level Approval Chain

**Use Case:** Request requires approval from multiple people in sequence

**When to Use:**
- Expense approval (manager → finance → exec if > threshold)
- Content publishing (editor → legal → compliance)
- Contract signing (sales → legal → exec)

**Flow Diagram:**
```
TRIGGER: Request submitted (form, button click, status change)
  ↓
[fetch_request_details_and_determine_approvers]
  ↓
[send_approval_request_to_approver_1]
  ↓
[wait_for_response_pause_workflow]
  ├─→ APPROVED:
  │   [check_if_more_approvers_needed]
  │   ├─→ YES: [send_to_next_approver, repeat]
  │   └─→ NO: [execute_final_action_publish_purchase_etc]
  └─→ REJECTED:
      [notify_requester_of_rejection_with_reason]
  ↓
[log_approval_history_for_audit]
```

**Key Nodes:**
1. **Approver determination:** Based on $ amount, content type, etc.
2. **Pause/resume:** Workflow waits for human input
3. **Timeout handling:** If no response in X hours, escalate or reject
4. **Audit logging:** Track who approved when with what comments

**Considerations:**
- **Timeout strategy:** Auto-reject? Escalate? Send reminders?
- **Parallel vs sequential:** Can multiple people approve simultaneously?
- **Delegation:** If approver on vacation, who covers?
- **Conditional approvers:** If $ > $10k, add CFO to chain

**Example:**
```
Trigger: Expense report submitted
  ↓
Fetch expense details:
  amount = $5,000
  category = "Software"
  ↓
Determine approval chain:
  if amount < $1k: manager only
  if $1k - $5k: manager → finance
  if > $5k: manager → finance → CFO

  This expense: manager → finance
  ↓
Send Slack message to manager:
  "Approve $5k software expense? [Approve] [Reject]"
  ↓
Wait for response (timeout: 48 hours)
  ├─→ APPROVED:
  │   Send to finance team:
  │   "Manager approved $5k expense. Review and approve? [Approve] [Reject]"
  │   Wait for response (timeout: 24 hours)
  │   ├─→ APPROVED:
  │   │   Process expense reimbursement
  │   │   Notify requester: "Approved! Reimbursement in 3-5 days"
  │   └─→ REJECTED or TIMEOUT:
  │       Notify requester: "Finance rejected: {reason}"
  └─→ REJECTED or TIMEOUT:
      Notify requester: "Manager rejected: {reason}"
```

---

### Pattern 10: Conditional Approval Routing

**Use Case:** Route approval requests based on content, not just linear chain

**When to Use:**
- Different types of requests need different approvers
- Legal review only needed for certain content types
- Security review only for infrastructure changes

**Flow Diagram:**
```
TRIGGER: Request submitted
  ↓
[analyze_request_content_and_metadata]
  ↓
[determine_required_approval_types]
  ├─→ NEEDS_LEGAL: [send_to_legal_team]
  ├─→ NEEDS_SECURITY: [send_to_security_team]
  ├─→ NEEDS_FINANCE: [send_to_finance_team]
  └─→ NEEDS_COMPLIANCE: [send_to_compliance_team]
  ↓
[collect_all_approval_responses_parallel_or_sequential]
  ↓
[if_all_approved_execute_action]
```

**Key Nodes:**
1. **Content analysis:** Keywords, categories, $ amounts determine routing
2. **Parallel approvals:** Multiple teams review simultaneously
3. **Conditional routing:** Only send to teams that need to review
4. **Aggregation:** Wait for all required approvals before proceeding

**Considerations:**
- **Dependency order:** Does legal need to approve before security? Or parallel?
- **Any rejection:** If one team rejects, cancel other pending approvals?
- **Partial approval:** What if legal approves but security rejects?
- **Amendment loop:** If rejected with requested changes, re-route after edits

**Example:**
```
Trigger: Blog post ready for review
  ↓
Analyze content:
  - Contains medical claims? → Needs legal
  - Contains customer data? → Needs security
  - Mentions pricing? → Needs finance
  - Public health topic? → Needs compliance
  ↓
This post: Contains "GDPR" and "pricing"
  → Needs: legal + finance (not security, not compliance)
  ↓
Send to legal and finance in parallel:
  - Legal: Reviews GDPR claims
  - Finance: Reviews pricing accuracy
  ↓
Wait for both responses:
  - Legal: APPROVED (no issues)
  - Finance: REJECTED ("Pricing is outdated, update to $99/mo")
  ↓
Result: Rejected
Notify author: "Finance rejected. Update pricing, then resubmit"
```

---

## Batch Processing & Reports

### Pattern 11: Daily Automated Reports

**Use Case:** Generate and send reports on a schedule

**When to Use:**
- Daily sales summary for leadership
- Weekly marketing performance report
- Monthly financial reporting

**Flow Diagram:**
```
TRIGGER: Cron schedule (e.g., every weekday at 9 AM)
  ↓
[calculate_date_range_for_report_yesterday_last_week_etc]
  ↓
[fetch_data_from_source_1] ─┐
[fetch_data_from_source_2] ─┤ (parallel)
[fetch_data_from_source_3] ─┘
  ↓
[merge_and_calculate_aggregated_metrics]
  ↓
[generate_report_document_or_visualization]
  ↓
[send_report_to_team_email_slack_or_store_in_notion]
```

**Key Nodes:**
1. **Date math:** Calculate "yesterday", "last 7 days", "last month"
2. **Parallel fetches:** Get all data sources simultaneously
3. **Metric calculation:** Revenue, conversion rate, growth %
4. **Formatting:** Create readable report (table, chart, summary)
5. **Distribution:** Email, Slack, or store in database

**Considerations:**
- **Timezone handling:** 9 AM where? Use consistent timezone
- **Data freshness:** Ensure source systems have finished processing
- **Report format:** PDF? HTML email? Notion page? Slack message?
- **Failure handling:** If data fetch fails, send partial report or alert?

**Example:**
```
Schedule: Every weekday at 9 AM UTC
  ↓
Calculate date range:
  start_date = yesterday_start (00:00:00)
  end_date = yesterday_end (23:59:59)
  ↓
Fetch data in parallel:
  - Stripe: Get revenue, new customers, churned customers
  - Google Analytics: Get traffic, conversions, top pages
  - HubSpot: Get new leads, new deals, deals closed
  ↓
Calculate metrics:
  - Daily revenue: $12,450
  - New MRR: +$3,200
  - Churn MRR: -$800
  - Net new MRR: +$2,400
  - Conversion rate: 3.2% (traffic → signups)
  - Deal close rate: 25% (proposals → closed)
  ↓
Format report:
  "📊 Daily Report - Jan 2, 2025

  Revenue: $12,450 (+15% vs last week avg)
  New customers: 8 (+2 vs yesterday)
  Churn: 2 customers (-$800 MRR)

  Traffic: 5,430 visitors (+8%)
  Signups: 174 (3.2% conversion)

  New leads: 42
  Deals closed: 3 ($24k total value)"
  ↓
Send to Slack #daily-metrics + Email to leadership
```

---

### Pattern 12: Scheduled Data Cleanup

**Use Case:** Clean up old/unused data on schedule

**When to Use:**
- Delete old log files
- Archive completed projects
- Remove expired trial users

**Flow Diagram:**
```
TRIGGER: Cron schedule (e.g., nightly at 2 AM)
  ↓
[fetch_items_matching_cleanup_criteria]
  ↓
[validate_items_are_safe_to_delete_or_archive]
  ↓
[for_each_item_perform_cleanup_action]
  ├─→ DELETE: [permanently_remove_from_system]
  ├─→ ARCHIVE: [move_to_archive_storage]
  └─→ SKIP: [log_reason_for_skipping]
  ↓
[generate_cleanup_summary_report]
  ↓
[send_summary_to_ops_team]
```

**Key Nodes:**
1. **Criteria filter:** Age, status, usage, etc.
2. **Safety checks:** Prevent accidental deletion of active data
3. **Cleanup action:** Delete, archive, or anonymize
4. **Summary report:** What was cleaned up, how much space saved

**Considerations:**
- **Soft delete first:** Archive for 30 days before permanent delete
- **Foreign key dependencies:** Don't delete if other records reference it
- **Backup before delete:** Ensure backups exist
- **Audit logging:** Track what was deleted, when, by whom (even if automated)

**Example:**
```
Schedule: Every night at 2 AM UTC
  ↓
Fetch old trial users:
  SELECT * FROM users
  WHERE plan = 'trial'
    AND trial_ended_at < NOW() - INTERVAL '90 days'
    AND last_login_at < NOW() - INTERVAL '60 days'
  ↓
Validate safe to delete:
  - No active subscriptions
  - No outstanding invoices
  - No recent activity
  ↓
For each user (found 47):
  - Anonymize personal data (email, name → hashed)
  - Delete uploaded files from S3
  - Archive user record to cold storage
  - Delete from primary database
  ↓
Summary:
  "🧹 Nightly Cleanup - Jan 2, 2025

  Expired trials cleaned: 47 users
  Storage freed: 2.3 GB
  Records archived: 47

  Errors: 0
  Skipped: 3 (had recent support tickets)"
  ↓
Send to #ops-alerts
```

---

## Content Automation

### Pattern 13: Content Publishing Pipeline

**Use Case:** Automatically publish content to CMS on schedule

**When to Use:**
- Blog posts drafted in Notion, auto-publish to WordPress
- Social posts scheduled in spreadsheet, auto-post at specified times
- Newsletter editions ready to send

**Flow Diagram:**
```
TRIGGER: Schedule check (every 15 minutes) OR Status change to "ready"
  ↓
[fetch_content_ready_for_publishing]
  ↓
[validate_content_has_required_fields]
  ↓
[transform_content_to_cms_format]
  ↓
[publish_to_cms_wordpress_webflow_etc]
  ↓
[update_status_in_source_system_to_published]
  ↓
[send_confirmation_to_author_and_team]
```

**Key Nodes:**
1. **Ready check:** Filter content with "ready" status and future publish_date
2. **Validation:** Ensure title, body, featured image, SEO fields present
3. **Format transformation:** Notion blocks → WordPress HTML, etc.
4. **Publishing API:** Create/update post in CMS
5. **Status update:** Mark as "published" in source system

**Considerations:**
- **Timezone handling:** Publish at "9 AM local time" for different regions?
- **Draft vs publish:** Create as draft first, then publish? Or direct publish?
- **Media handling:** Upload images to CMS or reference external URLs?
- **SEO fields:** Meta description, og:image, canonical URL

**Example:**
```
Schedule: Every 15 minutes
  ↓
Fetch from Notion "Blog Posts" database:
  Filter: status = "ready" AND publish_date <= now()
  ↓
Found 1 post:
  title: "How to Build Gumloop Workflows"
  author: "Jane Doe"
  body: [Notion blocks]
  featured_image: [image URL]
  publish_date: "2025-01-02 09:00"
  ↓
Validate:
  ✅ title present
  ✅ body present (1,200 words)
  ✅ featured_image present
  ✅ meta_description present
  ↓
Transform:
  Convert Notion blocks → WordPress HTML
  Upload featured_image to WordPress media library
  ↓
Publish to WordPress:
  POST /wp-json/wp/v2/posts
  {
    "title": "...",
    "content": "...",
    "featured_media": media_id,
    "status": "publish"
  }
  ↓
Update Notion:
  - status: "published"
  - published_url: "https://blog.example.com/how-to-build-gumloop-workflows"
  - published_at: "2025-01-02T09:00:00Z"
  ↓
Send Slack notification:
  "📝 Published: How to Build Gumloop Workflows by Jane Doe"
```

---

### Pattern 14: Social Media Cross-Posting

**Use Case:** Post same content to multiple social platforms simultaneously

**When to Use:**
- Company announcement needs to go to Twitter, LinkedIn, Facebook
- Product launch coordinated across platforms
- Blog post promotion on all channels

**Flow Diagram:**
```
TRIGGER: Content ready to post (manual trigger, schedule, or webhook)
  ↓
[fetch_content_and_platform_list]
  ↓
[for_each_platform_adapt_content_to_platform_constraints]
  ├─→ TWITTER: [shorten_to_280_chars_add_hashtags]
  ├─→ LINKEDIN: [professional_tone_longer_form]
  ├─→ FACEBOOK: [casual_tone_with_emojis]
  └─→ INSTAGRAM: [image_required_caption_format]
  ↓
[post_to_all_platforms_in_parallel]
  ↓
[collect_post_urls_and_store_for_tracking]
```

**Key Nodes:**
1. **Content adaptation:** Same message, different formats per platform
2. **Character limits:** Twitter 280, LinkedIn 3000, etc.
3. **Media requirements:** Instagram needs image, Twitter supports GIFs
4. **Parallel posting:** Post to all platforms simultaneously
5. **URL tracking:** Store post links for analytics

**Considerations:**
- **Platform-specific formatting:** @mentions, #hashtags work differently
- **Image dimensions:** Each platform has different aspect ratio preferences
- **Posting limits:** Twitter rate limits, LinkedIn throttling
- **Scheduling:** Post at optimal times per platform (may be different)

**Example:**
```
Trigger: New blog post published
  ↓
Fetch content:
  title: "How to Build Gumloop Workflows"
  url: "https://blog.example.com/gumloop-workflows"
  image: [featured image URL]
  ↓
Adapt for each platform:

  Twitter:
    "🚀 New guide: How to Build Gumloop Workflows

    Learn to automate anything with no code.

    Read it here: [URL]

    #NoCode #Automation #Gumloop"
    (279 chars)

  LinkedIn:
    "We just published a comprehensive guide on building Gumloop workflows.

    If you're looking to automate processes without code, this covers everything from simple alerts to complex multi-step approvals.

    Check it out: [URL]"
    (More professional, longer form)

  Facebook:
    "New blog post! 🎉

    Ever wanted to automate your work but don't know how to code? We've got you covered.

    Check out our latest guide: [URL]"
    (Casual, emoji-friendly)
  ↓
Post to all platforms in parallel:
  - Twitter API: POST /2/tweets
  - LinkedIn API: POST /ugcPosts
  - Facebook API: POST /me/feed
  ↓
Store post URLs:
  - Twitter: https://twitter.com/company/status/123...
  - LinkedIn: https://linkedin.com/feed/update/urn:li:share:456...
  - Facebook: https://facebook.com/company/posts/789...
  ↓
Log in tracking system for analytics
```

---

## Lead Management

### Pattern 15: Lead Scoring & Routing

**Use Case:** Score leads and route to appropriate team based on fit

**When to Use:**
- Qualify inbound leads automatically
- Route enterprise leads to sales, SMB to self-serve
- Prioritize outreach based on lead quality

**Flow Diagram:**
```
TRIGGER: New lead captured (form, import, enrichment complete)
  ↓
[fetch_lead_data_and_firmographics]
  ↓
[calculate_lead_score_based_on_multiple_factors]
  ├─→ Company size (employees)
  ├─→ Industry match
  ├─→ Revenue/budget
  ├─→ Role/seniority
  └─→ Engagement level
  ↓
[determine_lead_tier_based_on_score]
  ├─→ TIER_1 (score > 80): [route_to_enterprise_sales_team]
  ├─→ TIER_2 (score 50-80): [route_to_smb_sales_team]
  └─→ TIER_3 (score < 50): [route_to_automated_nurture]
  ↓
[update_crm_with_score_and_assignment]
```

**Key Nodes:**
1. **Scoring algorithm:** Weighted factors sum to total score
2. **Tier determination:** Score thresholds define tiers
3. **Routing logic:** Different teams for different tiers
4. **CRM update:** Write score, tier, assignment back to CRM

**Considerations:**
- **Scoring weights:** Which factors matter most? (50% company size, 30% industry, 20% role?)
- **Threshold tuning:** What score = enterprise? (adjust based on close rates)
- **Re-scoring:** When to recalculate? (monthly? when data changes?)
- **Human override:** Sales can manually upgrade tier

**Example:**
```
Trigger: New lead from website form
  ↓
Fetch lead data (from form + enrichment):
  email: "john@acme-corp.com"
  role: "VP Engineering"
  company_size: 500 employees
  industry: "SaaS"
  revenue: "$50M"
  ↓
Calculate lead score:

  Company size score:
    500 employees → 35/40 points (40 points max)

  Industry match:
    SaaS (target industry) → 25/25 points

  Role/seniority:
    VP level → 15/20 points (20 points max)

  Budget signal:
    $50M revenue → 10/15 points (15 points max, $100M+ = full)

  Total: 85/100
  ↓
Determine tier:
  85 > 80 → TIER 1 (Enterprise)
  ↓
Route to enterprise sales:
  - Assign to: Sarah (enterprise AE)
  - Priority: High
  - SLA: Contact within 4 hours
  ↓
Update HubSpot:
  - lead_score: 85
  - tier: "Enterprise"
  - owner: sarah@company.com
  - next_action: "Initial outreach"
  ↓
Send Slack to Sarah:
  "🎯 New Enterprise Lead: John Doe, VP Eng at Acme Corp (500 employees)
  Score: 85/100
  Contact within 4 hours"
```

---

### Pattern 16: Lead Nurture Drip Campaign

**Use Case:** Automatically send series of emails to nurture leads over time

**When to Use:**
- New trial users need education
- Leads not ready to buy need warming
- Free users should see upgrade prompts

**Flow Diagram:**
```
TRIGGER: Lead enters nurture segment (tag added, status changed)
  ↓
[enroll_lead_in_nurture_sequence]
  ↓
[day_0_send_email_1_welcome]
  ↓
[wait_2_days]
  ↓
[day_2_send_email_2_educational_content]
  ↓
[wait_3_days]
  ↓
[day_5_send_email_3_customer_story]
  ↓
[wait_2_days]
  ↓
[day_7_send_email_4_offer_demo]
  ↓
[check_if_lead_converted_or_engaged]
  ├─→ CONVERTED: [exit_nurture_sequence]
  └─→ NOT_CONVERTED: [continue_to_next_email_or_end]
```

**Key Nodes:**
1. **Enrollment trigger:** What action starts the sequence?
2. **Delay/wait nodes:** Time between emails
3. **Email delivery:** Send via SendGrid, Mailchimp, etc.
4. **Engagement tracking:** Did they open? Click?
5. **Exit conditions:** Stop if they convert, unsubscribe, or engage

**Considerations:**
- **Unsubscribe:** Always include unsubscribe link, honor requests immediately
- **Engagement-based timing:** If they open email 2, send email 3 sooner
- **Personalization:** Use name, company, role in emails
- **A/B testing:** Test subject lines, content, timing

**Example:**
```
Trigger: Lead tagged "nurture_trial" in CRM
  ↓
Enroll in "Trial Nurture Sequence"
  ↓
Day 0 (immediately):
  Email 1: "Welcome to [Product]! Here's how to get started"
  - Personal welcome from CEO
  - Quick start guide
  - Link to first tutorial
  ↓
Wait: 2 days
  ↓
Day 2:
  Check: Did they activate account?
  ├─→ NO: Email 2: "Not sure where to start? We can help"
  │     - Common first steps
  │     - Video walkthrough
  │     - Offer 1-on-1 onboarding call
  └─→ YES: Email 2: "Nice work! Here's what to do next"
        - Next-level features
        - Pro tips from power users
  ↓
Wait: 3 days
  ↓
Day 5:
  Email 3: "How [Customer X] saved 10 hours/week with [Product]"
  - Customer story
  - Specific use case similar to theirs
  - ROI calculator
  ↓
Wait: 2 days
  ↓
Day 7:
  Check: Have they used core feature?
  ├─→ NO: Email 4: "Need help getting value from [Product]?"
  │     - Book demo with specialist
  │     - FAQ for common blockers
  └─→ YES: Email 4: "Ready to upgrade? Here's 20% off"
        - Upgrade offer
        - Feature comparison
        - Testimonials
  ↓
Exit if: Upgraded, unsubscribed, or sequence complete
```

---

## E-commerce & Orders

### Pattern 17: Order Fulfillment Automation

**Use Case:** Automatically process orders from payment to shipment

**When to Use:**
- E-commerce store needs order processing
- Inventory management integrated with fulfillment
- Customer notifications at each step

**Flow Diagram:**
```
TRIGGER: Order placed (webhook from Shopify, Stripe, etc.)
  ↓
[fetch_order_details_items_customer_shipping]
  ↓
[validate_payment_captured_successfully]
  ├─→ PAYMENT_FAILED: [notify_customer_and_ops_team]
  └─→ PAYMENT_SUCCESS:
      [check_inventory_for_all_items]
      ├─→ OUT_OF_STOCK: [notify_customer_send_backorder_email]
      └─→ IN_STOCK:
          [reserve_inventory_for_this_order]
          [create_packing_slip_and_shipping_label]
          [send_to_fulfillment_center_or_warehouse]
          [send_order_confirmation_email_to_customer]
  ↓
[update_order_status_in_system]
```

**Key Nodes:**
1. **Payment validation:** Ensure funds captured before fulfilling
2. **Inventory check:** Verify all items in stock
3. **Inventory reservation:** Prevent overselling
4. **Label generation:** Create shipping label via ShipStation, EasyPost
5. **Customer notification:** Confirmation, tracking, delivery emails

**Considerations:**
- **Partial fulfillment:** If some items out of stock, ship available items?
- **Shipping method:** Determine based on customer selection or geography
- **International orders:** Customs forms, duties, longer delivery
- **Fraud detection:** Hold high-risk orders for manual review

**Example:**
```
Trigger: Shopify webhook (order created)
  ↓
Fetch order:
  order_id: #1234
  customer: john@example.com
  items: [Product A (qty 2), Product B (qty 1)]
  shipping_address: {...}
  payment_status: "paid"
  ↓
Validate payment:
  Stripe charge status: "succeeded"
  ✅ Payment confirmed
  ↓
Check inventory (from database):
  Product A: 50 in stock ✅
  Product B: 0 in stock ❌
  ↓
Partial fulfillment decision:
  Ship Product A now, backorder Product B
  ↓
Reserve inventory:
  Product A: 50 → 48 (reserved 2)
  ↓
Create shipping label (via ShipStation):
  Service: USPS Priority Mail
  From: Warehouse address
  To: Customer shipping address
  Contents: Product A (qty 2)
  → Label URL: https://...
  → Tracking: 9400...
  ↓
Send emails:
  1. Order confirmation:
     "Thanks for your order! Product A shipping today, Product B backordered."
  2. Shipping notification:
     "Product A shipped! Track it here: [tracking link]"
  3. Backorder notification:
     "Product B will ship when restocked (est. Jan 15)"
  ↓
Update Shopify order:
  - fulfillment_status: "partial"
  - tracking_number: "9400..."
  - notes: "Product B backordered"
```

---

### Pattern 18: Abandoned Cart Recovery

**Use Case:** Remind customers about items left in cart

**When to Use:**
- E-commerce site wants to recover lost sales
- Free trial users haven't completed setup
- Subscription checkout abandoned

**Flow Diagram:**
```
TRIGGER: Cart created but not completed (after X hours)
  ↓
[fetch_cart_details_items_customer]
  ↓
[check_if_order_was_completed_elsewhere]
  ├─→ COMPLETED: [exit_workflow_do_not_email]
  └─→ STILL_ABANDONED:
      [wait_1_hour_after_abandonment]
      [send_email_1_gentle_reminder]
      ↓
      [wait_24_hours]
      [check_if_cart_still_abandoned]
      ├─→ COMPLETED: [exit]
      └─→ STILL_ABANDONED:
          [send_email_2_with_discount_incentive]
          ↓
          [wait_48_hours]
          [check_if_cart_still_abandoned]
          ├─→ COMPLETED: [exit]
          └─→ STILL_ABANDONED:
              [send_email_3_last_chance]
```

**Key Nodes:**
1. **Abandonment detection:** Cart created > X hours ago, no order
2. **Completion check:** Don't email if they completed order elsewhere
3. **Timed reminders:** Email 1 at +1h, email 2 at +24h, email 3 at +72h
4. **Incentive escalation:** Email 2 offers discount, email 3 higher discount
5. **Exit conditions:** Stop if they complete order at any point

**Considerations:**
- **Discount strategy:** When to offer discount? How much? (10% vs 20%)
- **Personalization:** Include cart items, total, product images
- **Channel:** Email only? Or also SMS, push notification?
- **Frequency cap:** Don't email same customer multiple times per week

**Example:**
```
Trigger: Shopify cart abandoned (2 hours ago)
  ↓
Fetch cart:
  customer: jane@example.com
  items: [Wireless Headphones - $99]
  abandoned_at: 2025-01-02 10:00
  ↓
Check if order completed:
  Search orders for jane@example.com in last 2 hours → None
  ✅ Still abandoned
  ↓
Wait: 1 hour (now 3 hours since abandonment)
  ↓
Email 1: "You left something behind!"
  Subject: "Still interested in Wireless Headphones?"
  Body:
    "Hi Jane,

    You left these items in your cart:
    - Wireless Headphones ($99)

    Complete your purchase: [checkout link]"
  ↓
Wait: 24 hours
  ↓
Check if completed → Still abandoned
  ↓
Email 2: "Here's 10% off to complete your order"
  Subject: "10% off Wireless Headphones - today only!"
  Body:
    "We noticed you didn't complete your purchase.

    Here's 10% off to help you decide:
    Code: SAVE10

    [Checkout with discount]"
  ↓
Wait: 48 hours
  ↓
Check if completed → Still abandoned
  ↓
Email 3: "Last chance - 20% off!"
  Subject: "Final offer: 20% off your cart"
  Body:
    "This is our last reminder about your cart.

    We're offering 20% off if you complete your purchase today:
    Code: FINAL20

    [Checkout now]

    After today, your cart will expire."
  ↓
Mark campaign as complete
```

---

## Customer Support

### Pattern 19: Auto-Response to Support Tickets

**Use Case:** Acknowledge support tickets and provide initial help

**When to Use:**
- Support team needs to acknowledge tickets immediately
- Common questions can be answered automatically
- Triage tickets to right team

**Flow Diagram:**
```
TRIGGER: New support ticket created (email, chat, form)
  ↓
[fetch_ticket_content_and_sender_info]
  ↓
[analyze_ticket_subject_and_body_for_keywords]
  ↓
[categorize_ticket_billing_technical_general]
  ↓
[check_if_matches_known_faq]
  ├─→ MATCHES_FAQ:
  │   [send_auto_response_with_faq_answer]
  │   [mark_ticket_as_auto_resolved]
  │   [ask_if_answer_was_helpful]
  └─→ NEEDS_HUMAN:
      [send_acknowledgment_email]
      [assign_to_appropriate_team]
      [set_sla_based_on_priority]
```

**Key Nodes:**
1. **Content analysis:** Extract keywords from subject/body
2. **Categorization:** Billing, tech support, sales, general
3. **FAQ matching:** Does question match known answers?
4. **Auto-resolution:** Send answer, mark resolved if confidence high
5. **Human routing:** Assign to team if can't auto-resolve

**Considerations:**
- **Confidence threshold:** Only auto-resolve if 90%+ confident in answer
- **Human escalation:** Easy way for customer to say "this didn't help"
- **Feedback loop:** Track which auto-responses were helpful
- **Tone:** Friendly, empathetic, not robotic

**Example:**
```
Trigger: Email to support@company.com
  ↓
Fetch ticket:
  from: customer@example.com
  subject: "How do I reset my password?"
  body: "I forgot my password and can't log in."
  ↓
Analyze keywords:
  - "reset password" → FAQ category: Account Management
  - "forgot" → FAQ match: "How to Reset Password"
  - Confidence: 95%
  ↓
Auto-response (confidence > 90%):
  Subject: Re: How do I reset my password?
  Body:
    "Hi there,

    Thanks for reaching out! Here's how to reset your password:

    1. Go to: https://app.company.com/reset-password
    2. Enter your email: customer@example.com
    3. Check your email for reset link
    4. Create new password

    If this doesn't work, reply to this email and we'll help you personally.

    Was this helpful? [Yes] [No, I need more help]

    Best,
    Support Team"
  ↓
Mark ticket as: "Auto-resolved"
  ↓
If customer replies or clicks "No":
  → Reopen ticket
  → Assign to human agent
  → Flag as "auto-resolution failed"
```

---

### Pattern 20: Support Ticket Escalation

**Use Case:** Escalate unresolved tickets based on time or priority

**When to Use:**
- Tickets approaching SLA breach
- VIP customer tickets need priority
- Critical issues need immediate escalation

**Flow Diagram:**
```
TRIGGER: Schedule (every 30 minutes)
  ↓
[fetch_open_tickets_with_escalation_criteria]
  ↓
[for_each_ticket_check_escalation_conditions]
  ├─→ TIME_BASED: [ticket_open_longer_than_threshold]
  ├─→ PRIORITY_BASED: [customer_tier_or_issue_severity]
  └─→ SLA_BASED: [approaching_sla_breach]
  ↓
[if_meets_escalation_criteria]
  ├─→ LEVEL_1_ESCALATION:
  │   [notify_team_lead]
  │   [increase_ticket_priority]
  └─→ LEVEL_2_ESCALATION:
      [notify_manager_and_exec]
      [create_incident_in_tracking_system]
```

**Key Nodes:**
1. **Escalation criteria:** Define rules for escalation
2. **Ticket analysis:** Check age, priority, customer tier
3. **Escalation levels:** L1 (team lead), L2 (manager), L3 (exec)
4. **Notification:** Alert appropriate people via Slack, email, SMS
5. **Incident creation:** For critical issues, create formal incident

**Considerations:**
- **Escalation thresholds:** When to escalate? (4h for enterprise, 24h for SMB?)
- **On-call rotation:** Who gets alerted outside business hours?
- **Customer communication:** Notify customer that ticket was escalated
- **Resolution tracking:** Ensure escalated tickets don't fall through cracks

**Example:**
```
Schedule: Every 30 minutes
  ↓
Fetch open tickets:
  Filter: status = "open" AND assigned_to IS NOT NULL
  ↓
For each ticket, check escalation rules:

  Ticket #123:
    customer_tier: "Enterprise"
    priority: "High"
    created_at: 3 hours ago
    last_response: 2 hours ago
    sla_deadline: 4 hours (1 hour remaining)

    Escalation check:
      ✅ Enterprise customer (priority tier)
      ✅ High priority issue
      ✅ Approaching SLA (< 2 hours remaining)
      ✅ No response in > 1 hour

    → ESCALATE TO LEVEL 1
  ↓
Level 1 Escalation:
  1. Notify team lead:
     Slack DM: "🚨 Ticket #123 needs attention
     Customer: Acme Corp (Enterprise)
     Issue: Integration error
     SLA: 1 hour remaining
     Last update: 2 hours ago"

  2. Update ticket:
     - priority: High → Critical
     - tag: "escalated_L1"
     - note: "Escalated to team lead at {timestamp}"

  3. Notify customer:
     Email: "Your ticket has been escalated to our senior team.
     We're prioritizing your issue and will update you within 30 minutes."
  ↓
If still unresolved after another hour:
  → ESCALATE TO LEVEL 2 (manager + create incident)
```

---

## Webhooks & APIs

### Pattern 21: Webhook to Multiple Systems

**Use Case:** Receive webhook, process data, send to multiple destinations

**When to Use:**
- One event needs to update multiple systems
- Fanout pattern: 1 input → many outputs
- Sync data across multiple tools

**Flow Diagram:**
```
TRIGGER: Webhook received (from external system)
  ↓
[validate_webhook_signature_for_security]
  ↓
[parse_webhook_payload_and_extract_data]
  ↓
[transform_data_for_different_destinations]
  ↓
[send_to_destination_1] ─┐
[send_to_destination_2] ─┤ (parallel)
[send_to_destination_3] ─┤
[send_to_destination_4] ─┘
  ↓
[collect_results_and_log_successes_failures]
```

**Key Nodes:**
1. **Signature validation:** Verify webhook is legitimate (HMAC, secret)
2. **Payload parsing:** Extract relevant fields
3. **Data transformation:** Format for each destination
4. **Parallel sends:** Send to all destinations simultaneously
5. **Error aggregation:** Track which sends succeeded/failed

**Considerations:**
- **Partial failure:** If 1 of 4 destinations fails, continue with others?
- **Idempotency:** Prevent duplicate sends if webhook replays
- **Retry logic:** If destination unavailable, retry or queue?
- **Security:** Validate webhook signature to prevent spoofing

**Example:**
```
Trigger: Stripe webhook (invoice.paid)
  ↓
Validate webhook:
  Verify HMAC signature using Stripe secret
  ✅ Signature valid
  ↓
Parse payload:
  customer_id: "cus_12345"
  invoice_id: "in_67890"
  amount_paid: $99.00
  subscription_id: "sub_abc123"
  ↓
Transform for each destination:

  For HubSpot:
    {
      "email": customer.email,
      "properties": {
        "last_payment_date": "2025-01-02",
        "last_payment_amount": 99.00
      }
    }

  For Slack:
    {
      "text": "💰 Payment received: $99 from customer_12345",
      "channel": "#revenue-alerts"
    }

  For Google Sheets (revenue log):
    {
      "date": "2025-01-02",
      "customer_id": "cus_12345",
      "amount": 99.00,
      "invoice": "in_67890"
    }

  For Internal Database:
    INSERT INTO payments (customer_id, amount, date) VALUES (...)
  ↓
Send to all destinations in parallel:
  - HubSpot: ✅ Success
  - Slack: ✅ Success
  - Google Sheets: ❌ Failed (rate limit)
  - Database: ✅ Success
  ↓
Log results:
  "Webhook processed: 3/4 destinations succeeded
  Failed: Google Sheets (rate limit - will retry)"
```

---

### Pattern 22: API Rate Limit Management

**Use Case:** Make many API calls while respecting rate limits

**When to Use:**
- Batch processing large datasets
- Syncing thousands of records
- API has strict rate limits

**Flow Diagram:**
```
TRIGGER: Batch job started (manual or schedule)
  ↓
[fetch_all_items_to_process]
  ↓
[split_into_batches_based_on_rate_limit]
  ↓
[for_each_batch]
  ├─→ [make_api_calls_up_to_rate_limit]
  ├─→ [wait_for_rate_limit_window_to_reset]
  └─→ [continue_to_next_batch]
  ↓
[collect_all_results_and_handle_any_failures]
```

**Key Nodes:**
1. **Batch size calculation:** If limit is 100 calls/min, batch = 100
2. **Rate limiting:** Track calls made, pause when limit reached
3. **Wait/delay:** Sleep until rate limit window resets
4. **Retry logic:** If call fails due to rate limit, back off and retry
5. **Progress tracking:** Log how many items processed

**Considerations:**
- **Sliding window vs fixed window:** Does limit reset every minute? Or per call?
- **Burst allowance:** Some APIs allow bursts then throttle
- **Multiple endpoints:** Different endpoints may have different limits
- **Cost optimization:** Batch operations where possible (1 call = 100 records vs 100 calls = 100 records)

**Example:**
```
Trigger: Enrich 5,000 contacts with Clearbit data
  ↓
Fetch contacts:
  5,000 contacts need enrichment
  ↓
Check Clearbit rate limit:
  100 API calls per 60 seconds
  ↓
Split into batches:
  Batch 1: contacts 1-100
  Batch 2: contacts 101-200
  ...
  Batch 50: contacts 4,901-5,000
  ↓
Process Batch 1:
  For each of 100 contacts:
    - Call Clearbit API
    - Store enriched data
  Time elapsed: ~30 seconds (100 calls made)
  ↓
Wait before next batch:
  Rate limit window: 60 seconds
  Time elapsed: 30 seconds
  Remaining wait: 30 seconds
  → Sleep for 30 seconds
  ↓
Process Batch 2:
  (Same as Batch 1)
  ↓
Continue until all 50 batches processed
  ↓
Total time: 50 batches * 60 seconds = 50 minutes
Results: 4,856 enriched (97%), 144 failed (API returned no data)
```

---

This workflow patterns library provides proven templates for the most common automation scenarios. Adapt these patterns to your specific use case by:

1. Copying the flow diagram
2. Renaming nodes to match your systems
3. Adding your specific business logic to decision points
4. Implementing error handling appropriate for your needs

For more advanced patterns and custom use cases, refer to the other reference documents in this directory.
