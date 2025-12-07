<!--
SYNC IMPACT REPORT
==================
Version Change: Template → 1.0.0
Created Sections:
  - Core Principles: 5 educational technology principles
  - Educational Standards: Content quality requirements
  - Development Practices: Technical guidelines
  - Governance: Amendment and compliance procedures

Templates Status:
  ✅ plan-template.md - reviewed, aligns with principles
  ✅ spec-template.md - reviewed, aligns with educational focus
  ✅ tasks-template.md - reviewed, supports AI-first workflow

Follow-up Actions:
  - None - all placeholders filled
  - Constitution ready for use
-->

# TeachLeague Constitution

## Core Principles

### I. Teacher Empowerment
AI augments teacher expertise, never replaces it. Every AI-generated output must be:
- Editable and customizable by teachers
- Transparent about sources and methodology
- Designed to save time while maintaining pedagogical quality
- Respectful of teacher autonomy and professional judgment

**Rationale**: Teachers are the subject matter experts. Technology serves their needs, not the other way around.

### II. Backward Design Methodology
All lesson planning features MUST follow backward design principles:
1. Start with clear, measurable learning objectives
2. Define assessment criteria that demonstrate mastery
3. Design instruction and activities that lead to objectives
4. Integrate specific, attributed resources throughout

**Rationale**: Backward design ensures coherent, purposeful lessons aligned with learning goals. This is non-negotiable for educational quality.

### III. Resource Attribution & Credit
Every resource used in generated content MUST be:
- Properly attributed to the original course creator
- Linked with exact URLs to source materials
- Integrated meaningfully, not just listed
- Balanced across media types (40% documents, 30% videos minimum)

**Rationale**: Respects intellectual property, builds trust with course creators, and ensures quality resource integration.

### IV. Security & Privacy First
All sensitive data MUST be protected:
- API keys stored server-side only (Cloud Functions, Secret Manager)
- No credentials in client-side code or version control
- Build artifacts scanned for leaked secrets before deployment
- Regular security audits of dependencies

**Rationale**: Protects user data, prevents API abuse, and maintains platform integrity.

### V. Production-Ready Output
AI-generated content MUST be immediately usable:
- No meta-commentary about the generation process
- No explanations of unused resources
- Clear formatting with markdown headings
- Complete lesson plans ready for classroom use

**Rationale**: Teachers need practical, ready-to-use materials. Meta-discussion wastes their time.

## Educational Standards

### Content Quality Requirements
- All lesson plans include specific learning objectives
- Assessments demonstrate student mastery with exemplary responses
- Activities are age-appropriate for specified grade levels
- Resources are relevant and properly integrated (not superficial mentions)
- Warm-ups are open-ended to encourage critical thinking

### AI Generation Standards
- Use minimum 5-7 specific resource links per lesson plan
- Extract 25+ relevant resources before selection
- Prefer curriculum documents and course creators' materials
- Avoid generic recommendations ("search YouTube for...")
- Resource relevance scoring: exact keyword match (highest priority) > partial match > base relevance

## Development Practices

### Code Organization
- React components in `src/components/`
- Utility functions in `src/utils/`
- Redux state management in `src/app/` and `src/features/`
- Cloud Functions in `functions/` directory
- Environment-specific configs use Firebase emulators for local development

### Testing & Quality
- Security vulnerabilities resolved immediately (0 critical, <10 high)
- Build process validates no secrets in production bundle
- Firebase emulator for local function testing
- React 18.x maintained (avoid React 19 until security patches available)

### Deployment Pipeline
- GitHub Actions: build → test → deploy
- Firebase Hosting for frontend (React build)
- Cloud Functions v2 for backend APIs
- Secrets managed via Google Cloud Secret Manager
- Node.js 18.x for CI/CD and Cloud Functions

## Governance

### Amendment Process
- Constitution changes require documentation of rationale
- Version increments follow semantic versioning:
  - **MAJOR**: Breaking changes to core principles
  - **MINOR**: New principles or significant expansions
  - **PATCH**: Clarifications, wording improvements
- All PRs must verify compliance with constitution principles

### Compliance Review
- Features that violate backward design are rejected
- Resource attribution is mandatory and verified
- Security vulnerabilities block deployment
- AI outputs tested for production readiness before release

### Development Guidance
- Use spec-kit workflow: constitution → specify → plan → tasks → implement
- Clarify ambiguities before planning
- Cross-artifact consistency checks before implementation
- Quality checklists for requirement validation

**Version**: 1.0.0 | **Ratified**: 2025-12-07 | **Last Amended**: 2025-12-07
