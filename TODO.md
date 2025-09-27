# TODO: Refactor to Content Script for CORS-Safe LinkedIn Fetches

## Overview
This updated TODO tracks the steps to resolve the network "failed" fetch errors (CORS/origin issues) by moving API calls to a content script injected into LinkedIn pages. The background script will coordinate by messaging the content script. This builds on previous fixes (imports, error handling). Previous steps (1-4) are complete and marked [x].

## Steps

- [x] Previous Steps 1-4: TypeScript imports fixed, error messages enhanced, background logging added.

- [x] Step 5: Update manifest.json:
  - Add "content_scripts" entry for src/content.ts matching "https://www.linkedin.com/*".
  - Add "scripting" permission (for potential dynamic injection, though static should suffice).

- [x] Step 6: Create src/content.ts:
  - Import types and utils (adapt caching if needed, but keep in background).
  - Implement message listener for actions like 'fetchConnections'.
  - Move getConnections, getProfileDetails, enrichConnections logic here (use window.fetch for page-context requests; auto-includes cookies).
  - Return data or errors via sendResponse.

- [x] Step 7: Update src/background.ts:
  - In 'getConnections' handler: Use chrome.tabs.query to find active LinkedIn tab; if found, send message {action: 'fetchConnections'} to its content script.
  - Handle response: Cache results, enrich if needed (or move enrichment to content), send to popup.
  - If no LinkedIn tab: Return error "Please open a LinkedIn tab and try again."
  - Remove direct fetchWithAuth/getCookies (now in content).

- [x] Step 8: Update vite.config.mjs (if needed):
  - Ensure content script is built (e.g., add input for 'content.ts' in rollup config for extension build).

- [ ] Step 9: Rebuild the extension (run `npm run build`), reload in chrome://extensions (Load unpacked > project root).
  - Test: Open linkedin.com (logged in), click popup – fetches should succeed in page network tab (no "failed").
  - Check popup for connections display; background console for coordination logs.
  - Edge cases: No LinkedIn tab (error message), offline (network error), cache hits.

## Notes
- After each step, confirm success (no TS errors, build succeeds).
- Test requires LinkedIn login in a tab; inspect LinkedIn page console for content script logs.
- If vite.config needs changes, read package.json first for build scripts.
