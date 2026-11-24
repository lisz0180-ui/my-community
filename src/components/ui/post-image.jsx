import { useState } from 'react';
import Box from '@mui/material/Box';

import { DEFAULT_IMAGE } from '../../utils/default-image.js';

/**
 * PostImage 컴포넌트 - 게시물 이미지를 표시하고, 없거나 불러오지 못하면 기본 이미지를 보여준다.
 *
 * Props:
 * @param {string} src - 이미지 주소 [Optional, 기본값: null]
 * @param {string} alt - 대체 텍스트 [Optional, 기본값: '']
 * @param {string} aspectRatio - 가로세로 비율 [Optional, 기본값: '16 / 9']
 *
 * Example usage:
 * <PostImage src={ post.image_url } alt={ post.title } />
 */
function PostImage({ src = null, alt = '', aspectRatio = '16 / 9' }) {
  const [ failedSrc, setFailedSrc ] = useState(null);
  const imageSrc = src && src !== failedSrc ? src : DEFAULT_IMAGE;

  return (
    <Box
      component="img"
      src={ imageSrc }
      alt={ alt }
      loading="lazy"
      onError={ () => setFailedSrc(src) }
      sx={ { width: '100%', aspectRatio, objectFit: 'cover', display: 'block', bgcolor: 'action.hover' } }
    />
  );
}

export default PostImage;
