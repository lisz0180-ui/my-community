import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { supabase } from '../../lib/supabase.js';

/**
 * CommentForm 컴포넌트 - 댓글 입력 폼 (Supabase comments 테이블에 저장)
 *
 * Props:
 * @param {number} postId - 댓글을 달 게시물 번호 [Required]
 * @param {number} userId - 작성자(users.id) [Required]
 * @param {function} onCreated - 댓글 등록 성공 후 호출되는 함수 [Required]
 *
 * Example usage:
 * <CommentForm postId={ 1 } userId={ 3 } onCreated={ reload } />
 */
function CommentForm({ postId, userId, onCreated }) {
  const [ content, setContent ] = useState('');
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ errorText, setErrorText ] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      return;
    }
    setIsSubmitting(true);
    setErrorText('');
    const { error } = await supabase
      .from('comments')
      .insert({ content: trimmed, post_id: postId, user_id: userId });
    setIsSubmitting(false);
    if (error) {
      setErrorText('댓글을 등록하지 못했어요. 잠시 후 다시 시도해 주세요.');
      return;
    }
    setContent('');
    onCreated();
  };

  return (
    <Box component="form" onSubmit={ handleSubmit } sx={ { display: 'flex', gap: 1, alignItems: 'flex-start' } }>
      <TextField
        fullWidth
        size="small"
        placeholder="댓글을 입력해 주세요"
        value={ content }
        onChange={ (event) => setContent(event.target.value) }
        error={ Boolean(errorText) }
        helperText={ errorText }
        multiline
        maxRows={ 4 }
      />
      <Button type="submit" variant="contained" disabled={ isSubmitting || !content.trim() } sx={ { flexShrink: 0, height: 40 } }>
        등록
      </Button>
    </Box>
  );
}

export default CommentForm;
