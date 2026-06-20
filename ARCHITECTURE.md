# Architecture

The app uses Expo Router for navigation and React Context for local application state.

## Key Areas

- `app/`: route screens and navigation layout.
- `components/`: reusable visual and form components.
- `context/`: app-wide habit and theme providers.
- `features/habits/`: domain types, storage, mock data, and habit calculations.
- `constants/`: color, typography, theme, and visual definitions.
- `utils/`: date and notification helpers.

AsyncStorage is the active persistence layer for the MVP. `habit.db.ts` contains a SQLite adapter scaffold so completions can later be queried independently for richer analytics.
