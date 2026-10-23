import { useAuth } from '../../auth';

export function useUsuario() {
    const {usuario} = useAuth();
    return usuario;
}