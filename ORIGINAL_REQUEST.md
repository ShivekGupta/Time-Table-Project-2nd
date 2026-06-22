# Original User Request

## Initial Request — 2026-06-22T20:44:48Z

Implement a 3D interactive "Treasure Chest" skill-based minigame inside the React Three Fiber global canvas to allow users to earn doubloons.

Working directory: c:/Users/SHIVEK/Pictures/Summer Internship/Coursera Web/Project
Integrity mode: development

## Requirements

### R1. Procedural 3D Treasure Chest
Create a procedural 3D Treasure Chest component inside the `GlobalCanvas`. The chest must have a base and a hinged lid.

### R2. Skill-Based Minigame Logic
The chest lid should open and close automatically at varying or rapid speeds using `useFrame` or `gsap`. The user must click (via `onClick` on the mesh) the chest *only while it is open* to successfully extract doubloons.

### R3. State Integration
If the user clicks successfully, update the global `treasureCount` (doubloons) in `App.jsx` (which will also trigger the existing particle burst effect).

## Acceptance Criteria

### Implementation Verification
- [ ] A 3D Treasure Chest is visible in the React Three Fiber scene, opening and closing automatically.
- [ ] Clicking the chest while open successfully increases the doubloon count.
- [ ] The application successfully builds (`npm run build`) and runs without fatal console errors.
