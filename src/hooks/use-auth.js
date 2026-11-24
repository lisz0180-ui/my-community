import { useContext } from 'react';

import { AuthContext } from './auth-context.js';

/**
 * 인증 정보를 가져오는 커스텀 훅
 *
 * @returns {{ profile: object|null, isLoading: boolean, signIn: function, signUp: function, signOut: function }}
 *
 * Example usage:
 * const { profile, signOut } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
}
