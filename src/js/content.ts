import { colorModes, svgFilters } from './filters';

// Insert SVG filters into the page
document.body.insertAdjacentHTML('beforeend', svgFilters);

// Initialize extension state
let currentMode = 'normal';
let isEnabled = true;

// Apply color vision filter to the page
function applyFilter(mode: string) {
  if (!isEnabled) {
    document.documentElement.style.filter = '';
    return;
  }
  document.documentElement.style.filter = colorModes[mode as keyof typeof colorModes].filter;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateMode') {
    currentMode = request.mode;
    applyFilter(currentMode);
  } else if (request.action === 'toggleSite') {
    isEnabled = request.enabled;
    applyFilter(currentMode);
  }
});

// Initialize with stored settings
chrome.storage.local.get(['mode', 'siteSettings'], ({ mode, siteSettings }) => {
  const hostname = window.location.hostname;
  currentMode = mode || 'normal';
  isEnabled = siteSettings?.[hostname] ?? true;
  applyFilter(currentMode);
});