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
    try {
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error loading theme:', error);
        return;
      }

      if (data) {
        console.log('Theme loaded:', data);
        setTheme(data);
        // Apply CSS variables
        document.documentElement.style.setProperty('--color-primary', data.primary_color);
        document.documentElement.style.setProperty('--color-secondary', data.secondary_color);
        document.documentElement.style.setProperty('--color-accent', data.accent_color);
        document.documentElement.style.setProperty('--color-extra-1', data.extra_color_1);
        document.documentElement.style.setProperty('--color-extra-2', data.extra_color_2);
        document.documentElement.style.setProperty('--color-background', data.background_color);
        document.documentElement.style.setProperty('--color-border', data.border_color);
      } else {
        console.warn('No theme data found');
      }
    } catch (error) {
      console.error('Failed to refresh theme:', error);
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
