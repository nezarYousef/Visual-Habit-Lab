# Testing Checklist

Run the automated check first:

```bash
npm run typecheck
```

Then run the app:

```bash
npm run web
```

Open `http://localhost:8081`.

## Manual Flows

- Onboarding opens on first run.
- `Start my garden` opens the home screen.
- `Load sample garden` creates sample habits.
- `Demo` opens the demo screen.
- `Clear garden` asks for confirmation before deleting local habits.
- `New habit` opens the creation form.
- Empty habit names cannot be submitted.
- Duplicate habit names cannot be submitted.
- Custom category requires a category name.
- Invalid reminder time such as `25:99` is rejected.
- Valid reminder time such as `08:30` is accepted.
- Created habit opens its detail screen.
- Daily habit can be completed once today.
- Weekly habit can be completed once in the current 7-day period.
- Completed habits disable the completion button for the current period.
- Delete habit asks for confirmation and removes the habit.
- Garden items show healthy, at risk, or fading status.
- Stats screen shows weekly chart and breakdown panels.
- Light/dark toggle persists after refresh.

## Native Checks

- Open with Expo Go or an emulator.
- Create a habit with a valid reminder time.
- Accept notification permission when prompted.
- Confirm the app does not crash if permission is denied.
- Confirm SQLite sync does not affect habit saving.
