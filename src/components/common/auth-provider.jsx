import { useCallback, useEffect, useMemo, useState } from 'react';

import { supabase } from '../../lib/supabase.js';
import { AuthContext } from '../../hooks/auth-context.js';

/**
 * AuthProvider 컴포넌트 - Supabase Auth 세션과 users 프로필을 앱 전체에 제공한다.
 *
 * Props:
 * @param {node} children - 감쌀 하위 컴포넌트 [Required]
 *
 * Example usage:
 * <AuthProvider><App /></AuthProvider>
 */
function AuthProvider({ children }) {
  const [ user, setUser ] = useState(null);
  const [ profile, setProfile ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(true);

  /** 세션 복원 및 로그인 상태 변화 구독 */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (!data.session) {
        setIsLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  /** 로그인한 사용자의 users 프로필 조회 */
  useEffect(() => {
    if (!user) {
      return;
    }
    let isCancelled = false;
    supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('auth_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!isCancelled) {
          setProfile(data);
          setIsLoading(false);
        }
      });
    return () => {
      isCancelled = true;
    };
  }, [ user ]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  }, []);

  /** @returns {Promise<boolean>} 이메일 인증이 필요하면 true */
  const signUp = useCallback(async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      throw error;
    }
    return !data.session;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ user, profile, isLoading, signIn, signUp, signOut }),
    [ user, profile, isLoading, signIn, signUp, signOut ]
  );

  return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
}

export default AuthProvider;
