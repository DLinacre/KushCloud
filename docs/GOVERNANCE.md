# Project Governance

## Roles

| Role | Responsibility | Current |
|------|---------------|---------|
| **Maintainer** | Merge authority, release management, security response | [@DLinacre](https://github.com/DLinacre) |
| **Contributor** | Code contributions via PR | Community |
| **Reporter** | Bug reports, feature requests | Community |

## Decision-Making Process

1. **Minor changes** (bug fixes, docs, refactor): Maintainer self-merge or 1 approving review
2. **Feature additions**: Open a Feature Request issue first for discussion; PR requires maintainer approval
3. **Breaking changes**: Require an RFC-style discussion in GitHub Discussions before implementation
4. **Security fixes**: Handled privately via GitHub Security Advisories; patches released ASAP

## Release Authority

Only the Maintainer may:
- Push version tags (`v*`)
- Trigger production releases
- Merge to `main`

## Conflict Resolution

- Technical disagreements resolved through discussion in the PR/issue
- Maintainer has final decision authority
- Contributors may fork if they fundamentally disagree

## Project Continuity

- The project is MIT licensed — anyone may fork and maintain their own version
- If the Maintainer is inactive for >6 months, contributors may coordinate a community fork
