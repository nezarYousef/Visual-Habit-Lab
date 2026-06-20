# Visual Habit Lab

Visual Habit Lab is a gamified habit tracker built with Expo and React Native. Each habit becomes a visual garden element that grows with streaks and fades when neglected.

## Features

- First-run onboarding
- Local habit storage with AsyncStorage
- SQLite completion sync on native, with a web-safe adapter
- Create, complete, delete, and inspect habits
- Daily and weekly habit logic
- Streak, level, status, and weekly completion tracking
- Garden health states: healthy, at risk, and fading
- Animated garden items
- Statistics dashboard with weekly chart, health breakdown, and category mix
- Sample garden loader
- Reminder scheduling on supported native platforms
- Persisted light and dark theme support

## Getting Started

```bash
npm install
npm run web
```

Open `http://localhost:8081` for the web build.

For native testing:

```bash
npm run start
```

Then open the project with Expo Go or an emulator.

## Quality Checks

```bash
npm run typecheck
```

Manual testing steps are documented in `TESTING.md`.
