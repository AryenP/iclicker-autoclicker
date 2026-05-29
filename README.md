# AutoClicker: Record & Replay

A Chrome extension that lets you record exact click positions on any webpage and play them back automatically — perfect for surveys, repetitive forms, or any task involving repeated clicks.

> **Built by [Aryen Palkar](https://github.com/AryenP) · UC San Diego**

---

## Features

- **Visual click recording** — click anywhere on the page to record exact positions, shown as numbered markers
- **Ordered playback** — clicks fire in the exact sequence you recorded
- **Configurable delay** — set the pause between each click in seconds
- **Loop mode** — repeat the full sequence indefinitely
- **Reorder & delete** — rearrange steps or remove individual ones from the popup
- **Persisted steps** — your recorded sequence is saved across page reloads

---

## Installation

### Option A — Chrome Web Store *(recommended)*
Search **"AutoClicker: Record & Replay"** on the [Chrome Web Store](https://chrome.google.com/webstore) and click **Add to Chrome**.

### Option B — Manual install
1. Go to the [Releases](../../releases) page and download the latest ZIP
2. Unzip the file to get the `autoclicker-extension` folder
3. Open Chrome → `chrome://extensions` → enable **Developer mode**
4. Click **Load unpacked** and select the folder

---

## How to Use

### 1. Record your clicks
1. Navigate to the page you want to automate
2. Click the **AutoClicker** icon in the Chrome toolbar
3. Press **⏺ Start Recording** — a purple outline and crosshair cursor appear on the page
4. Click each spot you want to automate in order — numbered markers will appear
5. When done, click the red **⏹ Stop Recording** button (top-right of the page)

### 2. Play back
1. Reopen the popup — your recorded steps are listed in order
2. Set the **delay** between clicks (in seconds)
3. Toggle **Loop** to repeat the sequence forever
4. Press **▶ Play**

### 3. Manage steps
| Action | How |
|---|---|
| Reorder | ▲ / ▼ buttons on each step |
| Delete one step | ✕ button |
| Delete all | **Clear All Steps** |

---

## Tips

- Use a delay of 1–2 sec on pages that animate or load content between clicks
- The active step highlights in **orange** during playback so you can follow along
- Steps persist automatically — closing and reopening the popup won't lose them

---

## Privacy

This extension stores data **locally only** — no data is ever sent to any server. See the full [Privacy Policy](privacy.html).

---

## Credits

Built by **Aryen Palkar** · UC San Diego  
[GitHub](https://github.com/AryenP) · [Repository](https://github.com/AryenP/autoclicker-record-replay)

---

## License

MIT
