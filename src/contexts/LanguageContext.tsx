import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'language.english': 'English',
    'language.nepali': 'Nepali',
    'mode.normal': 'Normal',
    'mode.protanopia': 'Protanopia',
    'mode.deuteranopia': 'Deuteranopia',
    'mode.tritanopia': 'Tritanopia',
    'mode.monochromacy': 'Monochromacy',
    'mode.protanomaly': 'Protanomaly',
    'mode.deuteranomaly': 'Deuteranomaly',
    'mode.tritanomaly': 'Tritanomaly',
    'mode.achromatomaly': 'Achromatomaly',
    'preview': 'Preview',
    'site.settings': 'Site Settings',
    'site.enable': 'Enable for this site',
    'shortcuts': 'Toggle Extension'
  },
  ne: {
    'language.english': 'अंग्रेजी',
    'language.nepali': 'नेपाली',
    'mode.normal': 'सामान्य',
    'mode.protanopia': 'प्रोटानोपिया',
    'mode.deuteranopia': 'ड्युटेरानोपिया',
    'mode.tritanopia': 'ट्राइटानोपिया',
    'mode.monochromacy': 'मोनोक्रोमेसी',
    'mode.protanomaly': 'प्रोटानोमली',
    'mode.deuteranomaly': 'ड्युटेरानोमली',
    'mode.tritanomaly': 'ट्राइटानोमली',
    'mode.achromatomaly': 'एक्रोमाटोमली',
    'preview': 'पूर्वावलोकन',
    'site.settings': 'साइट सेटिङहरू',
    'site.enable': 'यो साइटको लागि सक्षम गर्नुहोस्',
    'shortcuts': 'एक्सटेन्सन टगल गर्नुहोस्'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}