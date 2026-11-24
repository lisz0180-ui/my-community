import { Navigate, Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Header from './components/common/header.jsx';
import HomePage from './pages/home-page.jsx';
import PostDetailPage from './pages/post-detail-page.jsx';
import PostWritePage from './pages/post-write-page.jsx';

/**
 * App 컴포넌트 - 전체 레이아웃(헤더 + 중앙 정렬 콘텐츠)과 라우팅
 *
 * Example usage:
 * <App />
 */
function App() {
  return (
    <Box sx={ { width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' } }>
      <Header />
      <Box sx={ { flexGrow: 1, display: 'flex', justifyContent: 'center', py: { xs: 2, md: 4 } } }>
        <Container maxWidth="lg" sx={ { px: { xs: 2, md: 3 } } }>
          <Routes>
            <Route path="/" element={ <HomePage /> } />
            <Route path="/posts/:postId" element={ <PostDetailPage /> } />
            <Route path="/write" element={ <PostWritePage /> } />
            <Route path="/write/:postId" element={ <PostWritePage /> } />
            <Route path="*" element={ <Navigate to="/" replace /> } />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
