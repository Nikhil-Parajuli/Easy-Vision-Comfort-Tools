import React, { createContext, useContext, useState, useEffect } from 'react';

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

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
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