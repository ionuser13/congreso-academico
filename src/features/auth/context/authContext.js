import { createContext } from 'react';

// Contexto de autenticación (HU-1). Lo consumen todas las historias con useAuth().
export const AuthContext = createContext(null);
