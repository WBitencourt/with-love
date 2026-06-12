export const THEMES = [
  {
    id: '2025',
    year: 2025,
    label: '❤️ 2025',
    particle: '❤️',
    particleCount: 25,
    watermarkUrl: '',
    playlist: [
      { 
        src: '/audio/ao-te-ver-rafael-portugal.ogg', 
        title: 'Ao te ver - Rafael Portugal cover by Wendell Bitencourt' 
      },
    ],
  },
  {
    id: '2026',
    year: 2026,
    label: '🏒 2026',
    particle: '🏒',
    particleCount: 30,
    watermarkUrl: '',
    playlist: [
      { 
        src: '/audio/girls-kid-laroi.mpeg', 
        title: 'Girls Kid - Laroi' 
      },
      { 
        src: '/audio/sexyback-justin-timberlake.MP3', 
        title: 'SexyBack - Justin Timberlake' 
      },
      { 
        src: '/audio/baby-now-that-i-found-you-ella-bright.mpeg', 
        title: 'Baby Now That I Found You - Ella Bright' 
      },
    ],
  },
] as const;

export type ThemeId = typeof THEMES[number]['id'];

export type ThemeConfig = typeof THEMES[number];

export const DEFAULT_THEME_ID: ThemeId = '2026';
