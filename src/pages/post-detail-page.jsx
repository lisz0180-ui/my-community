import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlaceIcon from '@mui/icons-material/Place';

import CommentForm from '../components/landing/comment-form.jsx';
import CommentList from '../components/landing/comment-list.jsx';
import PostImage from '../components/ui/post-image.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { supabase } from '../lib/supabase.js';
import { formatDate } from '../utils/format-date.js';

/**
 * PostDetailPage 페이지 - 게시물 상세(번호, 제목, 이미지, 여행지명, 별점, 리뷰 내용)와 댓글
 *
 * Example usage:
 * <Route path="/posts/:postId" element={ <PostDetailPage /> } />
 */
function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [ post, setPost ] = useState(null);
  const [ comments, setComments ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ errorText, setErrorText ] = useState('');

  const loadComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('id, content, user_id, created_at, users(name)')
      .eq('post_id', postId)
      .order('id', { ascending: true });
    setComments(data ?? []);
  }, [ postId ]);

  /** 게시물 및 댓글 조회 */
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    supabase
      .from('posts')
      .select('id, title, place_name, rating, image_url, content, user_id, created_at, updated_at, users(name)')
      .eq('id', postId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (isCancelled) {
          return;
        }
        if (error || !data) {
          setErrorText('게시물을 찾을 수 없어요.');
        } else {
          setPost(data);
          loadComments();
        }
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [ postId, loadComments ]);

  const handleDeletePost = async () => {
    if (!window.confirm('이 리뷰를 삭제할까요?')) {
      return;
    }
    const { error } = await supabase.from('posts').delete().eq('id', post.id);
    if (error) {
      setErrorText('삭제하지 못했어요. 잠시 후 다시 시도해 주세요.');
      return;
    }
    navigate('/');
  };

  const handleDeleteComment = async (commentId) => {
    await supabase.from('comments').delete().eq('id', commentId);
    loadComments();
  };

  if (isLoading) {
    return (
      <Box sx={ { display: 'flex', justifyContent: 'center', py: 8 } }>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={ { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 8 } }>
        <Alert severity="warning">{ errorText }</Alert>
        <Button component={ RouterLink } to="/" variant="contained">목록으로</Button>
      </Box>
    );
  }

  const isOwner = profile?.id === post.user_id;

  return (
    <Paper elevation={ 0 } sx={ { border: 1, borderColor: 'divider', overflow: 'hidden', maxWidth: 840, mx: 'auto', width: '100%' } }>
      <PostImage src={ post.image_url } alt={ post.title } />
      <Box sx={ { p: { xs: 2, md: 4 } } }>
        <Typography variant="caption" color="text.secondary">
          No. { post.id }
        </Typography>
        <Typography component="h1" sx={ { fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' }, lineHeight: 1.3, wordBreak: 'break-word' } }>
          { post.title }
        </Typography>

        <Box sx={ { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 1.5 } }>
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' } }>
            <PlaceIcon />
            <Typography sx={ { fontWeight: 700 } }>{ post.place_name }</Typography>
          </Box>
          <Rating value={ post.rating } readOnly />
        </Box>

        <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, color: 'text.secondary', fontSize: '0.875rem' } }>
          <span>{ post.users?.name ?? '알 수 없음' }</span>
          <span>·</span>
          <span>{ formatDate(post.created_at) }</span>
          { post.updated_at !== post.created_at && <span>(수정 { formatDate(post.updated_at) })</span> }
          { isOwner && (
            <Box sx={ { ml: 'auto', display: 'flex', gap: 1 } }>
              <Button size="small" component={ RouterLink } to={ `/write/${ post.id }` } startIcon={ <EditIcon /> }>
                수정
              </Button>
              <Button size="small" color="error" onClick={ handleDeletePost } startIcon={ <DeleteIcon /> }>
                삭제
              </Button>
            </Box>
          ) }
        </Box>

        { errorText && <Alert severity="error" sx={ { mt: 2 } }>{ errorText }</Alert> }

        <Divider sx={ { my: 3 } } />
        <Typography sx={ { whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.8, fontSize: { xs: '1rem', md: '1.1rem' } } }>
          { post.content }
        </Typography>

        <Divider sx={ { my: 4 } } />
        <Typography component="h2" sx={ { fontWeight: 700, fontSize: '1.2rem', mb: 2 } }>
          댓글 { comments.length }개
        </Typography>
        { profile ? (
          <Box sx={ { mb: 3 } }>
            <CommentForm postId={ post.id } userId={ profile.id } onCreated={ loadComments } />
          </Box>
        ) : (
          <Alert severity="info" sx={ { mb: 3 } }>
            댓글을 쓰려면 상단 메뉴의 로그인 아이콘을 눌러 로그인해 주세요.
          </Alert>
        ) }
        <CommentList comments={ comments } currentUserId={ profile?.id ?? null } onDelete={ handleDeleteComment } />
      </Box>
    </Paper>
  );
}

export default PostDetailPage;
