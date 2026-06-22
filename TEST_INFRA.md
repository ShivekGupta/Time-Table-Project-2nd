# E2E Test Infra: Phase 6 (Advanced AI Integrations)

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Floating AI Chatbot | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 2 | Auto-Generate Schedule | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 3 | Smart Flashcards | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 4 | Island Navigation & Transitions | Prompt | 5 | 5 | ✓ |

## Test Architecture
- Test runner: Custom Node.js script `test-e2e-phase6.js` utilizing Puppeteer to launch and interact with the application at `http://localhost:5173`.
- Test case format: Asynchronous functions asserting DOM states, computed styles, text contents, and class changes.
- Output: Console logs summarizing passes and failures. Pass/fail semantics: Script exits with code 0 if all tests pass, else 1.
- Setup: Starts `npm run dev` as a background child process, waits for the server, runs tests, and terminates the server.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | User opens floating chatbot, sends a message, closes it. | F1 | Medium |
| 2 | User navigates to Timetable/Assistant, auto-generates schedule. | F2 | Medium |
| 3 | User navigates to Exam Peak, flips flashcards, goes to next. | F3 | Medium |
| 4 | User navigates between School, College, Exam Peak, Masters deep islands without breaking map transitions. | F4 | High |
| 5 | Full Loop: Start at map, use chatbot, check schedule, do flashcards. | F1, F2, F3, F4 | High |

## Coverage Thresholds
- Tier 1: ≥5 per feature
- Tier 2: ≥5 per feature (where boundaries exist)
- Tier 3: Pairwise coverage of major feature interactions
- Tier 4: ≥5 realistic application scenarios
