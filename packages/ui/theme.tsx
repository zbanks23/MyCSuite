import { createContext, useContext } from 'react';

export type AppTheme = {
  primary: string;
  accent: string;
  bgLight: string;
  bg?: string;
  bgDark?: string;
  text: string;
  textMuted?: string;
  icon?: string;
  tabIconDefault?: string;
  tabIconSelected?: string;
  error?: string;
  [k: string]: any;
};

export const lightTheme: AppTheme = {
  primary: 'hsl(8, 100%, 67%)',
  accent: 'hsl(117, 20%, 61%)',
  bgLight: 'hsl(0, 0%, 100%)',
  bg: 'hsl(0, 0%, 95%)', 
  bgDark: 'hsl(0, 0%, 90%)',
  text: 'hsl(0, 0%, 5%)',
  textMuted: 'hsl(0, 0%, 30%)', 
  icon: 'hsl(0, 0%, 5%)',
  tabIconDefault: 'hsl(0, 0%, 89%)',
  tabIconSelected: 'hsl(8, 100%, 67%)',
  error: 'hsl(0, 84%, 60%)',
};

export const darkTheme: AppTheme = {
  primary: 'hsl(5, 100%, 75%)', 
  accent: 'hsl(122, 37%, 74%)',
  bgLight: 'hsl(0, 0%, 10%)', 
  bg: 'hsl(0, 0%, 5%)',
  bgDark: 'hsl(0, 0%, 0%)',
  text: 'hsl(0, 100%, 95%)',
  textMuted: 'hsl(0, 0%, 70%)', 
  icon: 'hsl(0, 100%, 98%)',
  tabIconDefault: 'hsl(0, 17%, 21%)',
  tabIconSelected: 'hsl(5, 100%, 75%)',
  error: 'hsl(0, 84%, 60%)',
};

// For backward compatibility if needed, or default export
export const defaultTheme = lightTheme;

const ThemeContext = createContext<AppTheme>(defaultTheme);

export const UIThemeProvider = ({ value, children }: { value: AppTheme; children: React.ReactNode }) => {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useUITheme = () => useContext(ThemeContext);

export default ThemeContext;
