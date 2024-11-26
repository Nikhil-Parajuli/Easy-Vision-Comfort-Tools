import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Switch } from './Switch';

interface ColorBlindSectionProps {
  activeMode: string;
  setActiveMode: (mode: string) => void;
  siteEnabled: boolean;
  setSiteEnabled: (enabled: boolean) => void;
}

export function ColorBlindSection({
  activeMode,
  setActiveMode,
  siteEnabled,
  setSiteEnabled
}: ColorBlindSectionProps) {
  const { t } = useLanguage();

  const handleModeChange = (mode: string) => {
    setActiveMode(mode);
    sendMessageToContentScript(mode, siteEnabled);
  };

  const handleSiteToggle = (enabled: boolean) => {
    setSiteEnabled(enabled);
    sendMessageToContentScript(activeMode, enabled);
  };

  const sendMessageToContentScript = (mode: string, enabled: boolean) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateColorBlind',
          settings: { mode, enabled }
        });
      }
    });
  };

  const colorModes = {
    normal: { icon: '👁️', filter: 'none' },
    protanopia: { icon: '🔴', filter: 'url(#protanopia)' },
    deuteranopia: { icon: '🟢', filter: 'url(#deuteranopia)' },
    tritanopia: { icon: '🔵', filter: 'url(#tritanopia)' },
    monochromacy: { icon: '⚫', filter: 'grayscale(100%)' },
    protanomaly: { icon: '🌅', filter: 'url(#protanomaly)' },
    deuteranomaly: { icon: '🌄', filter: 'url(#deuteranomaly)' },
    tritanomaly: { icon: '🌊', filter: 'url(#tritanomaly)' },
    achromatomaly: { icon: '🌫️', filter: 'grayscale(50%)' }
  };

  return (
    <div className="space-y-6">
      <div className="vision-modes grid grid-cols-3 gap-4">
        {Object.entries(colorModes).map(([id, { icon }]) => (
          <button
            key={id}
            onClick={() => handleModeChange(id)}
            className={`mode-button p-4 rounded-lg shadow transition-all ${
              activeMode === id
                ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="mode-icon text-2xl block mb-2">{icon}</span>
            <span className="mode-name text-sm font-medium">
              {t(`mode.${id}`)}
            </span>
          </button>
        ))}
      </div>

      <div className="preview-section bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">{t('preview')}</h2>
        <div className="preview-container space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Color Spectrum</h3>
            <div
              className="color-strip h-8 rounded"
              style={{
                background: 'linear-gradient(to right, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff00ff)',
                filter: colorModes[activeMode as keyof typeof colorModes]?.filter
              }}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Natural Image</h3>
            <img
              src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94"
              alt="Sunset landscape"
              className="w-full h-48 object-cover rounded"
              style={{
                filter: colorModes[activeMode as keyof typeof colorModes]?.filter
              }}
            />
          </div>
        </div>
      </div>

      <div className="site-settings bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{t('site.enable')}</label>
          <Switch 
            checked={siteEnabled} 
            onCheckedChange={handleSiteToggle}
          />
        </div>
      </div>
    </div>
  );
}