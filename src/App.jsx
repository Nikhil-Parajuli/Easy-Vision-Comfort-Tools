import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';
import { useLanguage } from './contexts/LanguageContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
import { ColorBlindSection } from './components/ColorBlindSection';
import { ReadModeSection } from './components/ReadModeSection';
import { MagnifierSection } from './components/MagnifierSection';
import { useTheme } from './hooks/useTheme';

function MainContent() {
  const { t } = useLanguage();
  const [theme, setTheme] = useTheme();
  const [activeMode, setActiveMode] = React.useState('normal');
  const [siteEnabled, setSiteEnabled] = React.useState(true);
  const [readModeEnabled, setReadModeEnabled] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(16);
  const [lineHeight, setLineHeight] = React.useState(1.5);
  const [magnifierEnabled, setMagnifierEnabled] = React.useState(false);
  const [zoom, setZoom] = React.useState(2);
  const [circular, setCircular] = React.useState(true);

  React.useEffect(() => {
    const root = document.documentElement;
    if (siteEnabled && activeMode !== 'normal') {
      root.style.filter = `var(--${activeMode}-filter)`;
    } else {
      root.style.filter = 'none';
    }
  }, [activeMode, siteEnabled]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="logo flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
            👁️
          </div>
          <h1 className="text-xl font-bold">Enhanced Accessibility</h1>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Tabs defaultValue="colorblind" className="w-full">
          <TabsList className="w-full flex justify-center mb-6">
            <TabsTrigger value="colorblind">{t('tabs.colorBlind')}</TabsTrigger>
            <TabsTrigger value="readmode">{t('tabs.readMode')}</TabsTrigger>
            <TabsTrigger value="magnifier">{t('tabs.magnifier')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colorblind">
            <ColorBlindSection
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              siteEnabled={siteEnabled}
              setSiteEnabled={setSiteEnabled}
            />
          </TabsContent>
          
          <TabsContent value="readmode">
            <ReadModeSection
              enabled={readModeEnabled}
              setEnabled={setReadModeEnabled}
              fontSize={fontSize}
              setFontSize={setFontSize}
              lineHeight={lineHeight}
              setLineHeight={setLineHeight}
            />
          </TabsContent>
          
          <TabsContent value="magnifier">
            <MagnifierSection
              enabled={magnifierEnabled}
              setEnabled={setMagnifierEnabled}
              zoom={zoom}
              setZoom={setZoom}
              circular={circular}
              setCircular={setCircular}
            />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="shortcuts flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Shift</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">C</kbd>
            <span className="ml-2">{t('shortcuts')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  );
}

export default App;