import React, {
  lazy,
  PropsWithChildren,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, Navigate, Route, Routes } from 'react-router';
import { ThemeProvider } from './providers/ThemeProvider';
import Header from './components/Header';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { Notifications } from '@mantine/notifications';
import { AuthContext } from './utils/context/AuthContext';
import { User } from './types/user.types';
import AuthRoute from './components/AuthRoute';
import { Flex } from '@mantine/core';
import { getAuthUser } from './api/auth.api';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const BoardPage = lazy(() => import('./pages/BoardPage'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));

const PUBLIC_PATHS = ['/', '/login', '/register'];

type Props = {
  user?: User;
  setUser: (data: User | undefined) => void;
  loading: boolean;
};

function Providers({
  children,
  user,
  setUser,
  loading,
}: PropsWithChildren & Props) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <AuthContext.Provider value={{ user, setUser, loading }}>
          {children}
        </AuthContext.Provider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

function App() {
  const [user, setUser] = useState<User | undefined>();
  const [authChecked, setAuthChecked] = useState(false);
  const authRequested = useRef(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const needsAuth = !PUBLIC_PATHS.includes(location.pathname);

  /** Signing in or out settles who the user is, so no session check is needed after it. */
  const updateUser = useCallback((data: User | undefined) => {
    setUser(data);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (!needsAuth || authChecked || authRequested.current) {
      return;
    }
    authRequested.current = true;
    getAuthUser()
      .then(({ data }) => setUser(data))
      .catch(() => setUser(undefined))
      .finally(() => setAuthChecked(true));
  }, [needsAuth, authChecked]);

  return (
    <Providers user={user} setUser={updateUser} loading={!authChecked}>
      <Notifications />
      {!isLoginPage && !isRegisterPage && (
        <Flex justify='center' w='100%' mb={64}>
          <Header />
        </Flex>
      )}
      <Suspense fallback={null}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route element={<AuthRoute />}>
            <Route path='/boards/:id' element={<BoardPage />} />
            <Route path='/project/:id' element={<ProjectPage />} />
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Suspense>
    </Providers>
  );
}

export default App;
