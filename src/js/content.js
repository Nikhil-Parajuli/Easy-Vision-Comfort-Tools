import { ReadMode } from './readMode.js';
import { Magnifier } from './magnifier.js';

// Initialize state and modules
const state = {
  colorBlind: {
    mode: 'normal',
    enabled: false
  }
};

const readMode = new ReadMode();
const magnifier = new Magnifier();

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

// Initialize magnifier
magnifier.init();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'updateColorBlind':
      state.colorBlind = { ...state.colorBlind, ...request.settings };
      applyColorBlindFilter(state.colorBlind);
      break;
    case 'updateReadMode':
      readMode.apply(request.settings);
      break;
    case 'updateMagnifier':
      magnifier.update(request.settings);
      break;
  }
});

// Initialize with stored settings
chrome.storage.local.get(['state'], ({ state: savedState }) => {
  if (savedState?.colorBlind) {
    state.colorBlind = savedState.colorBlind;
    applyColorBlindFilter(state.colorBlind);
  }
  if (savedState?.readMode) {
    readMode.apply(savedState.readMode);
  }
  if (savedState?.magnifier) {
    magnifier.update(savedState.magnifier);
  }
});