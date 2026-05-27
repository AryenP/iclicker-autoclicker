# iClicker AutoClicker

A Chrome extension that lets you record exact click positions on any webpage and play them back automatically — great for iClicker quizzes, surveys, or any repetitive clicking task.

## Features

- **Click recording** — click anywhere on the page to record exact positions, shown as numbered markers
- **Ordered playback** — clicks fire in sequence, one after the other
- **Configurable delay** — set seconds between each click
- **Loop mode** — repeat the sequence indefinitely
- **Reorder & delete** — rearrange steps or remove individual ones from the popup
- **Persisted steps** — your recorded sequence survives page reloads

## Installation

> The extension is not on the Chrome Web Store. Install it manually in two steps.

### Step 1 — Download

1. Go to the [Releases](../../releases) page
2. Download the latest `iclicker-autoclicker.zip`
3. Unzip the file — you'll get a folder called `autoclicker-extension`

Or clone the repo:
```bash
git clone https://github.com/AryenP/iclicker-autoclicker.git
```

### Step 2 — Load in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `autoclicker-extension` folder

The AutoClicker icon will appear in your Chrome toolbar.

## How to Use

### 1. Record your clicks
1. Navigate to the target page (e.g. an iClicker quiz)
2. Click the **AutoClicker** icon in the toolbar
3. Press **⏺ Start Recording** — a purple outline and crosshair cursor appear
4. Click each spot on the page you want to automate, in order — numbered markers appear
5. Click the red **⏹ Stop Recording** button in the top-right of the page

### 2. Configure & play
1. Reopen the popup — your recorded steps are shown in the list
2. Set the **delay** between clicks (in seconds)
3. Toggle **Loop** if you want the sequence to repeat forever
4. Press **▶ Play**

### 3. Manage steps
- **▲ / ▼** to reorder steps
- **✕** to delete a step
- **Clear All Steps** to start fresh

## Tips

- Right-click an element → Inspect to find its position if needed
- Use a longer delay (2–3 sec) on slower-loading pages
- The active step highlights in orange during playback
- Your steps are saved automatically — they persist even if you close and reopen the popup

## Screenshots

> Coming soon

## License

MIT
