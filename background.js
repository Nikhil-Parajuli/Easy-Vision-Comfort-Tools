// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-extension') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const hostname = new URL(tab.url).hostname;
    
    const { siteSettings = {} } = await chrome.storage.local.get('siteSettings');
    const currentEnabled = siteSettings[hostname] ?? true;
    
    siteSettings[hostname] = !currentEnabled;
    await chrome.storage.local.set({ siteSettings });
    
    chrome.tabs.sendMessage(tab.id, {
      action: 'toggleSite',
      enabled: !currentEnabled
    });
  }
});