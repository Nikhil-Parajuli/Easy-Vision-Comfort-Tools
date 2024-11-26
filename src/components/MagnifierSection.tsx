import React from 'react';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { useLanguage } from '../contexts/LanguageContext';

interface MagnifierSectionProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  circular: boolean;
  setCircular: (circular: boolean) => void;
}

export function MagnifierSection({
  enabled,
  setEnabled,
  zoom,
  setZoom,
  circular,
  setCircular
}: MagnifierSectionProps) {
  const { t } = useLanguage();

  const handleSettingChange = (settings: Partial<MagnifierSectionProps>) => {
    const updatedSettings = {
      enabled,
      zoom,
      circular,
      ...settings
    };

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, {
        action: 'updateMagnifier',
        settings: updatedSettings
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{t('magnifier.enable')}</label>
        <Switch
          checked={enabled}
          onCheckedChange={(checked) => {
            setEnabled(checked);
            handleSettingChange({ enabled: checked });
          }}
        />
      </div>

      {enabled && (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('magnifier.zoom')}</label>
              <Slider
                value={[zoom]}
                onValueChange={([value]) => {
                  setZoom(value);
                  handleSettingChange({ zoom: value });
                }}
                min={1}
                max={5}
                step={0.5}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{t('magnifier.circular')}</label>
              <Switch
                checked={circular}
                onCheckedChange={(checked) => {
                  setCircular(checked);
                  handleSettingChange({ circular: checked });
                }}
              />
            </div>
          </div>

          <div className="preview-section bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">{t('preview')}</h2>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94"
                alt="Preview"
                className="w-full h-48 object-cover rounded"
              />
              <div
                className={`absolute w-32 h-32 border-2 border-blue-500 pointer-events-none ${
                  circular ? 'rounded-full' : 'rounded-lg'
                }`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94"
                    alt="Magnified Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}