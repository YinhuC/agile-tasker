import { useContext } from 'react';
import { AuthContext } from '../utils/context/AuthContext';

/** Reads the signed-in user that App fetches once per page load. */
export function useAuth() {
  const { user, setUser, loading } = useContext(AuthContext);

  const removeUser = () => {
    setUser(undefined);
  };

  return { user, setUser, loading, removeUser };
}
