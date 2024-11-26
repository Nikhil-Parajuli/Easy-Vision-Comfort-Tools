// Initialize state
let state = {
  colorBlind: {
    mode: 'normal',
    enabled: false
  },
  readMode: {
    enabled: false,
    fontSize: 16,
    lineHeight: 1.5
  },
  magnifier: {
    enabled: false,
    zoom: 2,
    circular: true
  }
};

// Create a single style element for read mode
const readModeStyle = document.createElement('style');
readModeStyle.id = 'accessibility-read-mode';
document.head.appendChild(readModeStyle);

// Create magnifier element
const magnifier = document.createElement('div');
magnifier.id = 'accessibility-magnifier';
magnifier.style.display = 'none';
document.body.appendChild(magnifier);

// Apply read mode styles
function applyReadMode(settings) {
  if (!settings.enabled) {
    readModeStyle.textContent = '';
    return;
  }

  const css = `
    body {
      font-size: ${settings.fontSize}px !important;
      line-height: ${settings.lineHeight} !important;
      max-width: 800px !important;
      margin: 0 auto !important;
      padding: 20px !important;
    }
  `;

  readModeStyle.textContent = css;
}

// Handle magnifier functionality
function handleMagnifier(e) {
  if (!state.magnifier.enabled) {
    magnifier.style.display = 'none';
    return;
  }

  const { clientX: x, clientY: y } = e;
  const size = 150;

  magnifier.style.cssText = `
    position: fixed;
    width: ${size}px;
    height: ${size}px;
    border: 2px solid #007AFF;
    pointer-events: none;
    z-index: 999999;
    overflow: hidden;
    ${state.magnifier.circular ? 'border-radius: 50%;' : 'border-radius: 8px;'}
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: block;
    left: ${x - size/2}px;
    top: ${y - size/2}px;
    background: white;
  `;

  // Create a clone of the content under the magnifier
  const elementAtPoint = document.elementFromPoint(x, y);
  if (elementAtPoint && elementAtPoint !== magnifier) {
    const rect = elementAtPoint.getBoundingClientRect();
    const x_ratio = (x - rect.left) / rect.width;
    const y_ratio = (y - rect.top) / rect.height;

    magnifier.style.backgroundImage = window.getComputedStyle(elementAtPoint).backgroundImage;
    magnifier.style.backgroundPosition = `${x_ratio * 100}% ${y_ratio * 100}%`;
    magnifier.style.backgroundSize = `${state.magnifier.zoom * 100}%`;
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'updateColorBlind':
      state.colorBlind = { ...state.colorBlind, ...request.settings };
      break;
    case 'updateReadMode':
      state.readMode = { ...state.readMode, ...request.settings };
      applyReadMode(state.readMode);
      break;
    case 'updateMagnifier':
      state.magnifier = { ...state.magnifier, ...request.settings };
      if (!state.magnifier.enabled) {
        magnifier.style.display = 'none';
      }
      break;
  }
});

// Initialize event listeners
document.addEventListener('mousemove', handleMagnifier);
document.addEventListener('mouseleave', () => {
  magnifier.style.display = 'none';
});

// Initialize with stored settings
chrome.storage.local.get(['state'], ({ state: savedState }) => {
  if (savedState) {
    state = savedState;
    applyReadMode(state.readMode);
  }
});