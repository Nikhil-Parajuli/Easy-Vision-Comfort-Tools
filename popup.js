document.addEventListener('DOMContentLoaded', async () => {
  const storage = chrome.storage.local;
  let currentSettings = await storage.get(['mode', 'darkMode', 'siteSettings']);
  
  // Initialize dark mode
  if (currentSettings.darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('darkModeToggle').classList.add('active');
  }

  // Dark mode toggle
  document.getElementById('darkModeToggle').addEventListener('click', async () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    await storage.set({ darkMode: !isDark });
  });

  // Vision mode buttons
  const modeButtons = document.querySelectorAll('.mode-button');
  modeButtons.forEach(button => {
    if (button.dataset.mode === currentSettings.mode) {
      button.classList.add('active');
    }

    button.addEventListener('click', async () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      
      const mode = button.dataset.mode;
      await storage.set({ mode });
      
      // Apply the filter to the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(tab.id, { 
        action: 'updateMode', 
        mode 
      });
    });
  });

  // Site toggle
  const siteToggle = document.getElementById('siteToggle');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const hostname = new URL(tab.url).hostname;
  
  siteToggle.checked = currentSettings.siteSettings?.[hostname] ?? true;
  
  siteToggle.addEventListener('change', async () => {
    const siteSettings = currentSettings.siteSettings || {};
    siteSettings[hostname] = siteToggle.checked;
    await storage.set({ siteSettings });
    
    chrome.tabs.sendMessage(tab.id, { 
      action: 'toggleSite',
      enabled: siteToggle.checked
    });
  });

  // Preview functionality
  const previewImage = document.querySelector('.preview-image');
  const colorStrip = document.querySelector('.color-strip');
  
  modeButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      const mode = button.dataset.mode;
      applyPreviewFilter(mode, previewImage);
      applyPreviewFilter(mode, colorStrip);
    });
    
    button.addEventListener('mouseleave', () => {
      const activeMode = document.querySelector('.mode-button.active').dataset.mode;
      applyPreviewFilter(activeMode, previewImage);
      applyPreviewFilter(activeMode, colorStrip);
    });
  });
});

function applyPreviewFilter(mode, element) {
  const filters = {
    normal: '',
    protanopia: 'url(#protanopia)',
    deuteranopia: 'url(#deuteranopia)',
    tritanopia: 'url(#tritanopia)',
    monochromacy: 'grayscale(100%)',
    protanomaly: 'url(#protanomaly)',
    deuteranomaly: 'url(#deuteranomaly)',
    tritanomaly: 'url(#tritanomaly)',
    achromatomaly: 'grayscale(50%)'
  };
  
  element.style.filter = filters[mode];
}