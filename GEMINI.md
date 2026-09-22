# Project Rules: Spec-Driven Development (GSD)

## Workflow Loop
1. **Plan**: Break down phases into atomic tasks (`PLAN.md`) with explicit verification gates and file change boundaries.
2. **Execute**: Implement modular, robust code with full TypeScript/JavaScript types, complete error handling, and tests.
3. **Verify**: Validate against Definition of Done (build checks via `npm run build` in `srn-website` or `srn-backend`, regression audits, manual checks).
4. **Ship**: Commit cleanly to git with conventional commit format (`feat:`, `fix:`, `refactor:`).
