# ECVA Tournament Control Center

A web-based operational readiness platform for the ECVA Technology Department.

The application coordinates the technology workstreams required before, during, and after ECVA tournaments:

- Broadcast and streaming
- VIS and statistics
- Website and bulletins
- Technical operations

## Current Version

Development foundation: `v0.2`

## Run Locally

Because the application loads JSON data, serve the repository through a local web server rather than opening `index.html` directly.

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Project Structure

```text
index.html
assets/
  css/
  js/
data/
docs/
tournaments/
```

## Branching

- `main` — stable releases
- `development` — active development and review

See `docs/architecture.md` and `docs/roadmap.md` for implementation details.
