import { createContext } from 'react';

/** 인증 정보(user, profile, signIn, signUp, signOut 등)를 공유하는 Context */
export const AuthContext = createContext(null);
