const _SK = 'acState_' + window.location.hostname;
const _MC = '__ac_marker';

// Runs on EVERY injection — restores markers without needing the popup open
chrome.storage.local.get(_SK, (data) => {
  const saved = data[_SK];
  if (!saved?.steps?.length) return;
  if (window.__acState) {
    window.__acState.steps = saved.steps;
    window.__acState.currentStep = saved.currentStep ?? -1;
  }
  document.querySelectorAll('.' + _MC).forEach(el => el.remove());
  saved.steps.forEach((step, i) => {
    const m = document.createElement('div');
    m.className = _MC;
    Object.assign(m.style, {
      position: 'fixed',
      left: `${step.x - 14}px`, top: `${step.y - 14}px`,
      width: '28px', height: '28px', borderRadius: '50%',
      background: i === (saved.currentStep ?? -1) ? '#f59e0b' : '#a78bfa',
      border: '2px solid #fff', color: '#fff', fontSize: '11px', fontWeight: '700',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: '2147483645', pointerEvents: 'none',
      fontFamily: 'system-ui,sans-serif', boxShadow: '0 2px 8px rgba(0,0,0,.5)',
      transition: 'background .15s',
    });
    m.textContent = i + 1;
    document.body.appendChild(m);
  });
});

// Guard — event listeners and state only set up once per page load
if (!window.__acLoaded) {
window.__acLoaded = true;

const AC = window.__acState = { mode: 'idle', steps: [], currentStep: -1 };
let playAbort = false;
let stopBtn = null;
let overlay = null;

const SITE_KEY = _SK;
const MC = _MC;

// ── Markers ─────────────────────────────────────────────────

function renderMarkers() {
  document.querySelectorAll('.' + MC).forEach(el => el.remove());
  AC.steps.forEach((step, i) => {
    const m = document.createElement('div');
    m.className = MC;
    const active = i === AC.currentStep;
    Object.assign(m.style, {
      position: 'fixed',
      left: `${step.x - 14}px`, top: `${step.y - 14}px`,
      width: '28px', height: '28px', borderRadius: '50%',
      background: active ? '#f59e0b' : '#a78bfa',
      border: '2px solid #fff', color: '#fff', fontSize: '11px', fontWeight: '700',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: '2147483645', pointerEvents: 'none',
      fontFamily: 'system-ui,sans-serif', boxShadow: '0 2px 8px rgba(0,0,0,.5)',
      transition: 'background .15s',
    });
    m.textContent = i + 1;
    document.body.appendChild(m);
  });
}

// ── Recording ────────────────────────────────────────────────

function onPageClick(e) {
  if (stopBtn && (e.target === stopBtn || stopBtn.contains(e.target))) return;
  e.preventDefault();
  e.stopImmediatePropagation();

  const label = e.target
    ? (e.target.textContent?.trim().slice(0, 30) || e.target.tagName)
    : '';
  AC.steps.push({ id: Date.now(), x: e.clientX, y: e.clientY, label });
  renderMarkers();
  persist();
}

function startRecording() {
  AC.steps = [];
  AC.currentStep = -1;
  AC.mode = 'recording';
  document.documentElement.style.cursor = 'crosshair';

  overlay = document.createElement('div');
  overlay.id = '__ac_ol';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0',
    zIndex: '2147483644', pointerEvents: 'none',
    outline: '3px solid #a78bfa', outlineOffset: '-3px',
    background: 'rgba(167,139,250,.06)',
  });
  document.body.appendChild(overlay);

  stopBtn = document.createElement('button');
  stopBtn.textContent = '⏹  Stop Recording';
  Object.assign(stopBtn.style, {
    position: 'fixed', top: '14px', right: '14px',
    zIndex: '2147483647', background: '#ef4444', color: '#fff',
    border: 'none', borderRadius: '8px', padding: '8px 14px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    fontFamily: 'system-ui,sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,.35)',
  });
  stopBtn.addEventListener('click', e => {
    e.stopImmediatePropagation(); e.preventDefault(); stopRecording();
  }, { capture: true });
  document.body.appendChild(stopBtn);

  document.addEventListener('click', onPageClick, { capture: true });
  renderMarkers();
  persist();
}

function stopRecording() {
  AC.mode = 'idle';
  document.documentElement.style.cursor = '';
  document.removeEventListener('click', onPageClick, { capture: true });
  overlay?.remove(); overlay = null;
  stopBtn?.remove(); stopBtn = null;
  persist();
}

// ── Playback ─────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function play(steps, delaySec, loop) {
  AC.steps = steps;
  AC.mode = 'playing';
  playAbort = false;
  persist();

  do {
    for (let i = 0; i < AC.steps.length; i++) {
      if (playAbort) break;
      AC.currentStep = i;
      renderMarkers();
      persist();

      await sleep(delaySec * 1000);
      if (playAbort) break;

      const { x, y } = AC.steps[i];
      const el = document.elementFromPoint(x, y);
      if (el) {
        for (const t of ['mousedown', 'mouseup', 'click']) {
          el.dispatchEvent(new MouseEvent(t, {
            bubbles: true, cancelable: true, clientX: x, clientY: y,
          }));
        }
      }
    }
  } while (loop && !playAbort);

  AC.mode = 'idle';
  AC.currentStep = -1;
  renderMarkers();
  persist();
}

// ── Helpers ──────────────────────────────────────────────────

function persist() {
  chrome.storage.local.set({
    [SITE_KEY]: { mode: AC.mode, steps: AC.steps, currentStep: AC.currentStep },
  });
}

chrome.runtime.onMessage.addListener(msg => {
  switch (msg.type) {
    case 'START_REC':    startRecording(); break;
    case 'STOP_REC':     stopRecording(); break;
    case 'PLAY':         play(msg.steps, msg.delay, msg.loop); break;
    case 'STOP_PLAY':    playAbort = true; break;
    case 'DELETE_STEP':
      AC.steps = AC.steps.filter(s => s.id !== msg.id);
      renderMarkers(); persist(); break;
    case 'MOVE_STEP': {
      const { from, to } = msg;
      const [s] = AC.steps.splice(from, 1);
      AC.steps.splice(to, 0, s);
      renderMarkers(); persist(); break;
    }
    case 'CLEAR':
      AC.steps = []; renderMarkers(); persist(); break;
  }
});

} // end __acLoaded guard
