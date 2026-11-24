import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';

import LoginModal from './login-modal.jsx';
import { useAuth } from '../../hooks/use-auth.js';

/**
 * Header 컴포넌트 - 로고, 커뮤니티 내 검색, 글쓰기, 로그인 아이콘(팝업 모달)을 제공하는 상단 메뉴
 *
 * Example usage:
 * <Header />
 */
function Header() {
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();
  const { profile, user, signOut } = useAuth();
  const [ keyword, setKeyword ] = useState(searchParams.get('q') ?? '');
  const [ isLoginOpen, setIsLoginOpen ] = useState(false);
  const [ menuAnchor, setMenuAnchor ] = useState(null);

  /** 주소창의 검색어가 바뀌면 입력창에도 반영 */
  useEffect(() => {
    setKeyword(searchParams.get('q') ?? '');
  }, [ searchParams ]);

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = keyword.trim();
    navigate(trimmed ? `/?q=${ encodeURIComponent(trimmed) }` : '/');
  };

  const handleLogout = async () => {
    setMenuAnchor(null);
    await signOut();
    navigate('/');
  };

  const displayName = profile?.name ?? user?.email ?? '';

  return (
    <AppBar position="sticky" color="inherit" elevation={ 1 } sx={ { bgcolor: 'background.paper' } }>
      <Container maxWidth="lg" sx={ { px: { xs: 2, md: 3 } } }>
        <Toolbar disableGutters sx={ { flexWrap: 'wrap', gap: 1, py: { xs: 1, md: 0 } } }>
          <Box
            component={ RouterLink }
            to="/"
            sx={ { display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', textDecoration: 'none', mr: { md: 3 } } }
          >
            <FlightTakeoffIcon />
            <Typography component="span" sx={ { fontWeight: 800, fontSize: { xs: '1.1rem', md: '1.3rem' } } }>
              여행지 리뷰
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={ handleSearch }
            sx={ {
              order: { xs: 3, md: 0 },
              flexBasis: { xs: '100%', md: 'auto' },
              flexGrow: { md: 1 },
              maxWidth: { md: 520 },
              mx: { md: 'auto' },
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'action.hover',
              border: 1,
              borderColor: 'divider',
              borderRadius: 8,
              pl: 2,
              pr: 0.5,
            } }
          >
            <InputBase
              placeholder="여행지, 제목, 내용 검색"
              value={ keyword }
              onChange={ (event) => setKeyword(event.target.value) }
              sx={ { flexGrow: 1 } }
              inputProps={ { 'aria-label': '게시물 검색' } }
            />
            <IconButton type="submit" aria-label="검색">
              <SearchIcon />
            </IconButton>
          </Box>

          <Box sx={ { ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 } }>
            { profile && (
              <Button component={ RouterLink } to="/write" variant="contained" startIcon={ <EditIcon /> }>
                글쓰기
              </Button>
            ) }
            { user ? (
              <>
                <Tooltip title={ displayName }>
                  <IconButton onClick={ (event) => setMenuAnchor(event.currentTarget) } aria-label="내 메뉴">
                    <Avatar sx={ { width: 36, height: 36, bgcolor: 'primary.main' } }>
                      { displayName.charAt(0).toUpperCase() }
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={ menuAnchor } open={ Boolean(menuAnchor) } onClose={ () => setMenuAnchor(null) }>
                  <MenuItem disabled>{ displayName }</MenuItem>
                  <MenuItem onClick={ handleLogout }>
                    <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                    로그아웃
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Tooltip title="로그인">
                <IconButton color="primary" onClick={ () => setIsLoginOpen(true) } aria-label="로그인">
                  <AccountCircleIcon sx={ { fontSize: 36 } } />
                </IconButton>
              </Tooltip>
            ) }
          </Box>
        </Toolbar>
      </Container>
      <LoginModal isOpen={ isLoginOpen } onClose={ () => setIsLoginOpen(false) } />
    </AppBar>
  );
}

export default Header;
