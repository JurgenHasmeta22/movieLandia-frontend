import { useContext } from 'react';
import { ThemeContext } from '~/services/providers/ThemeContext';

const useTheme = () => {
  const { theme } = useContext(ThemeContext);

  return {
    mode: theme,
    colors: {
      grey: {
        100: theme === 'dark' ? '#e0e0e0' : '#141414',
        200: theme === 'dark' ? '#c2c2c2' : '#292929',
        300: theme === 'dark' ? '#a3a3a3' : '#3d3d3d',
        400: theme === 'dark' ? '#858585' : '#525252',
        500: theme === 'dark' ? '#666666' : '#666666',
        600: theme === 'dark' ? '#525252' : '#858585',
        700: theme === 'dark' ? '#3d3d3d' : '#a3a3a3',
        800: theme === 'dark' ? '#292929' : '#c2c2c2',
        900: theme === 'dark' ? '#141414' : '#e0e0e0',
      },
      primary: {
        100: theme === 'dark' ? '#d0d1d5' : '#040509',
        200: theme === 'dark' ? '#a1a4ab' : '#080b12',
        300: theme === 'dark' ? '#727681' : '#0c101b',
        400: theme === 'dark' ? '#1F2A40' : '#f2f0f0',
        500: theme === 'dark' ? '#141b2d' : '#141b2d',
        600: theme === 'dark' ? '#101624' : '#1F2A40',
        700: theme === 'dark' ? '#868dfb' : '#FFF',
        800: theme === 'dark' ? '#080b12' : '#a1a4ab',
        900: theme === 'dark' ? '#040509' : '#F5F5F5',
      },
      greenAccent: {
        100: theme === 'dark' ? '#dbf5ee' : '#0f2922',
        200: theme === 'dark' ? '#b7ebde' : '#1e5245',
        300: theme === 'dark' ? '#94e2cd' : '#2e7c67',
        400: theme === 'dark' ? '#70d8bd' : '#3da58a',
        500: theme === 'dark' ? '#4cceac' : '#4cceac',
        600: theme === 'dark' ? '#3da58a' : '#70d8bd',
        700: theme === 'dark' ? '#2e7c67' : '#94e2cd',
        800: theme === 'dark' ? '#1e5245' : '#b7ebde',
        900: theme === 'dark' ? '#0f2922' : '#dbf5ee',
      },
      redAccent: {
        100: theme === 'dark' ? '#f8dcdb' : '#2c100f',
        200: theme === 'dark' ? '#f1b9b7' : '#58201e',
        300: theme === 'dark' ? '#e99592' : '#832f2c',
        400: theme === 'dark' ? '#e2726e' : '#af3f3b',
        500: theme === 'dark' ? '#db4f4a' : '#db4f4a',
        600: theme === 'dark' ? '#af3f3b' : '#e2726e',
        700: theme === 'dark' ? '#832f2c' : '#e99592',
        800: theme === 'dark' ? '#58201e' : '#f1b9b7',
        900: theme === 'dark' ? '#2c100f' : '#f8dcdb',
      },
      blueAccent: {
        100: theme === 'dark' ? '#e1e2fe' : '#151632',
        200: theme === 'dark' ? '#c3c6fd' : '#2a2d64',
        300: theme === 'dark' ? '#a4a9fc' : '#3e4396',
        400: theme === 'dark' ? '#868dfb' : '#535ac8',
        500: theme === 'dark' ? '#6870fa' : '#6870fa',
        600: theme === 'dark' ? '#535ac8' : '#868dfb',
        700: theme === 'dark' ? '#3e4396' : '#a4a9fc',
        800: theme === 'dark' ? '#2a2d64' : '#c3c6fd',
        900: theme === 'dark' ? '#151632' : '#e1e2fe',
      },
    },
  };
};

export default useTheme;
