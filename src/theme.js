import { createTheme } from '@mui/material/styles';

/** 여행지 리뷰 - 파란색 테마, 친근한 느낌의 둥근 모서리 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5',
      light: '#64b5f6',
      dark: '#1565c0',
    },
    secondary: {
      main: '#ffb300',
    },
    background: {
      default: '#f4f9ff',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans KR", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  spacing: 8,
});

export default theme;
