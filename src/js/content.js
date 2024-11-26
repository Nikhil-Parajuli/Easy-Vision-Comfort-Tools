// Initialize state
let state = {
  colorBlind: {
    mode: 'normal',
    enabled: false
  },
  readMode: {
    enabled: false,
    fontSize: 16,
    lineHeight: 1.5,
    font: 'system-ui',
    letterSpacing: 0,
    textAlign: 'left',
    maxWidth: 800,
    theme: {
      bg: '#ffffff',
      text: '#000000'
    },
    isTextOnly: false,
    isLineFocus: false
  },
  magnifier: {
    enabled: false,
    zoom: 2,
    circular: true
  }
};

// SVG filters for color vision deficiency simulation
const svgFilters = `
<svg style="display:none">
  <defs>
    <filter id="protanopia">
      <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="deuteranopia">
      <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="tritanopia">
      <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="protanomaly">
      <feColorMatrix type="matrix" values="0.817,0.183,0,0,0 0.333,0.667,0,0,0 0,0.125,0.875,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="deuteranomaly">
      <feColorMatrix type="matrix" values="0.8,0.2,0,0,0 0.258,0.742,0,0,0 0,0.142,0.858,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="tritanomaly">
      <feColorMatrix type="matrix" values="0.967,0.033,0,0,0 0,0.733,0.267,0,0 0,0.183,0.817,0,0 0,0,0,1,0"/>
    </filter>
  </defs>
</svg>`;

// Insert SVG filters
const filterContainer = document.createElement('div');
filterContainer.id = 'accessibility-filters';
filterContainer.innerHTML = svgFilters;
document.body.appendChild(filterContainer);

// Apply color blind filter
function applyColorBlindFilter(settings) {
  if (!settings.enabled || settings.mode === 'normal') {
    document.documentElement.style.filter = '';
    return;
  }

  const filters = {
    protanopia: 'url(#protanopia)',
    deuteranopia: 'url(#deuteranopia)',
    tritanopia: 'url(#tritanopia)',
    monochromacy: 'grayscale(100%)',
    protanomaly: 'url(#protanomaly)',
    deuteranomaly: 'url(#deuteranomaly)',
    tritanomaly: 'url(#tritanomaly)',
    achromatomaly: 'grayscale(50%)'
  };

  document.documentElement.style.filter = filters[settings.mode] || '';
}

// Apply read mode
function applyReadMode(settings) {
  const style = document.getElementById('accessibility-read-mode') || document.createElement('style');
  style.id = 'accessibility-read-mode';

  if (!settings.enabled) {
    style.remove();
    document.documentElement.style.removeProperty('--read-mode-max-width');
    return;
  }

  // Create content wrapper if it doesn't exist
  let wrapper = document.getElementById('accessibility-content-wrapper');
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = 'accessibility-content-wrapper';
    
    // Move body content to wrapper
    while (document.body.firstChild) {
      if (document.body.firstChild.id !== 'accessibility-filters') {
        wrapper.appendChild(document.body.firstChild);
      } else {
        document.body.appendChild(document.body.firstChild);
      }
    }
    document.body.appendChild(wrapper);
  }

  const css = `
    #accessibility-content-wrapper {
      font-family: ${settings.font} !important;
      font-size: ${settings.fontSize}px !important;
      line-height: ${settings.lineHeight} !important;
      letter-spacing: ${settings.letterSpacing}px !important;
      text-align: ${settings.textAlign} !important;
      max-width: ${settings.maxWidth}px !important;
      margin: 0 auto !important;
      padding: 20px !important;
      background-color: ${settings.theme.bg} !important;
      color: ${settings.theme.text} !important;
    }

    ${settings.isTextOnly ? `
      #accessibility-content-wrapper img,
      #accessibility-content-wrapper video,
      #accessibility-content-wrapper iframe,
      #accessibility-content-wrapper canvas,
      #accessibility-content-wrapper svg {
        display: none !important;
      }
    ` : ''}

    ${settings.isLineFocus ? `
      #accessibility-content-wrapper p,
      #accessibility-content-wrapper li {
        padding: 8px 0;
        transition: all 0.2s ease;
      }

      #accessibility-content-wrapper p:hover,
      #accessibility-content-wrapper li:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    ` : ''}
  `;

  style.textContent = css;
  document.head.appendChild(style);
}

// Initialize magnifier
function initializeMagnifier(settings) {
  let magnifier = document.getElementById('accessibility-magnifier');
  
  if (!settings.enabled) {
    magnifier?.remove();
    return;
  }

  if (!magnifier) {
    magnifier = document.createElement('div');
    magnifier.id = 'accessibility-magnifier';
    document.body.appendChild(magnifier);

    const content = document.createElement('div');
    content.id = 'accessibility-magnifier-content';
    magnifier.appendChild(content);
  }

  magnifier.style.cssText = `
    position: fixed;
    width: 150px;
    height: 150px;
    border: 2px solid #007AFF;
    pointer-events: none;
    z-index: 999999;
    display: none;
    overflow: hidden;
    ${settings.circular ? 'border-radius: 50%;' : 'border-radius: 8px;'}
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;

  const content = magnifier.querySelector('#accessibility-magnifier-content');
  content.style.cssText = `
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: white;
  `;

  function updateMagnifier(e) {
    if (!settings.enabled) return;

    const x = e.clientX;
    const y = e.clientY;

    magnifier.style.display = 'block';
    magnifier.style.left = `${x - 75}px`;
    magnifier.style.top = `${y - 75}px`;

    const elementAtPoint = document.elementFromPoint(x, y);
    if (elementAtPoint && elementAtPoint !== magnifier) {
      const clone = elementAtPoint.cloneNode(true);
      content.innerHTML = '';
      content.appendChild(clone);
      content.style.transform = `scale(${settings.zoom})`;
      content.style.transformOrigin = 'center center';
    }
  }

  document.addEventListener('mousemove', updateMagnifier);
  document.addEventListener('mouseleave', () => {
    magnifier.style.display = 'none';
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'updateColorBlind':
      state.colorBlind = { ...state.colorBlind, ...request.settings };
      applyColorBlindFilter(state.colorBlind);
      break;
    case 'updateReadMode':
      state.readMode = { ...state.readMode, ...request.settings };
      applyReadMode(state.readMode);
      break;
    case 'updateMagnifier':
      state.magnifier = { ...state.magnifier, ...request.settings };
      initializeMagnifier(state.magnifier);
      break;
  }
  
  // Save state
  chrome.storage.local.set({ state });
});

// Initialize with stored settings
chrome.storage.local.get(['state'], ({ state: savedState }) => {
  if (savedState) {
    state = savedState;
    applyColorBlindFilter(state.colorBlind);
    applyReadMode(state.readMode);
    initializeMagnifier(state.magnifier);
  }
});