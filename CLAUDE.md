# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A German number pronunciation practice web application. The app uses Web Speech API to speak German numbers, and users practice by typing what they hear. Built with a React frontend (Vite) and Node.js/Express backend.

## Development Commands

```bash
# Setup and installation
npm run install:all          # Install dependencies for root, backend, and frontend

# Development
npm run dev                  # Start both backend and frontend dev servers concurrently
npm run dev:backend          # Start backend only (port 3001)
npm run dev:frontend         # Start frontend only (port 3000)

# Backend-specific
cd backend
npm run dev                  # Start with nodemon (hot reload)
npm start                    # Start production server

# Frontend-specific
cd frontend
npm run dev                  # Start Vite dev server
npm run build                # Build for production
npm run lint                 # Run ESLint
npm run lint -- --fix        # Fix ESLint issues

# Testing and cleanup
npm test                     # Run tests in both backend and frontend
npm run clean                # Remove all node_modules and lock files
```

## Architecture

### Backend (Port 3001)

**Entry point:** `backend/server.js`

**Core logic:** `backend/utils/germanNumbers.js` - Contains German number conversion rules:
- 0-12: Special words (null, eins, zwei, drei...)
- 13-19: ones + "zehn" (dreizehn, vierzehn...)
- 20-99: ones + "und" + tens (dreiundzwanzig)
- 100-999: hundreds word + remainder (einhundert, zweihundertdrei)
- 1000: "eintausend"
- Decimals: integer + "Komma" + digits read separately

**Data persistence:** History records stored in `backend/data/history.json` (max 1000 records)

**API Endpoints:**
- `GET /api/number?min=0&max=100&decimal=false&decimalPlaces=1` - Get random German number
- `POST /api/check` - Validate user answer (body: `{answer, correctAnswer}`)
- `POST /api/history` - Save practice record
- `GET /api/history?limit=50&offset=0` - Get history with pagination
- `DELETE /api/history` - Clear all history
- `GET /api/health` - Health check

### Frontend (Port 3000)

**Entry point:** `frontend/src/main.jsx` → `App.jsx`

**Main component:** `NumberPractice.jsx` - Orchestrates the entire practice flow
- Fetches numbers from backend
- Uses Web Speech API via `utils/tts.js` to speak German
- Manages practice state (current number, user answer, statistics)
- Handles settings persistence in localStorage

**Supporting components:**
- `AnswerInput.jsx` - Input field for user answers
- `SettingsPanel.jsx` - Number range and decimal configuration
- `PracticeHistory.jsx` - Display past practice records

**TTS module:** `frontend/src/utils/tts.js`
- Browser compatibility check for Web Speech API
- German voice selection (prefers voices with 'de' lang or 'German' in name)
- Speech parameters: rate=0.8, pitch=1, volume=1, lang='de-DE'

### Key Data Flow

1. User clicks "播放数字" → Frontend calls `speakGermanText()` with German word
2. User submits answer → Frontend POSTs to `/api/check` with answer and correctAnswer
3. Backend validates → Returns `{isCorrect: boolean}`
4. Frontend saves to history → POSTs to `/api/history`
5. Statistics update in component state

## Important Implementation Details

### German Number Generation
The `germanNumbers.js` module is the core algorithm. When modifying number ranges or rules, always test edge cases:
- Boundaries: 0, 12, 13, 19, 20, 99, 100, 999, 1000
- Special cases: numbers ending in 1 (use "eins" vs "ein")
- Decimals: ensure "Komma" separator and digit-by-digit reading

### TTS Browser Compatibility
- Chrome/Edge: Full support
- Safari: Basic support
- Firefox: Limited (requires manual config)
- Always check `isTTSSupported()` before attempting speech
- Fallback: App shows warning if TTS unsupported

### Settings Persistence
User settings stored in `localStorage` under key `'german-number-settings'`:
```javascript
{
  min: 0,
  max: 100,
  allowDecimal: false,
  decimalPlaces: 1
}
```

### History Management
- Records stored server-side in JSON file
- Auto-limits to 1000 most recent records
- Each record includes: number, germanWord, userAnswer, isCorrect, timestamp, settings

## Common Tasks

### Adding a new API endpoint
1. Add route handler in `backend/server.js`
2. Follow existing error handling pattern with try-catch
3. Return consistent JSON format: `{success, data}` or `{error}`
4. Update server.js startup console output with new endpoint

### Modifying number generation logic
1. Edit `backend/utils/germanNumbers.js`
2. Test with edge cases (see above)
3. Consider impact on TTS pronunciation

### Adding new practice features
1. Add state to `NumberPractice.jsx` component
2. Create new component in `frontend/src/components/` if needed
3. Update settings schema if requires persistence
4. Update API if backend logic needed

### Debugging TTS issues
1. Check browser console for voice availability: `speechSynthesis.getVoices()`
2. Use `getSpeechStatus()` from `tts.js` to inspect TTS state
3. Test in Chrome first (best support)
4. Check if user interaction required before TTS (some browsers block autoplay)

## Code Conventions

- Backend: CommonJS modules (`require`/`module.exports`)
- Frontend: ES modules (`import`/`export`)
- React: Functional components with Hooks
- State management: React useState/useEffect (no external state library)
- Error handling: Always wrap async operations in try-catch
- API responses: Consistent JSON structure with error field
- Component files: One component per file, default export

## Notes

- This is not a git repository (no version control configured)
- No test files currently exist despite test scripts
- Frontend dev server proxies API requests to backend:3001
- Port conflicts: Ensure 3000 and 3001 are available
- Data directory (`backend/data/`) created automatically on first run
