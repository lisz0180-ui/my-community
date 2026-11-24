import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import PlaceIcon from '@mui/icons-material/Place';

import PostImage from './post-image.jsx';
import { formatDate } from '../../utils/format-date.js';

/**
 * PostCard 컴포넌트 - 목록에 표시되는 게시물 카드 (번호, 제목, 이미지, 여행지명, 별점)
 *
 * Props:
 * @param {object} post - 게시물 데이터 (id, title, place_name, rating, image_url, created_at, users, comments) [Required]
 *
 * Example usage:
 * <PostCard post={ post } />
 */
function PostCard({ post }) {
  const commentCount = post.comments?.[0]?.count ?? 0;

  return (
    <Card elevation={ 0 } sx={ { height: '100%', border: 1, borderColor: 'divider', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } } }>
      <CardActionArea component={ RouterLink } to={ `/posts/${ post.id }` } sx={ { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' } }>
        <PostImage src={ post.image_url } alt={ post.title } />
        <CardContent sx={ { flexGrow: 1 } }>
          <Typography variant="caption" color="text.secondary">
            No. { post.id }
          </Typography>
          <Typography
            variant="subtitle1"
            sx={ { fontWeight: 700, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } }
          >
            { post.title }
          </Typography>
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main', mt: 0.5 } }>
            <PlaceIcon fontSize="small" />
            <Typography variant="body2" noWrap sx={ { fontWeight: 600 } }>
              { post.place_name }
            </Typography>
          </Box>
          <Rating value={ post.rating } readOnly size="small" sx={ { mt: 0.5 } } />
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, mt: 1, color: 'text.secondary' } }>
            <Typography variant="caption" noWrap>
              { post.users?.name ?? '알 수 없음' } · { formatDate(post.created_at) }
            </Typography>
            <Box sx={ { ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 } }>
              <ChatBubbleOutlineIcon sx={ { fontSize: 16 } } />
              <Typography variant="caption">{ commentCount }</Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default PostCard;
