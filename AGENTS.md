# AGENTS.md — Autonomous Agent Operating Rules

## Project Objective
**Sashakt Rashtra Nirman (SRN)**: Enterprise-grade full-stack digital platform for NGO operations, volunteer management, community engagement, and donations. Consists of a React/Vite/Tailwind frontend (`artifacts/srn-website`) and an Express/Node/Prisma/PostgreSQL backend (`artifacts/srn-backend`).

## Operational Rules
- **Phase Discipline**: Always adhere to the active phase in `.planning/ROADMAP.md` and `.planning/STATE.md`.
- **No Infinite Loops**: Determine action, execute cleanly, verify with tests/build, and report. Never introduce circular state triggers or unchecked navigation loops.
- **Specification Fidelity**: Follow specifications strictly without skipping requirements or implementing mock/placeholder logic.
- **Persistent Memory**: Keep `.planning/STATE.md` updated after each plan or phase completion.
- **Strict Verification**: Always run `npm run build` or automated checks in the relevant subsystem before declaring a task complete.
