# Application Architecture

## Purpose

The ECVA Tournament Control Center is the operating platform for the ECVA Technology Department during indoor and beach championships. It coordinates Broadcast, VIS & Statistics, Website & Bulletins, and Technical Operations.

## Current Architecture

- `index.html` provides the application shell.
- `assets/css/` contains design tokens and interface styles.
- `assets/js/app.js` loads workflow data, renders the hierarchy, and calculates progress.
- `assets/js/storage.js` provides browser persistence and JSON export.
- `data/workflow.json` is the authoritative readiness workflow definition.
- `data/tournament-template.json` defines tournament metadata.

## Data Flow

1. The application loads `workflow.json`.
2. JavaScript renders phases, milestones, workstreams, and tasks.
3. Task completion is stored in browser local storage.
4. Completion rolls up automatically to milestones, phases, departments, and the dashboard.

## Planned Evolution

Browser storage will later be replaced by an API and MariaDB without changing the workflow presentation model. Tournament records, users, permissions, resources, incidents, equipment, and reports will become database-backed modules.
