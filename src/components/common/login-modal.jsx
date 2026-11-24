import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import { useAuth } from '../../hooks/use-auth.js';

/**
 * LoginModal 컴포넌트 - 아이디(이메일), 비밀번호 입력 후 로그인/회원가입을 하는 팝업 모달
 *
 * Props:
 * @param {boolean} isOpen - 모달 표시 여부 [Required]
 * @param {function} onClose - 모달을 닫을 때 호출되는 함수 [Required]
 *
 * Example usage:
 * <LoginModal isOpen={ isOpen } onClose={ handleClose } />
 */
function LoginModal({ isOpen, onClose }) {
  const { signIn, signUp } = useAuth();
  const [ isSignUpMode, setIsSignUpMode ] = useState(false);
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ message, setMessage ] = useState(null);

  /** 모달이 닫힌 뒤 입력값 초기화 */
  const handleExited = () => {
    setIsSignUpMode(false);
    setName('');
    setEmail('');
    setPassword('');
    setMessage(null);
  };

  const changeMode = (isSignUp) => {
    setIsSignUpMode(isSignUp);
    setMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      if (isSignUpMode) {
        const needsConfirm = await signUp(name.trim(), email.trim(), password);
        if (needsConfirm) {
          setMessage({ severity: 'success', text: '가입 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요.' });
          setIsSignUpMode(false);
          return;
        }
      } else {
        await signIn(email.trim(), password);
      }
      onClose();
    } catch (error) {
      setMessage({ severity: 'error', text: translateError(error.message) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={ isOpen }
      onClose={ onClose }
      fullWidth
      maxWidth="xs"
      slotProps={ { transition: { onExited: handleExited } } }
    >
      <DialogTitle sx={ { fontWeight: 700, textAlign: 'center', pt: 3 } }>
        { isSignUpMode ? '회원가입' : '로그인' }
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={ handleSubmit } sx={ { display: 'flex', flexDirection: 'column', gap: 2, pt: 1 } }>
          { message && <Alert severity={ message.severity }>{ message.text }</Alert> }
          { isSignUpMode && (
            <TextField
              label="이름"
              value={ name }
              onChange={ (event) => setName(event.target.value) }
              required
              autoComplete="name"
            />
          ) }
          <TextField
            label="아이디 (이메일)"
            type="email"
            value={ email }
            onChange={ (event) => setEmail(event.target.value) }
            required
            autoComplete="email"
          />
          <TextField
            label="비밀번호"
            type="password"
            value={ password }
            onChange={ (event) => setPassword(event.target.value) }
            required
            autoComplete={ isSignUpMode ? 'new-password' : 'current-password' }
            helperText={ isSignUpMode ? '6자 이상 입력해 주세요.' : ' ' }
            slotProps={ { htmlInput: { minLength: 6 } } }
          />
          <Box sx={ { display: 'flex', gap: 1, pb: 2 } }>
            <Button
              fullWidth
              size="large"
              variant={ isSignUpMode ? 'outlined' : 'contained' }
              type={ isSignUpMode ? 'button' : 'submit' }
              disabled={ isSubmitting }
              onClick={ isSignUpMode ? () => changeMode(false) : undefined }
            >
              { isSubmitting && !isSignUpMode ? <CircularProgress size={ 24 } /> : '로그인' }
            </Button>
            <Button
              fullWidth
              size="large"
              variant={ isSignUpMode ? 'contained' : 'outlined' }
              type={ isSignUpMode ? 'submit' : 'button' }
              disabled={ isSubmitting }
              onClick={ isSignUpMode ? undefined : () => changeMode(true) }
            >
              { isSubmitting && isSignUpMode ? <CircularProgress size={ 24 } /> : '회원가입' }
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

/** Supabase Auth 에러 메시지를 한국어로 변환한다. */
function translateError(message) {
  if (message.includes('Invalid login credentials')) {
    return '아이디 또는 비밀번호가 올바르지 않아요.';
  }
  if (message.includes('already registered')) {
    return '이미 가입된 이메일이에요.';
  }
  if (message.includes('Email not confirmed')) {
    return '이메일 인증이 아직 완료되지 않았어요. 메일함을 확인해 주세요.';
  }
  if (message.includes('rate limit')) {
    return '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.';
  }
  return message;
}

export default LoginModal;
