let steps = [];
let mode = 'idle';

const dot     = document.getElementById('dot');
const btnRec  = document.getElementById('btnRec');
const btnPlay = document.getElementById('btnPlay');
const btnStop = document.getElementById('btnStop');
const btnClear= document.getElementById('btnClear');
const listEl  = document.getElementById('step-list');
const delayEl = document.getElementById('delay');
const loopEl  = document.getElementById('loop');

// ── Send to content script ───────────────────────────────────

function send(msg) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tabId = tabs[0]?.id;
    if (!tabId) return;
    chrome.tabs.sendMessage(tabId, msg, () => {
      const err = chrome.runtime.lastError?.message ?? '';
      // Only inject when there is genuinely no receiver (not just a missing sendResponse)
      if (err.includes('Receiving end does not exist') || err.includes('Could not establish connection')) {
        chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] }, () => {
          if (!chrome.runtime.lastError) chrome.tabs.sendMessage(tabId, msg);
        });
      }
    });
  });
}

// ── UI rendering ─────────────────────────────────────────────

function renderSteps() {
  listEl.innerHTML = '';
  steps.forEach((step, i) => {
    const row = document.createElement('div');
    row.className = 'step-row' + (i === currentStep ? ' active' : '');

    const num = document.createElement('div');
    num.className = 'step-num';
    num.textContent = i + 1;

    const info = document.createElement('div');
    info.className = 'step-info';
    info.innerHTML = `
      <div class="step-label">${step.label || 'Click'}</div>
      <div class="step-coords">(${step.x}, ${step.y})</div>`;

    const arrows = document.createElement('div');
    arrows.className = 'step-arrows';
    const up = document.createElement('button');
    up.textContent = '▲'; up.title = 'Move up';
    up.disabled = i === 0;
    up.addEventListener('click', () => send({ type: 'MOVE_STEP', from: i, to: i - 1 }));
    const dn = document.createElement('button');
    dn.textContent = '▼'; dn.title = 'Move down';
    dn.disabled = i === steps.length - 1;
    dn.addEventListener('click', () => send({ type: 'MOVE_STEP', from: i, to: i + 1 }));
    arrows.append(up, dn);

    const del = document.createElement('button');
    del.className = 'btn-del'; del.textContent = '✕'; del.title = 'Delete';
    del.addEventListener('click', () => send({ type: 'DELETE_STEP', id: step.id }));

    row.append(num, info, arrows, del);
    listEl.appendChild(row);
  });
}

let currentStep = -1;

function applyState(state) {
  mode = state.mode || 'idle';
  steps = state.steps || [];
  currentStep = state.currentStep ?? -1;

  // Dot color
  dot.className = mode === 'recording' ? 'rec' : mode === 'playing' ? 'play' : '';

  // Record button
  btnRec.textContent = mode === 'recording' ? '⏹  Stop Recording' : '⏺  Start Recording';
  btnRec.classList.toggle('recording', mode === 'recording');

  // Play/Stop
  btnPlay.disabled = mode === 'playing' || steps.length === 0;
  btnStop.disabled = mode !== 'playing';

  renderSteps();
}

// ── Events ───────────────────────────────────────────────────

btnRec.addEventListener('click', () => {
  if (mode === 'recording') send({ type: 'STOP_REC' });
  else send({ type: 'START_REC' });
});

btnPlay.addEventListener('click', () => {
  send({
    type: 'PLAY',
    steps,
    delay: parseFloat(delayEl.value) || 1,
    loop: loopEl.checked,
  });
});

btnStop.addEventListener('click', () => send({ type: 'STOP_PLAY' }));

btnClear.addEventListener('click', () => send({ type: 'CLEAR' }));

// ── Init & live updates ──────────────────────────────────────

chrome.storage.local.get('acState', ({ acState }) => {
  applyState(acState || {});
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.acState) {
    applyState(changes.acState.newValue || {});
  }
});
