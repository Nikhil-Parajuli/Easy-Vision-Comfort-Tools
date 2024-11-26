import { useState, useEffect } from 'react';

interface ReadModeSettings {
  enabled: boolean;
  fontSize: number;
  lineHeight: number;
  font: string;
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'justify';
  theme: {
    value: string;
    bg: string;
    text: string;
  };
  isTextOnly: boolean;
  isLineFocus: boolean;
  isReadAloud: boolean;
  readingSpeed: number;
}

const defaultSettings: ReadModeSettings = {
  enabled: false,
  fontSize: 16,
  lineHeight: 1.5,
  font: 'roboto',
  letterSpacing: 0,
  textAlign: 'left',
  theme: {
    value: 'default',
    bg: '#ffffff',
    text: '#000000'
  },
  isTextOnly: false,
  isLineFocus: false,
  isReadAloud: false,
  readingSpeed: 1
};

export function useReadMode() {
  const [settings, setSettings] = useState<ReadModeSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('readModeSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('readModeSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<ReadModeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    updateSettings
  };
}