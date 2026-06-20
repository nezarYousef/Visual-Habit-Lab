# Architecture

The app uses Expo Router for navigation and React Context for local application state.

## Key Areas

- `app/`: route screens and navigation layout.
- `components/`: reusable visual and form components.
- `context/`: app-wide habit and theme providers.
- `features/habits/`: domain types, storage, mock data, and habit calculations.
- `constants/`: color, typography, theme, and visual definitions.
- `utils/`: date and notification helpers.
- `types/`: local ambient declarations used by dependencies that do not expose complete TypeScript declarations.

## State And Data

`HabitContext` owns the habit list, onboarding state, save/error state, and mutation methods. It uses a ref-backed current state to avoid stale closures when actions run quickly.

AsyncStorage is the primary persistence layer. Habit data is normalized when loaded so stale or partial records do not break the app.

SQLite completion sync is available on native through `habitDb.ts`. Web uses `habitDb.web.ts` as a no-op adapter so the web build does not load SQLite WASM assets.

## Habit Domain

The habit domain lives in `features/habits/habit.logic.ts`. It handles:

- draft validation
- normalization
- daily and weekly streaks
- period completion checks
- garden sorting
- statistics aggregation

## Platform Notes

Notifications are scheduled only on supported native platforms. Web safely skips notification scheduling.
