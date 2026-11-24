import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import PostCard from '../components/ui/post-card.jsx';
import { supabase } from '../lib/supabase.js';

/**
 * HomePage 페이지 - 게시물 목록과 검색 결과를 보여준다. (주소의 ?q= 검색어 사용)
 *
 * Example usage:
 * <Route path="/" element={ <HomePage /> } />
 */
function HomePage() {
  const [ searchParams ] = useSearchParams();
  const keyword = searchParams.get('q')?.trim() ?? '';
  const [ posts, setPosts ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ errorText, setErrorText ] = useState('');

  /** 게시물 목록 조회 (검색어가 있으면 제목, 여행지명, 내용에서 검색) */
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setErrorText('');

    let query = supabase
      .from('posts')
      .select('id, title, place_name, rating, image_url, created_at, users(name), comments(count)')
      .order('id', { ascending: false });

    if (keyword) {
      const safe = keyword.replace(/[,()%*\\]/g, ' ');
      query = query.or(`title.ilike.%${ safe }%,place_name.ilike.%${ safe }%,content.ilike.%${ safe }%`);
    }

    query.then(({ data, error }) => {
      if (isCancelled) {
        return;
      }
      if (error) {
        setErrorText('게시물을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      } else {
        setPosts(data);
      }
      setIsLoading(false);
    });

    return () => {
      isCancelled = true;
    };
  }, [ keyword ]);

  return (
    <Box>
      <Typography
        component="h1"
        sx={ { fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' }, lineHeight: 1.3, mb: 3 } }
      >
        { keyword ? `'${ keyword }' 검색 결과` : '오늘의 여행지 리뷰 ✈️' }
      </Typography>

      { errorText && <Alert severity="error">{ errorText }</Alert> }

      { isLoading ? (
        <Box sx={ { display: 'flex', justifyContent: 'center', py: 8 } }>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 && !errorText ? (
        <Box sx={ { py: 8, textAlign: 'center', color: 'text.secondary' } }>
          { keyword ? '검색 결과가 없어요. 다른 단어로 찾아보세요.' : '아직 등록된 리뷰가 없어요. 첫 리뷰를 남겨 보세요!' }
        </Box>
      ) : (
        <Grid container spacing={ 3 }>
          { posts.map((post) => (
            <Grid key={ post.id } size={ { xs: 12, sm: 6, md: 4 } }>
              <PostCard post={ post } />
            </Grid>
          )) }
        </Grid>
      ) }
    </Box>
  );
}

export default HomePage;
