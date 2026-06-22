# Project: Coursera Web gamification Phase 7

## Architecture
React project, using Tailwind CSS, Framer Motion, and Lucide React.
We are implementing three specific features:
1. Co-op Pomodoro Timer in `src/components/FocusMode.jsx`
2. Tinder-style Matchmaker in `src/components/CollegeFeatures.jsx`
3. Global Leaderboards in `src/components/ExamPrepFeatures.jsx`
4. Oracle Tutor (3D reactive character) in `src/components/GlobalCanvas.jsx` (or similar file handling the r3f canvas) connected to Chatbot UI.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Co-op Pomodoro | `src/components/FocusMode.jsx` toggle for Solo/Co-op and UI for 2-3 mock users. | none | IN_PROGRESS |
| 2 | M2: Matchmaker | `src/components/CollegeFeatures.jsx` swipeable cards with Pass/Connect buttons. | none | IN_PROGRESS |
| 3 | M3: Leaderboards | `src/components/ExamPrepFeatures.jsx` global leaderboard UI. | none | IN_PROGRESS |
| 4 | M4: Oracle Tutor | Create 3D character in GlobalCanvas, link to 2D chat UI state, trigger animations on chat. | none | PLANNED |

## Interface Contracts
These are strictly internal UI components and do not depend on external real APIs, relying on mocked state or local state.
