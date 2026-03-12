import { useState, useEffect } from 'react';

interface ThemeColors {
  cardBg: string;
  border: string;
  gridStroke: string;
  tickFill: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipColor: string;
  dotStroke: string;
  trackBg: string;
  textPrimary: string;
  textSecondary: string;
  controlBg: string;
  controlBorder: string;
  hoverBg: string;
}

const darkColors: ThemeColors = {
  cardBg: '#121212',
  border: '#2A3135',
  gridStroke: '#2A3135',
  tickFill: '#64748B',
  tooltipBg: '#1a1a1a',
  tooltipBorder: '#2A3135',
  tooltipColor: '#fff',
  dotStroke: '#121212',
  trackBg: '#1a1a1a',
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  controlBg: 'rgba(255,255,255,0.03)',
  controlBorder: 'rgba(255,255,255,0.06)',
  hoverBg: 'rgba(255,255,255,0.05)',
};

const lightColors: ThemeColors = {
  cardBg: '#FFFFFF',
  border: '#D4D9E0',
  gridStroke: '#E5E7EB',
  tickFill: '#6b7280',
  tooltipBg: '#FFFFFF',
  tooltipBorder: '#D4D9E0',
  tooltipColor: '#1a1a2e',
  dotStroke: '#FFFFFF',
  trackBg: '#E5E7EB',
  textPrimary: '#1a1a2e',
  textSecondary: '#4b5563',
  controlBg: 'rgba(0,0,0,0.03)',
  controlBorder: 'rgba(0,0,0,0.08)',
  hoverBg: 'rgba(0,0,0,0.05)',
};

export function useTheme(): ThemeColors {
  const [isLight, setIsLight] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('light')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains('light'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isLight ? lightColors : darkColors;
}
