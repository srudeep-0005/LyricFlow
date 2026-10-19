# LyricFlow starter

This is a static, mobile-first frontend prototype. It supports local audio playback, pasted lyrics, a timed-line preview, manual line-start adjustment, and active-line highlighting.

## Important limitations
- It does NOT yet transcribe audio automatically.
- The initial timestamps are evenly distributed placeholders, not AI-generated alignment.
- It does not upload audio to a server.
- Do not describe this as an automatic synchronized-lyrics engine until the backend is connected and tested.

## Run locally
Open `index.html` in a modern browser. For deployment, publish these static files on a static hosting service.

## Next integration
Connect a backend endpoint that accepts authorized audio uploads, returns job IDs/status, and ultimately returns validated lyrics with timestamps and optional Romanization/translation. Keep all API keys on the backend, not in browser JavaScript.
