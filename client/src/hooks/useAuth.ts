import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../utils/context/AuthContext';
import { getAuthUser } from '../api/auth.api';
import { useLocation } from 'react-router';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(AuthContext);
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    const controller = new AbortController();

    const fetchAuthUser = async () => {
      try {
        if (
          pathname !== '/' &&
          pathname !== '/login' &&
          pathname !== '/register'
        ) {
          const response = await getAuthUser();
          const { data } = response;
          setUser(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchAuthUser();

    return () => {
      controller.abort();
    };
  }, [pathname, setUser]);

  const removeUser = () => {
    setUser(undefined);
  };

  return { user, loading, removeUser };
}
