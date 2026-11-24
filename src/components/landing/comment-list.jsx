import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

import { formatDate } from '../../utils/format-date.js';

/**
 * CommentList 컴포넌트 - 게시물에 달린 댓글 목록
 *
 * Props:
 * @param {Array} comments - 댓글 배열 (id, content, user_id, created_at, users) [Required]
 * @param {number} currentUserId - 현재 로그인한 사용자(users.id) [Optional, 기본값: null]
 * @param {function} onDelete - 댓글 삭제 시 호출되는 함수, 댓글 id를 인자로 받음 [Required]
 *
 * Example usage:
 * <CommentList comments={ comments } currentUserId={ 3 } onDelete={ handleDelete } />
 */
function CommentList({ comments, currentUserId = null, onDelete }) {
  if (comments.length === 0) {
    return (
      <Box sx={ { py: 3, textAlign: 'center', color: 'text.secondary' } }>
        아직 댓글이 없어요. 첫 댓글을 남겨 보세요!
      </Box>
    );
  }

  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
      { comments.map((comment) => (
        <Box key={ comment.id } sx={ { display: 'flex', gap: 1.5 } }>
          <Avatar sx={ { width: 32, height: 32, bgcolor: 'primary.light', fontSize: '0.9rem' } }>
            { (comment.users?.name ?? '?').charAt(0).toUpperCase() }
          </Avatar>
          <Box sx={ { flexGrow: 1, minWidth: 0 } }>
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
              <Typography variant="body2" sx={ { fontWeight: 700 } }>
                { comment.users?.name ?? '알 수 없음' }
              </Typography>
              <Typography variant="caption" color="text.secondary">
                { formatDate(comment.created_at) }
              </Typography>
            </Box>
            <Typography variant="body2" sx={ { whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6 } }>
              { comment.content }
            </Typography>
          </Box>
          { currentUserId === comment.user_id && (
            <IconButton size="small" aria-label="댓글 삭제" onClick={ () => onDelete(comment.id) }>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          ) }
        </Box>
      )) }
    </Box>
  );
}

export default CommentList;
