import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const themes = [
  'UI Theme',
  'Ella Current Light',
  'Ella Current Dark',
  'Ella Web Light',
  'Ella Web Dark',
  'Ella Electric Dark',
  'Ella Modern Dark',
  'Ella Modern Light',
  'Ella Citrus Grove',
  'Ella Neumorphism',
  'Ella Neumorphism Dark',
  'Ella EV2 Dark'
];

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('UI Theme');

  const applyTheme = (themeName) => {
    console.log('Applying theme:', themeName);
    console.log('Body classes before:', document.body.className);
    // Remove existing theme classes
    document.body.classList.remove('theme-ui', 'theme-light', 'theme-dark', 'theme-web-light', 'theme-web-dark', 'theme-electric-dark', 'theme-modern-dark', 'theme-modern-light', 'theme-citrus-grove', 'theme-neumorphism', 'theme-neumorphism-dark', 'theme-ev2-dark');
    
    // Add the appropriate theme class
    switch (themeName) {
      case 'UI Theme':
        document.body.classList.add('theme-ui');
        break;
      case 'Ella Current Light':
        document.body.classList.add('theme-light');
        break;
      case 'Ella Current Dark':
        document.body.classList.add('theme-dark');
        break;
      case 'Ella Web Light':
        document.body.classList.add('theme-web-light');
        break;
      case 'Ella Web Dark':
        document.body.classList.add('theme-web-dark');
        break;
      case 'Ella Electric Dark':
        document.body.classList.add('theme-electric-dark');
        break;
      case 'Ella Modern Dark':
        document.body.classList.add('theme-modern-dark');
        break;
      case 'Ella Modern Light':
        document.body.classList.add('theme-modern-light');
        break;
      case 'Ella Citrus Grove':
        document.body.classList.add('theme-citrus-grove');
        break;
      case 'Ella Neumorphism':
        document.body.classList.add('theme-neumorphism');
        break;
      case 'Ella Neumorphism Dark':
        document.body.classList.add('theme-neumorphism-dark');
        break;
      case 'Ella EV2 Dark':
        document.body.classList.add('theme-ev2-dark');
        break;
      default:
        document.body.classList.add('theme-ui');
    }
    console.log('Body classes after:', document.body.className);
  };

  const setTheme = (themeName) => {
    console.log('ThemeContext: Setting theme to:', themeName);
    console.log('ThemeContext: Current theme before:', currentTheme);
    setCurrentTheme(themeName);
    applyTheme(themeName);
    // Persist theme to localStorage
    localStorage.setItem('ella-ui-theme', themeName);
    console.log('ThemeContext: Theme set and applied');
  };

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('ella-ui-theme');
    if (savedTheme && themes.includes(savedTheme)) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to UI Theme
      setCurrentTheme('UI Theme');
      applyTheme('UI Theme');
    }
  }, []);

  const value = {
    currentTheme,
    themes,
    setTheme,
    isLight: currentTheme === 'UI Theme' || currentTheme === 'Ella Current Light' || currentTheme === 'Ella Web Light' || currentTheme === 'Ella Modern Light' || currentTheme === 'Ella Neumorphism',
    isDark: currentTheme === 'Ella Current Dark' || currentTheme === 'Ella Web Dark' || currentTheme === 'Ella Electric Dark' || currentTheme === 'Ella Modern Dark' || currentTheme === 'Ella Citrus Grove' || currentTheme === 'Ella Neumorphism Dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 