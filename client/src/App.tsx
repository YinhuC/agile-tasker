import React, { PropsWithChildren, useState } from 'react';
import { useLocation, Route, Routes } from 'react-router';
import { ThemeProvider } from './providers/ThemeProvider';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { Notifications } from '@mantine/notifications';
import BoardPage from './pages/BoardPage';
import { AuthContext } from './utils/context/AuthContext';
import { User } from './types/user.types';
import AuthRoute from './components/AuthRoute';
import ProjectPage from './pages/ProjectPage';
import { Flex } from '@mantine/core';
import ViewsPage from './pages/ViewsPage';
import PlansPage from './pages/PlansPage';

type Props = {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

function Providers({ children, user, setUser }: PropsWithChildren & Props) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <AuthContext.Provider value={{ user, setUser }}>
          {children}
        </AuthContext.Provider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

function App() {
  const [user, setUser] = useState<User | undefined>();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <Providers user={user} setUser={setUser}>
      <Notifications />
      {!isLoginPage && !isRegisterPage && (
        <Flex justify='center' w='100%' mb={80}>
          <Header />
        </Flex>
      )}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/views' element={<ViewsPage />} />
        <Route path='/plans' element={<PlansPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route element={<AuthRoute />}>
          <Route path='/boards/:id' element={<BoardPage />} />
          <Route path='/project/:id' element={<ProjectPage />} />
        </Route>
      </Routes>
    </Providers>
  );
}

export default App;
