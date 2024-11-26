import React from 'react';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { Select } from './Select';
import { useLanguage } from '../contexts/LanguageContext';
import { Type, ArrowUpDown, TextQuote } from 'lucide-react';

interface ReadModeSectionProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
}

const fonts = [
  { value: 'system-ui', label: 'System Default' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'times', label: 'Times New Roman' },
  { value: 'arial', label: 'Arial' },
  { value: 'verdana', label: 'Verdana' },
  { value: 'helvetica', label: 'Helvetica' },
  { value: 'courier', label: 'Courier' }
];

const themes = [
  { value: 'default', label: 'Default (White)', bg: '#ffffff', text: '#000000' },
  { value: 'sepia', label: 'Sepia', bg: '#f4ecd8', text: '#5b4636' },
  { value: 'dark', label: 'Dark', bg: '#1a1a1a', text: '#e0e0e0' },
  { value: 'high-contrast', label: 'High Contrast', bg: '#000000', text: '#ffffff' }
];

export function ReadModeSection({
  enabled,
  setEnabled,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight
}: ReadModeSectionProps) {
  const { t } = useLanguage();
  const [font, setFont] = React.useState('system-ui');
  const [letterSpacing, setLetterSpacing] = React.useState(0);
  const [theme, setTheme] = React.useState('default');
  const [isTextOnly, setIsTextOnly] = React.useState(false);
  const [isFocusRead, setIsFocusRead] = React.useState(false);

  const handleSettingChange = (settings: any) => {
    const updatedSettings = {
      enabled,
      fontSize,
      lineHeight,
      font,
      letterSpacing,
      theme,
      isTextOnly,
      isFocusRead,
      ...settings
    };

    // Update local state
    if ('font' in settings) setFont(settings.font);
    if ('letterSpacing' in settings) setLetterSpacing(settings.letterSpacing);
    if ('theme' in settings) setTheme(settings.theme);
    if ('isTextOnly' in settings) setIsTextOnly(settings.isTextOnly);
    if ('isFocusRead' in settings) setIsFocusRead(settings.isFocusRead);

    // Send to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateReadMode',
          settings: updatedSettings
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Enable Read Mode</label>
        <Switch checked={enabled} onCheckedChange={(checked) => {
          setEnabled(checked);
          handleSettingChange({ enabled: checked });
        }} />
      </div>

      {enabled && (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Type className="w-4 h-4" />
                Font Family
              </label>
              <Select
                options={fonts}
                value={font}
                onChange={(value) => handleSettingChange({ font: value })}
                placeholder="Select font..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Type className="w-4 h-4" />
                Font Size
              </label>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => {
                  setFontSize(value);
                  handleSettingChange({ fontSize: value });
                }}
                min={12}
                max={32}
                step={1}
              />
              <span className="text-sm text-gray-500">{fontSize}px</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                Line Height
              </label>
              <Slider
                value={[lineHeight]}
                onValueChange={([value]) => {
                  setLineHeight(value);
                  handleSettingChange({ lineHeight: value });
                }}
                min={1}
                max={2}
                step={0.1}
              />
              <span className="text-sm text-gray-500">{lineHeight}x</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <TextQuote className="w-4 h-4" />
                Letter Spacing
              </label>
              <Slider
                value={[letterSpacing]}
                onValueChange={([value]) => handleSettingChange({ letterSpacing: value })}
                min={0}
                max={5}
                step={0.5}
              />
              <span className="text-sm text-gray-500">{letterSpacing}px</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <Select
                options={themes}
                value={theme}
                onChange={(value) => handleSettingChange({ theme: value })}
                placeholder="Select theme..."
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Text Only Mode</label>
              <Switch
                checked={isTextOnly}
                onCheckedChange={(checked) => handleSettingChange({ isTextOnly: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Focus Read Mode</label>
              <Switch
                checked={isFocusRead}
                onCheckedChange={(checked) => handleSettingChange({ isFocusRead: checked })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}