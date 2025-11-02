import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface ThemeSettings {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  extra_color_1: string;
  extra_color_2: string;
  background_color: string;
  border_color: string;
  label_name: string;
}

interface ThemeContextType {
  theme: ThemeSettings | null;
  refreshTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings | null>(null);

  const refreshTheme = async () => {
    const { data } = await supabase
      .from('theme_settings')
      .select('*')
      .single();
    
    if (data) {
      setTheme(data);
      // Apply CSS variables
      document.documentElement.style.setProperty('--color-primary', data.primary_color);
      document.documentElement.style.setProperty('--color-secondary', data.secondary_color);
      document.documentElement.style.setProperty('--color-accent', data.accent_color);
      document.documentElement.style.setProperty('--color-extra-1', data.extra_color_1);
      document.documentElement.style.setProperty('--color-extra-2', data.extra_color_2);
      document.documentElement.style.setProperty('--color-background', data.background_color);
      document.documentElement.style.setProperty('--color-border', data.border_color);
    }
  };

  useEffect(() => {
    refreshTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
