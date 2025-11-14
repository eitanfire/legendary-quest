The following instructions are for agents working on this codebase.

# Agent Identity & Sessions

## Agent Identification

Before starting work, each agent will identify itself with an available label from the phonetic alphabet: Alpha, Bravo, Charlie, Delta, Echo, Foxtrot, Golf, Hotel, India, Juliet, Kilo, Lima, Mike, November, Oscar, Papa, Quebec, Romeo, Sierra, Tango, Uniform, Victor, Whiskey, X-ray, Yankee, Zulu

Agent identities are session-based. When starting a new session:

1. Check `<root>/agents/registry.md` for available identities using the list above
2. Claim an available identity by updating the registry (add a row to the table)
3. Create a session notes file: `<root>/agents/sessions/{agent-id}-{YYYY-MM-DD-HHMM}.md`

## Registry Management

The `<root>/agents/registry.md` file tracks:

1. **Active agent sessions** - who is working on what
2. **Task ID Registry** - latest task ID number for each area to avoid conflicts

### Agent Sessions Table

```markdown
| Agent ID | Started          | Last Active      | Current Task | Status |
| -------- | ---------------- | ---------------- | ------------ | ------ |
| Alpha    | 2025-01-15 10:30 | 2025-01-15 11:45 | #123         | Active |
```

**Update the agent sessions table:**

- When starting a task (update "Last Active" and "Current Task" with GitHub issue number)
- When completing a task (update "Last Active" and set "Current Task" to "None")
- No automatic timeout - agents remain active until session ends

When updating:

- Update "Last Active" when starting or completing tasks
- Update "Current Task" with the task ID you're working on
- Set Status to "Active" when working, "Idle" when waiting

### Task ID Registry Table

```markdown
| Area     | Latest ID | Last Updated | Updated By |
| -------- | --------- | ------------ | ---------- |
| REDACTOR | 025       | 2025-10-13   | Alpha      |
```

**Update the Task ID Registry table:**

- When creating a new task, increment the latest ID for that area
- Update the table with the new ID, current date, and your agent ID
- This prevents multiple agents from reusing the same task ID numbers

## Session Notes

Create a session notes file for handoff context: `<root>/agents/sessions/{agent-id}-{YYYY-MM-DD-HHMM}.md`

Include:

- Tasks worked on
- Key decisions made
- Blockers encountered
- Context for next agent
- References to related files/decisions

# Decisions (ADR)

Every architectural or significant technical decision will be recorded in the `<root>/decisions/` folder using Architecture Decision Records (ADR).

## Naming Convention

`<root>/decisions/{NNN}-{short-title}.md` (e.g., `<root>/decisions/001-use-hono-framework.md`)

## ADR Template

```markdown
# {Number}. {Title}

Date: YYYY-MM-DD
Status: [Proposed | Accepted | Deprecated | Superseded by ADR-XXX]
Deciders: [Agent IDs]
Tags: [architecture | tooling | process | security | performance]

## Context

What is the issue we're facing? What factors are driving this decision?

## Decision

What did we decide? Be specific and actionable.

## Consequences

### Positive

What becomes easier or better as a result?

### Negative

What becomes harder or what do we lose?

## Alternatives Considered

What other options did we evaluate and why were they not chosen?

## References

- Related ADRs
- External documentation
- Discussion links
```

## ADR Guidelines

- A single agent can create and accept a decision. If the decision is not obvious, the agent should consult with the user.
- When superseding a decision, link to the replacement ADR
- Use tags for categorization: `architecture`, `tooling`, `process`, `security`, `performance`, etc.
- Keep decisions focused and atomic

# Task Management

**We use GitHub Issues as the single source of truth for all tasks.**

**All GitHub interactions must use the Official GitHub MCP Server** instead of the `gh` CLI tool. The GitHub MCP Server provides a comprehensive set of tools for managing repositories, issues, pull requests, workflows, and more. Fallback to `gh` only if necessary.

For installation and configuration details, see [github/github-mcp-server](https://github.com/github/github-mcp-server).

See [GitHub Issues Workflow Guide](../docs/GITHUB-ISSUES-WORKFLOW.md) for complete documentation.

## Quick Start

**Note:** Use the Official GitHub MCP Server for all GitHub interactions. The GitHub MCP Server provides comprehensive tools for managing issues, pull requests, repositories, and more. For installation and configuration details, see [github/github-mcp-server](https://github.com/github/github-mcp-server).

### Finding Tasks

Use the GitHub MCP Server's `list_issues` or `search_issues` tools:

```typescript
// Find available tasks in a specific area
list_issues({
  owner: 'owner',
  repo: 'repo',
  labels: ['status:not-started', 'area:redactor'],
  state: 'open',
})

// Find all available tasks
list_issues({
  owner: 'owner',
  repo: 'repo',
  labels: ['status:not-started'],
  state: 'open',
})

// Find high-priority tasks
list_issues({
  owner: 'owner',
  repo: 'repo',
  labels: ['priority:high', 'status:not-started'],
  state: 'open',
})
```

### Claiming a Task

Use the GitHub MCP Server's `update_issue` and `add_issue_comment` tools:

```typescript
// Step 1: Get current issue details to preserve existing metadata
const issue = get_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
})

// Step 2: Update issue - change status label and assign yourself
// Preserve all other existing labels
const existingLabels = issue.labels.map(l => l.name)
const updatedLabels = existingLabels
  .filter(l => !l.startsWith('status:')) // Remove old status
  .concat(['status:in-progress']) // Add new status

update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  labels: updatedLabels,
  assignees: ['@me'],
})

// Step 3: Add a comment
add_issue_comment({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  body: 'Claiming this task - Agent Bravo',
})

// Step 4: Update registry
// Edit agents/registry.md to set Current Task to #123
```

### Working on a Task

```bash
# Reference issue in commits
git commit -m "feat(redactor): add feature (#123)"
```

Use the GitHub MCP Server's `add_issue_comment` and `update_issue` tools for progress updates:

```typescript
// Add progress updates
add_issue_comment({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  body: 'Implemented core logic. Working on tests.',
})

// If blocked - preserve existing labels while updating status
const issue = get_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
})

const existingLabels = issue.labels.map(l => l.name)
const updatedLabels = existingLabels
  .filter(l => !l.startsWith('status:'))
  .concat(['status:blocked'])

update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  labels: updatedLabels,
})

add_issue_comment({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  body: 'Blocked: Waiting for API clarification. See #124',
})

// If you discover the issue is actually a duplicate
update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  state: 'closed',
  state_reason: 'duplicate',
  duplicate_of: 456, // The original issue number
})
```

### Completing a Task

**Important:** Before committing and creating a PR:

1. **Run the full validation suite** to ensure all checks pass
2. **Ask user for approval** before committing to GitHub
3. **Only commit files** that the current agent has worked on (multiple agents may be working concurrently)

Use the GitHub MCP Server's `create_pull_request` and `update_issue` tools:

```typescript
// Create PR that closes the issue
create_pull_request({
  owner: 'owner',
  repo: 'repo',
  title: 'Add feature',
  body: 'Closes #123',
  head: 'feature-branch',
  base: 'main',
})

// Mark as needs review
update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  labels: ['status:needs-review' /* other existing labels */],
})

// After PR merges and checks pass, automatically close the issue if confident
// the issue has been fully addressed
update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  state: 'closed',
  state_reason: 'completed',
})

// Update changelog with issue reference
// Update registry to set Current Task to "None"
```

## Label System

### Priority Labels

- `priority:high` - Critical/blocking
- `priority:medium` - Important but not blocking
- `priority:low` - Nice to have

### Status Labels

- `status:not-started` - Ready to be picked up
- `status:in-progress` - Currently being worked on
- `status:blocked` - Waiting on something
- `status:needs-review` - Ready for review

### Area Labels

- `area:redactor` - Redactor package
- `area:auth` - Authentication system
- `area:api` - API layer (Hono)
- `area:client` - Client application (Vite + Tempo)
- `area:infra` - Infrastructure (SST, AWS)
- `area:docs` - Documentation
- `area:pdf` - PDF processing
- `area:ui` - UI components
- `area:view` - Views/Pages

### Native Issue Types (not labels)

- **Bug** - Something isn't working
- **Feature** - New feature or enhancement
- **Documentation** - Documentation improvements
- **Task** - General task or chore
- **Question** - Further information is requested

## Issue Metadata

When creating or updating issues, use all relevant metadata to provide context and organization. **Only set metadata when the value is clear and appropriate** - do not force values if uncertain.

### Available Metadata Fields

#### Type (Native GitHub Issue Type)

Set the issue type when creating issues using `create_issue`:

- Use `type: "Bug"` for defects or errors
- Use `type: "Feature"` for new functionality or enhancements
- Use `type: "Documentation"` for documentation updates
- Use `type: "Task"` for general work items
- **Omit if unclear** - GitHub will default to a standard issue

#### Labels (Required)

Always include these label categories:

- **Status**: `status:not-started`, `status:in-progress`, `status:blocked`, `status:needs-review`
- **Area**: `area:redactor`, `area:auth`, `area:api`, `area:client`, `area:infra`, `area:docs`, `area:pdf`, `area:ui`, `area:view`
- **Priority**: `priority:high`, `priority:medium`, `priority:low`

Additional labels (use when applicable):

- Technical labels: `bug`, `enhancement`, `refactor`, `performance`, `security`
- Workflow labels: `good-first-issue`, `help-wanted`, `breaking-change`

#### Assignees

- Assign yourself when claiming a task: `assignees: ["@me"]`
- Assign specific users when delegating: `assignees: ["username"]`
- **Leave empty** if the task is not yet claimed

#### Milestone

Set milestone when the issue is part of a specific release or project phase:

- Use milestone number (e.g., `milestone: 1` for milestone #1)
- Check existing milestones using GitHub MCP Server's repository tools
- **Omit if unclear** which milestone the issue belongs to

#### Projects

Add issues to GitHub Projects for tracking and organization:

- Use GitHub MCP Server's `add_project_item` tool after creating the issue
- Requires: project number, item type ("issue"), and the issue's internal ID
- **Only add** if you know which project should track this work
- Example:
  ```typescript
  add_project_item({
    owner: 'owner',
    owner_type: 'org', // or 'user'
    project_number: 1,
    item_type: 'issue',
    item_id: 12345, // The issue's node ID, not the issue number
  })
  ```

#### Dependencies (Issue Relationships)

Document dependencies in the issue body using GitHub's task list syntax:

- **Blocks**: List issues that are blocked by this issue
- **Blocked by**: List issues that must be completed first
- **Related to**: List related issues for context

Example in issue body:

```markdown
## Dependencies

**Blocked by:**

- #120 - API endpoint must be implemented first
- #121 - Database schema must be updated

**Blocks:**

- #125 - UI implementation depends on this

**Related:**

- #118 - Similar work in different area
```

For sub-issues (parent-child relationships), use GitHub MCP Server's sub-issue tools:

```typescript
// Add a sub-issue to a parent issue
add_sub_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123, // parent issue
  sub_issue_id: 456, // child issue's ID (not number)
})

// List sub-issues
list_sub_issues({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
})
```

#### Duplicate Issues

When marking an issue as duplicate:

```typescript
update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  state: 'closed',
  state_reason: 'duplicate',
  duplicate_of: 456, // The issue number this duplicates
})
```

### Metadata Best Practices

1. **Be Conservative**: Only set metadata you're confident about
2. **Check First**: Use `get_issue` to see existing metadata before updating
3. **Preserve Existing**: When updating labels, include existing labels you want to keep
4. **Document Uncertainty**: If unsure about metadata, mention it in a comment
5. **Update as Needed**: Metadata can be updated as understanding improves

### When to Edit vs. Comment

**Edit the original issue** when:

- Original assumptions no longer hold
- Requirements have changed significantly
- The scope has expanded or contracted
- Technical approach needs to be revised
- Acceptance criteria need major updates
- Dependencies have changed

**Add comments** when:

- Providing progress updates
- Asking questions or clarifications
- Documenting decisions made during implementation
- Noting minor discoveries or adjustments
- Communicating with other agents or users

#### Example: Radical Issue Update

```typescript
// When you discover the original approach won't work
const issue = get_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
})

// Update the issue body with revised information
update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  body: `## Description

~~Add email redaction using regex patterns~~ **[UPDATED]**

After investigation, regex patterns are insufficient for reliable email detection.
Implementing a proper email parser using a validated library instead.

## Context
- **Related files**: packages/redactor/src/email-parser.ts (changed from patterns.ts)
- **Related ADR**: decisions/008-email-parsing-library.md (new)
- **Related issues**: #120

## Original Approach (Abandoned)
- ~~Use regex for email detection~~
- **Why abandoned**: Regex cannot handle all valid email formats per RFC 5322

## New Approach
- Use email-addresses library for parsing
- Validate against RFC 5322 standard
- Handle edge cases (quoted strings, comments, etc.)

## Dependencies

**Blocked by:**
- #130 - Need to evaluate and approve email-addresses library (new dependency)

## Acceptance Criteria
- [x] ~~Detect email addresses using regex pattern~~ (abandoned)
- [ ] Integrate email-addresses library
- [ ] Parse and validate emails per RFC 5322
- [ ] Redact emails with configurable replacement
- [ ] Add unit tests for complex email formats
- [ ] Update documentation
- [ ] Add ADR documenting library choice

## Breaking Changes
This changes the redaction API to be async (library uses async parsing).`,
})

// Add a comment explaining the update
add_issue_comment({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  body: `**Issue Updated - Approach Changed**

After attempting the regex-based approach, discovered it cannot handle valid but complex email formats. Updated the issue description to reflect the new approach using a proper email parsing library.

Key changes:
- Switched from regex to email-addresses library
- Added new dependency approval requirement (#130)
- API will become async (breaking change)
- Added new ADR requirement

cc @user for approval of the new approach.`,
})

// Update labels to reflect breaking change
const existingLabels = issue.labels.map(l => l.name)
update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  labels: existingLabels.concat(['breaking-change']),
})
```

**Benefits of editing the issue:**

- Single source of truth remains accurate
- New readers don't need to read through comment history
- Acceptance criteria stay current
- Dependencies are clearly visible
- Strikethrough shows what changed and why

## Task ID Format

Tasks use the format `[AREA-NNN]` in the issue title:

- `[REDACTOR-025]` - Redactor task #25
- `[AUTH-004]` - Auth task #4
- `[API-001]` - API task #1

**To avoid ID conflicts:**

1. **Check** `<root>/agents/registry.md` for the latest task ID in your area
2. **Increment** the number by 1 for your new task
3. **Update** the Task ID Registry table in `registry.md` with:
   - The new ID number
   - Current date (YYYY-MM-DD)
   - Your agent ID

Reference in commits and changelogs using the GitHub issue number:

- Commit: `feat(redactor): add feature (#123)`
- Changelog: `[2025-10-12, Bravo, #123] Add feature`

## Creating New Tasks

**Before creating a new task:**

1. Check `<root>/agents/registry.md` Task ID Registry for the latest ID in your area
2. Increment the number by 1 for your new task ID
3. Create the issue using the GitHub MCP Server's `create_issue` tool with appropriate metadata
4. Update the Task ID Registry in `registry.md` with the new ID, date, and your agent ID
5. (Optional) Add to project or set up dependencies if applicable

### Basic Example

```typescript
// Step 1 & 2: Check registry.md - if REDACTOR latest is 025, use 026

// Step 3: Create the issue with basic metadata
create_issue({
  owner: 'owner',
  repo: 'repo',
  title: '[REDACTOR-026] Add email redaction support',
  type: 'Feature', // Only if clearly a feature
  labels: ['area:redactor', 'priority:medium', 'status:not-started'],
  body: `## Description

Add support for detecting and redacting email addresses in documents.

## Context
- **Related files**: packages/redactor/src/patterns.ts
- **Related ADR**: decisions/003-redaction-patterns.md
- **Related issues**: #120

## Acceptance Criteria
- [ ] Detect email addresses using regex pattern
- [ ] Redact emails with configurable replacement
- [ ] Add unit tests for email detection
- [ ] Update documentation`,
})

// Step 4: Update registry.md Task ID Registry table
// Change: | REDACTOR   | 025       | 2025-10-13   | Alpha      |
// To:     | REDACTOR   | 026       | 2025-10-14   | Bravo      |
```

### Example with Full Metadata

```typescript
// Create issue with milestone, assignee, and dependencies
create_issue({
  owner: 'owner',
  repo: 'repo',
  title: '[API-015] Implement user authentication endpoint',
  type: 'Feature',
  labels: ['area:api', 'priority:high', 'status:not-started', 'security'],
  assignees: ['@me'], // Claiming immediately
  milestone: 2, // Part of v2.0 milestone
  body: `## Description

Implement POST /api/auth/login endpoint with JWT token generation.

## Context
- **Related files**: packages/api/src/routes/auth.ts
- **Related ADR**: decisions/005-jwt-authentication.md

## Dependencies

**Blocked by:**
- #120 - Database user schema must be implemented first
- #121 - JWT utility functions must be available

**Blocks:**
- #125 - Frontend login form depends on this endpoint

## Acceptance Criteria
- [ ] POST /api/auth/login accepts email and password
- [ ] Validates credentials against database
- [ ] Returns JWT token on success
- [ ] Returns appropriate error codes
- [ ] Add integration tests
- [ ] Update API documentation

## Security Considerations
- Password must be hashed using bcrypt
- Rate limiting must be applied
- Failed attempts should be logged`,
})

// Optional: Add to project if applicable
add_project_item({
  owner: 'owner',
  owner_type: 'org',
  project_number: 1,
  item_type: 'issue',
  item_id: 12345, // Use the issue's node ID from the create response
})
```

### Example: Bug Report

```typescript
create_issue({
  owner: 'owner',
  repo: 'repo',
  title: '[REDACTOR-027] Email redaction fails on uppercase domains',
  type: 'Bug',
  labels: ['area:redactor', 'priority:high', 'status:not-started', 'bug'],
  body: `## Description

Email addresses with uppercase domain names (e.g., user@EXAMPLE.COM) are not being detected by the redaction pattern.

## Steps to Reproduce
1. Create document with email: user@EXAMPLE.COM
2. Run redactor
3. Email is not redacted

## Expected Behavior
Email should be redacted regardless of case

## Actual Behavior
Only lowercase domain emails are redacted

## Context
- **Related files**: packages/redactor/src/patterns.ts
- **Introduced in**: #026

## Acceptance Criteria
- [ ] Update regex to be case-insensitive
- [ ] Add test cases for uppercase domains
- [ ] Add test cases for mixed case
- [ ] Verify existing tests still pass`,
})
```

## Managing Issue Metadata Throughout Task Lifecycle

**Important**: When assumptions change radically, **edit the original issue body** rather than just adding comments. This keeps the issue description as the single source of truth. Use strikethrough (`~~text~~`) to show what changed and explain why.

### When to Update Metadata

Update issue metadata as your understanding of the task evolves:

#### Priority Changes

If you discover a task is more/less urgent than initially thought:

```typescript
const issue = get_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
})

const updatedLabels = issue.labels
  .map(l => l.name)
  .filter(l => !l.startsWith('priority:'))
  .concat(['priority:high']) // Escalating priority

update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  labels: updatedLabels,
})

add_issue_comment({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  body: 'Escalating priority to high - discovered this blocks multiple other features.',
})
```

#### Updating Issue Description for Scope Changes

If requirements, approach, or scope change significantly, **edit the issue body**:

```typescript
const issue = get_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
})

// Rewrite the issue body with updated information
// Use strikethrough for abandoned approaches
update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  title: '[API-015] Implement user authentication endpoint', // Can update title too
  body: `## Description

~~Implement basic username/password authentication~~ **[UPDATED]**

After security review, implementing OAuth2 + JWT authentication instead of basic auth.

## Original Approach (Abandoned)
- ~~Username/password stored in database~~
- **Why abandoned**: Security team requires OAuth2 for enterprise compliance

## New Approach
- OAuth2 authorization code flow
- JWT tokens for session management
- Support for multiple identity providers

## Context
- **Related files**: packages/api/src/routes/oauth.ts (changed from auth.ts)
- **Related ADR**: decisions/009-oauth2-implementation.md (new)
- **Security review**: #145

## Acceptance Criteria
- [x] ~~Basic username/password endpoint~~ (abandoned)
- [ ] OAuth2 authorization endpoint
- [ ] OAuth2 token endpoint
- [ ] JWT token generation and validation
- [ ] Support Google and GitHub providers
- [ ] Add integration tests
- [ ] Update API documentation
- [ ] Security audit

## Breaking Changes
This is a breaking change from the original plan. All authentication flows must be updated.`,
})

// Add comment explaining the major update
add_issue_comment({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  body: `**Major Update: Scope Changed**

Updated issue description to reflect OAuth2 requirement from security review.
Original basic auth approach has been abandoned.

Please review the updated acceptance criteria and timeline impact.`,
})
```

#### Adding Dependencies

If you discover dependencies while working:

```typescript
// Update the issue body to document dependencies
const issue = get_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
})

update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  body:
    issue.body +
    `

## Dependencies (Updated)

**Blocked by:**
- #130 - Database migration must complete first (discovered during implementation)`,
})
```

#### Milestone Assignment

If you realize the task should be part of a milestone:

```typescript
update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  milestone: 2, // Assign to milestone #2
})
```

#### Adding Technical Labels

Add technical labels as you learn more about the work:

```typescript
const issue = get_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
})

const updatedLabels = issue.labels
  .map(l => l.name)
  .concat(['breaking-change', 'performance']) // Add technical context

update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  labels: updatedLabels,
})
```

### Metadata Checklist Before Closing

Before closing an issue, verify metadata is accurate:

- [ ] **Status label**: Should be `status:needs-review` or removed (will auto-close)
- [ ] **Type**: Correctly reflects the work done
- [ ] **Labels**: All relevant technical labels are present
- [ ] **Milestone**: Set if part of a release
- [ ] **Dependencies**: Documented in issue body or as sub-issues
- [ ] **Duplicate**: If duplicate, marked with `duplicate_of`
- [ ] **Related issues**: Cross-referenced in comments or body

### Common Metadata Patterns

#### Feature Implementation

```typescript
labels: ['area:X', 'priority:medium', 'status:in-progress', 'enhancement']
type: 'Feature'
milestone: 2 // If part of a release
```

#### Bug Fix

```typescript
labels: ['area:X', 'priority:high', 'status:in-progress', 'bug']
type: 'Bug'
// No milestone needed unless targeting specific release
```

#### Breaking Change

```typescript
labels: [
  'area:X',
  'priority:high',
  'status:in-progress',
  'breaking-change',
  'enhancement',
]
type: 'Feature'
milestone: 3 // Major version bump
```

#### Documentation

```typescript
labels: ['area:docs', 'priority:low', 'status:in-progress', 'documentation']
type: 'Documentation'
// Usually no milestone
```

# Contracts

The `<root>/contracts/` folder contains TypeScript type definitions that define system boundaries and interfaces.

## Organization

Organize by domain:

- `<root>/contracts/api/{domain}.ts` - API request/response shapes
- `<root>/contracts/events/{domain}.ts` - Event payloads
- `<root>/contracts/database/{domain}.ts` - Database schemas

## Contract Format

```typescript
/**
 * {Domain} Contracts
 *
 * @version 1.0.0
 * @lastUpdated 2025-01-15
 * @owner Alpha
 */

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * Login response payload
 */
export interface LoginResponse {
  token: string
  expiresAt: string // ISO 8601 datetime
  user: {
    id: string
    email: string
  }
}
```

## Contract Guidelines

- Use pure TypeScript interfaces/types (not runtime validation)
- Include JSDoc comments for clarity
- Version contracts in the file header
- Update version when making breaking changes
- Contracts are documentation-focused, not executable code

# Changelogs

## Organization

One changelog per feature area: `<root>/changelogs/{feature-area}.md`

## Format

Follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# {Feature Area} Changelog

## [Unreleased]

### Added

- [2025-01-15, Alpha, #123] JWT-based authentication system

### Changed

- [2025-01-15, Bravo, #125] Updated password validation rules

### Fixed

- [2025-01-15, Charlie, #127] Login endpoint error handling

### Deprecated

- [2025-01-15, Alpha, #124] Session-based auth (use JWT instead)

## [1.0.0] - 2025-01-10

### Added

- Initial authentication module
```

## Changelog Guidelines

- Add entries as you complete tasks
- Include: date, agent ID, GitHub issue number, and description
- Use semantic versioning for releases
- Keep entries concise but informative

## Migration Guides

For breaking changes, create separate migration guides: `changelogs/migrations/{feature-area}-{version}.md`

Include:

- What changed and why
- Step-by-step migration instructions
- Code examples (before/after)
- Timeline and deprecation notices

# Testing & Quality Assurance

## Test-Driven Development (TDD)

Follow TDD approach for all features:

1. **Write tests first**: Create failing tests that define expected behavior
2. **Implement**: Write minimal code to make tests pass
3. **Refactor**: Improve code while keeping tests green

## Test Coverage

- **Unit tests**: Add wherever it makes sense to test individual functions/modules
- **Integration tests**: Add wherever it makes sense to test component interactions
- No strict coverage percentage, but aim for comprehensive coverage of critical paths

## Validation Suite

Before marking any task as complete, run the full validation suite:

```bash
pnpm run format    # or equivalent formatter
pnpm run lint      # ESLint or equivalent
pnpm run typecheck # TypeScript type checking
pnpm run build     # Ensure code compiles
pnpm run test      # Run all tests
```

All checks must pass before a task is considered done.

## Test Organization

- Place tests alongside source files: `{filename}.test.ts`
- Use descriptive test names that explain behavior
- Follow AAA pattern: Arrange, Act, Assert
- Keep tests focused and independent

# Tech Stack & Standards

## Core Technologies

- **Runtime**: Node.js (latest LTS)
- **Language**: TypeScript (latest stable)
- **API Framework**: Hono
- **Validation**: Zod (for runtime validation in implementation)
- **UI**: Tempo-ts (@tempots/dom, @tempots/std, @tempots/ui) or React
- **Build Tool**: Vite
- **Test Framework**: Vitest

## Dependency Management

- **Default**: Use latest stable versions of all libraries
- **Exceptions**: Only pin to older versions if there's a specific technical reason
- **Documentation**: Document version constraints in ADRs when needed

## Architecture Patterns

### Functional Programming

- Prefer functional style: pure functions, immutability, composition
- Use closures, higher-order functions, and functional utilities
- Avoid nested class hierarchies and excessive state mutation
- Be pragmatic: optimize for performance when functional patterns introduce overhead

### Validation

- Use Zod schemas for all runtime validation
- Define schemas close to where they're used
- Export types using `z.infer<typeof Schema>`

### Error Handling

- Handle errors explicitly via Result types (from @tempots/std) or try/catch
- Avoid throwing errors in pure functions
- Use domain-level error models for business logic errors

### Code Organization

- Follow clean architecture principles
- Separate concerns: domain logic, infrastructure, presentation
- Keep modules focused and cohesive

## Naming Conventions

- **Functions**: verbs in camelCase (`createUser`, `validateEmail`)
- **Types/Interfaces**: PascalCase (`UserSchema`, `LoginRequest`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`, `API_BASE_URL`)
- **Files**: kebab-case (`user-service.ts`, `auth-middleware.ts`)

## Code Quality

- No unused imports or variables
- No comments without value (code should be self-documenting)
- Avoid premature abstraction
- Avoid `any` type; if unavoidable, annotate clearly with rationale

# Documentation

## TypeScript Documentation

Follow TypeScript best practices for documentation:

- **Public APIs**: Require JSDoc comments
- **Complex logic**: Add inline comments explaining the "why", not the "what"
- **Type definitions**: Document non-obvious types and their constraints

Example:

```typescript
/**
 * Authenticates a user and returns a JWT token.
 *
 * @param credentials - User email and password
 * @returns JWT token and user information
 * @throws {AuthenticationError} If credentials are invalid
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  // Implementation
}
```

## README Files

Each major directory should have a README.md explaining:

- Purpose of the directory
- Key files and their responsibilities
- How to use/test the code
- Any special considerations

## Architecture Diagrams

- Keep diagrams to a minimum
- Use Mermaid for diagrams when needed
- Focus on high-level architecture, not implementation details
- Store diagrams in `docs/architecture/`

## Inline Documentation

Add inline comments for:

- Complex algorithms
- Non-obvious business logic
- Performance optimizations
- Workarounds or temporary solutions (with TODO/FIXME tags)

# General Instructions

## Commit and PR Guidelines

### Approval Before Committing

**Always ask the user for approval before committing to GitHub.** This is critical because:

- Multiple agents may be working on the same codebase concurrently
- Changes should be reviewed before being pushed to the repository
- User may want to verify the changes align with their expectations

### Selective File Commits

**Only commit files that the current agent has worked on.** When committing:

1. Identify which files were modified by your work
2. Only stage and commit those specific files
3. Do not commit files modified by other agents or unrelated changes
4. Use `git add <specific-files>` instead of `git add .`

Example:

```bash
# Good - selective commit
git add src/redactor/feature.ts src/redactor/feature.test.ts
git commit -m "feat(redactor): add new feature (#123)"

# Bad - commits everything
git add .
git commit -m "feat(redactor): add new feature (#123)"
```

### Auto-closing Issues

**Automatically close GitHub issues when you are confident that:**

1. The issue has been fully addressed
2. All validation checks are passing
3. The PR has been merged (if applicable)
4. All acceptance criteria have been met

Use the GitHub MCP Server's `update_issue` tool to close issues:

```typescript
update_issue({
  owner: 'owner',
  repo: 'repo',
  issue_number: 123,
  state: 'closed',
  state_reason: 'completed',
})
```

## Commit Format

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:

- `feat(auth): add JWT authentication`
- `fix(api): handle null user in login endpoint`
- `docs(readme): update installation instructions`
- `refactor(user-service): simplify validation logic`

**Task References**:
Include GitHub issue number in commit message:

```
feat(auth): add login endpoint (#123)
```

Or in commit body:

```
feat(auth): add login endpoint

Implements #123
```

## Workflow Summary

1. **Start session**: Claim agent ID, update registry, create session notes
2. **Pick task**: Find issue using GitHub MCP Server, claim it, update registry
3. **Work**: Follow TDD, reference contracts, make decisions as needed
4. **Update issue**: If assumptions change radically, edit the original issue body (not just comments)
5. **Document**: Update ADRs, changelogs, and session notes
6. **Validate**: Run full validation suite (all checks must pass)
7. **Seek approval**: Ask user for approval before committing to GitHub
8. **Commit**: Only commit files worked on by current agent (use conventional commits with issue references)
9. **Complete**: Create PR using GitHub MCP Server, update registry
10. **Auto-close**: When confident the issue is fully addressed and all checks pass, automatically close the issue

## Communication

- Keep session notes updated for handoff
- Document decisions in ADRs, not in chat or comments
- Reference GitHub issue numbers in commits and discussions
- Update issue status labels promptly to avoid conflicts
- **Edit issue descriptions** when requirements or approach changes significantly
- Use comments for progress updates and minor notes
