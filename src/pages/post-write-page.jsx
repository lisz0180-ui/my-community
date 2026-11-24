import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import PostImage from '../components/ui/post-image.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { supabase } from '../lib/supabase.js';

/** 허용하는 이미지 형식과 저장 시 확장자 */
const IMAGE_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/**
 * PostWritePage 페이지 - 리뷰 작성/수정 (제목, 여행지명, 별점, 사진 업로드, 내용)
 * 주소에 :postId 가 있으면 수정 모드로 동작한다.
 *
 * Example usage:
 * <Route path="/write" element={ <PostWritePage /> } />
 * <Route path="/write/:postId" element={ <PostWritePage /> } />
 */
function PostWritePage() {
  const { postId } = useParams();
  const isEditMode = Boolean(postId);
  const navigate = useNavigate();
  const { user, profile, isLoading: isAuthLoading } = useAuth();
  const fileInputRef = useRef(null);
  const [ title, setTitle ] = useState('');
  const [ placeName, setPlaceName ] = useState('');
  const [ rating, setRating ] = useState(5);
  const [ content, setContent ] = useState('');
  const [ imageUrl, setImageUrl ] = useState(null);
  const [ imageFile, setImageFile ] = useState(null);
  const [ previewUrl, setPreviewUrl ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(isEditMode);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ errorText, setErrorText ] = useState('');

  /** 수정 모드: 기존 게시물 불러오기 */
  useEffect(() => {
    if (!isEditMode || !profile) {
      return;
    }
    let isCancelled = false;
    supabase
      .from('posts')
      .select('title, place_name, rating, content, image_url, user_id')
      .eq('id', postId)
      .maybeSingle()
      .then(({ data }) => {
        if (isCancelled) {
          return;
        }
        if (!data || data.user_id !== profile.id) {
          setErrorText('수정할 수 있는 게시물이 아니에요.');
        } else {
          setTitle(data.title);
          setPlaceName(data.place_name);
          setRating(data.rating);
          setContent(data.content);
          setImageUrl(data.image_url);
        }
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [ isEditMode, postId, profile ]);

  /** 선택한 이미지 미리보기 주소 정리 */
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [ imageFile ]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (!IMAGE_EXTENSIONS[file.type]) {
      setErrorText('JPG, PNG, WEBP, GIF 이미지만 올릴 수 있어요.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrorText('이미지는 5MB 이하만 올릴 수 있어요.');
      return;
    }
    setErrorText('');
    setImageFile(file);
  };

  /** Storage 에 이미지를 올리고 공개 주소를 반환한다. */
  const uploadImage = async (file) => {
    const path = `${ user.id }/${ Date.now() }-${ Math.random().toString(36).slice(2, 8) }.${ IMAGE_EXTENSIONS[file.type] }`;
    const { error } = await supabase.storage.from('post-images').upload(path, file, { contentType: file.type });
    if (error) {
      throw error;
    }
    return supabase.storage.from('post-images').getPublicUrl(path).data.publicUrl;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorText('');
    try {
      const finalImageUrl = imageFile ? await uploadImage(imageFile) : imageUrl;
      const values = {
        title: title.trim(),
        place_name: placeName.trim(),
        rating,
        content: content.trim(),
        image_url: finalImageUrl,
      };
      const query = isEditMode
        ? supabase.from('posts').update(values).eq('id', postId).select('id').single()
        : supabase.from('posts').insert({ ...values, user_id: profile.id }).select('id').single();
      const { data, error } = await query;
      if (error) {
        throw error;
      }
      navigate(`/posts/${ data.id }`);
    } catch {
      setErrorText('저장하지 못했어요. 입력 내용을 확인하고 다시 시도해 주세요.');
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <Box sx={ { display: 'flex', justifyContent: 'center', py: 8 } }>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={ { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 8 } }>
        <Alert severity="info">리뷰를 쓰려면 상단 메뉴의 로그인 아이콘을 눌러 로그인해 주세요.</Alert>
        <Button component={ RouterLink } to="/" variant="contained">목록으로</Button>
      </Box>
    );
  }

  const shownImage = previewUrl ?? imageUrl;

  return (
    <Paper
      component="form"
      onSubmit={ handleSubmit }
      elevation={ 0 }
      sx={ { border: 1, borderColor: 'divider', p: { xs: 2, md: 4 }, maxWidth: 840, mx: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 3 } }
    >
      <Typography component="h1" sx={ { fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' } } }>
        { isEditMode ? '리뷰 수정' : '새 리뷰 쓰기' }
      </Typography>

      { errorText && <Alert severity="error">{ errorText }</Alert> }

      <TextField label="제목" value={ title } onChange={ (event) => setTitle(event.target.value) } required slotProps={ { htmlInput: { maxLength: 100 } } } />
      <TextField label="여행지명" value={ placeName } onChange={ (event) => setPlaceName(event.target.value) } required slotProps={ { htmlInput: { maxLength: 100 } } } />

      <Box>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 0.5 } }>별점</Typography>
        <Rating size="large" value={ rating } onChange={ (_event, value) => setRating(value ?? 1) } />
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
          사진 (선택, 없으면 기본 이미지가 표시돼요)
        </Typography>
        <Box sx={ { maxWidth: 420, borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider', mb: 1.5 } }>
          <PostImage src={ shownImage } alt="미리보기" />
        </Box>
        <input ref={ fileInputRef } type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={ handleFileChange } />
        <Button variant="outlined" startIcon={ <AddPhotoAlternateIcon /> } onClick={ () => fileInputRef.current?.click() }>
          사진 선택
        </Button>
      </Box>

      <TextField
        label="리뷰 내용"
        value={ content }
        onChange={ (event) => setContent(event.target.value) }
        required
        multiline
        minRows={ 6 }
      />

      <Box sx={ { display: 'flex', justifyContent: 'flex-end', gap: 1 } }>
        <Button component={ RouterLink } to={ isEditMode ? `/posts/${ postId }` : '/' } disabled={ isSubmitting }>
          취소
        </Button>
        <Button type="submit" variant="contained" disabled={ isSubmitting || (isEditMode && !title) }>
          { isSubmitting ? <CircularProgress size={ 24 } /> : isEditMode ? '수정 완료' : '등록' }
        </Button>
      </Box>
    </Paper>
  );
}

export default PostWritePage;
