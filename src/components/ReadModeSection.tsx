import React from 'react';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { Select } from './Select';
import { useLanguage } from '../contexts/LanguageContext';
import { Type, ArrowUpDown, TextQuote, AlignLeft, AlignCenter, AlignJustify } from 'lucide-react';

interface ReadModeSectionProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
}

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
  const [textAlign, setTextAlign] = React.useState<'left' | 'center' | 'justify'>('left');
  const [isTextOnly, setIsTextOnly] = React.useState(false);
  const [isLineFocus, setIsLineFocus] = React.useState(false);

  const handleSettingChange = (settings: any) => {
    const updatedSettings = {
      enabled,
      fontSize,
      lineHeight,
      font,
      letterSpacing,
      textAlign,
      isTextOnly,
      isLineFocus,
      ...settings
    };

    // Update local state
    if ('font' in settings) setFont(settings.font);
    if ('letterSpacing' in settings) setLetterSpacing(settings.letterSpacing);
    if ('textAlign' in settings) setTextAlign(settings.textAlign);
    if ('isTextOnly' in settings) setIsTextOnly(settings.isTextOnly);
    if ('isLineFocus' in settings) setIsLineFocus(settings.isLineFocus);

    // Send to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, {
        action: 'updateReadMode',
        settings: updatedSettings
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{t('readMode.enable')}</label>
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
                {t('readMode.fontSize')}
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                {t('readMode.lineHeight')}
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <TextQuote className="w-4 h-4" />
                {t('readMode.letterSpacing')}
              </label>
              <Slider
                value={[letterSpacing]}
                onValueChange={([value]) => handleSettingChange({ letterSpacing: value })}
                min={0}
                max={5}
                step={0.5}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{t('readMode.textOnly')}</label>
              <Switch
                checked={isTextOnly}
                onCheckedChange={(checked) => handleSettingChange({ isTextOnly: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{t('readMode.lineFocus')}</label>
              <Switch
                checked={isLineFocus}
                onCheckedChange={(checked) => handleSettingChange({ isLineFocus: checked })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}