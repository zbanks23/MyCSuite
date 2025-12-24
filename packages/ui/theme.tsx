import { createContext, useContext } from 'react';

export type AppTheme = {
  primary: string;
  accent: string;
  background: string;
  backgroundMuted?: string;
  backgroundDimmed?: string;
  text: string;
  textMuted?: string;
  surface: string;
  icon?: string;
  tabIconDefault?: string;
  tabIconSelected?: string;
  error?: string;
  [k: string]: any;
};

export const lightTheme: AppTheme = {
  primary: 'hsl(8, 100%, 67%)',
  accent: 'hsl(117, 20%, 61%)',
  background: 'hsl(0, 0%, 100%)',
  backgroundMuted: 'hsl(359, 75%, 89%)', // surface
  backgroundDimmed: 'hsl(359, 75%, 89%)',
  text: 'hsl(0, 0%, 5%)',
  textMuted: 'hsl(0, 0%, 5%)', // Using same for now
  surface: 'hsl(359, 75%, 89%)',
  icon: 'hsl(0, 0%, 5%)',
  tabIconDefault: 'hsl(359, 75%, 89%)',
  tabIconSelected: 'hsl(8, 100%, 67%)',
  error: 'hsl(0, 84%, 60%)',
};

export const darkTheme: AppTheme = {
  primary: 'hsl(5, 100%, 75%)', // primary-dark
  accent: 'hsl(122, 37%, 74%)', // accent-dark
  background: 'hsl(0, 18%, 15%)', // background-dark
  backgroundMuted: 'hsl(0, 17%, 21%)', // surface-dark
  backgroundDimmed: 'hsl(0, 17%, 21%)',
  text: 'hsl(0, 100%, 98%)', // apptext-dark
  textMuted: 'hsl(0, 17%, 21%)', // surface-dark (maybe lighter?)
  surface: 'hsl(0, 17%, 21%)', // surface-dark
  icon: 'hsl(0, 100%, 98%)',
  tabIconDefault: 'hsl(0, 17%, 21%)',
  tabIconSelected: 'hsl(5, 100%, 75%)',
  error: 'hsl(0, 84%, 60%)', // sticking to same red for now or lighter?
};

// For backward compatibility if needed, or default export
export const defaultTheme = lightTheme;

const ThemeContext = createContext<AppTheme>(defaultTheme);

export const UIThemeProvider = ({ value, children }: { value: AppTheme; children: React.ReactNode }) => {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useUITheme = () => useContext(ThemeContext);

export default ThemeContext;
