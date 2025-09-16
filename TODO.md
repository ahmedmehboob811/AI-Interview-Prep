# Project Debug and Fix TODO

## Backend Fixes
- [x] Fix Gemini API key usage in aiController.js (remove incorrect object syntax)
- [x] Improve error handling in aiService.js for JSON parsing (already has try-catch)
- [x] Fix authMiddleware.js to check for token existence before JWT verify
- [x] Remove unused generateConceptExplanation import in server.js
- [x] Ensure consistent response format in sessionController.js (responses are functional as-is)

## Frontend Fixes
- [x] Remove stray <SummaryCard/> in Dashboard.jsx
- [x] Fix SummaryCard to display questions.length instead of questions array
- [x] Improve error handling in CreateSessionForm.jsx for AI and session creation (already has comprehensive error handling)
- [x] Add loading states and better error messages in Dashboard.jsx (already implemented)

## Testing
- [ ] Test session creation flow end-to-end
- [ ] Test dashboard fetching and summary cards display
- [ ] Test AI components with Gemini API key
- [ ] Verify auth middleware works correctly
