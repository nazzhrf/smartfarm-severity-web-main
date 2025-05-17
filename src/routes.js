import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import AdminLayout from './layouts/dashboard/AdminLayout';
//

import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import Profile from './pages/Profile';
import DashboardAppPage from './pages/DashboardAppPage';
import MonitorPage from './pages/MonitorPage';
import RegisteredUserPage from './pages/RegisteredUserPage';
import Register from './pages/RegisterPage';
import AccessPage from './pages/AccessPage';
import RequestAdminPage from './pages/RequestAdminPage';
import SeverityLogPage from './pages/SeverityLogPage';

// ----------------------------------------------------------------------

export default function Router() {
  const isUserLoggedIn = localStorage.getItem('token') && localStorage.getItem('jwtToken');
  const userLevel = localStorage.getItem('level');
  const routes = useRoutes([
    {
      path: '/',
      element:
        isUserLoggedIn && userLevel === '2' ? (
          <Navigate to="/admin" />
        ) : isUserLoggedIn && userLevel === '1' ? (
          <Navigate to="/dashboard" />
        ) : (
          <LoginPage />
        ),
    },
    {
      path: '/dashboard',
      element:
        isUserLoggedIn && userLevel === '1' ? (
          <DashboardLayout />
        ) : isUserLoggedIn && userLevel === '2' ? (
          <Navigate to="/admin/dashboard" />
        ) : (
          <Navigate to="/" />
        ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        {
          path: 'app',
          element:
            isUserLoggedIn && userLevel === '1' ? (
              <DashboardAppPage />
            ) : isUserLoggedIn && userLevel === '2' ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/" />
            ),
        },
        {
          path: 'access',
          element:
            isUserLoggedIn && userLevel === '1' ? (
              <AccessPage />
            ) : isUserLoggedIn && userLevel === '2' ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/" />
            ),
        },
        {
          path: 'severity-log',
          element:
            isUserLoggedIn && userLevel === '1' ? (
              <SeverityLogPage />
            ) : isUserLoggedIn && userLevel === '2' ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/" />
            ),
        },
        {
          path: 'monitor',
          element:
            isUserLoggedIn && userLevel === '1' ? (
              <MonitorPage />
            ) : isUserLoggedIn && userLevel === '2' ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/" />
            ),
        },
        {
          path: 'user',
          element:
            isUserLoggedIn && userLevel === '1' ? (
              <RegisteredUserPage />
            ) : isUserLoggedIn && userLevel === '2' ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/" />
            ),
        },
      ],
    },
    {
      path: '/admin',
      element:
        isUserLoggedIn && userLevel === '1' ? (
          <Navigate to="/" />
        ) : isUserLoggedIn && userLevel === '2' ? (
          <AdminLayout />
        ) : (
          <Navigate to="/" />
        ),
      children: [
        { element: <Navigate to="/admin/request" />, index: true },
        {
          path: 'request',
          element:
            isUserLoggedIn && userLevel === '1' ? (
              <Navigate to="/" />
            ) : isUserLoggedIn && userLevel === '2' ? (
              <RequestAdminPage />
            ) : (
              <Navigate to="/" />
            ),
        },
        {
          path: 'dashboard',
          element:
            isUserLoggedIn && userLevel === '1' ? (
              <Navigate to="/" />
            ) : isUserLoggedIn && userLevel === '2' ? (
              <DashboardAppPage />
            ) : (
              <Navigate to="/" />
            ),
        },
        {
          path: 'monitor',
          element:
            isUserLoggedIn && userLevel === '1' ? (
              <Navigate to="/" />
            ) : isUserLoggedIn && userLevel === '2' ? (
              <MonitorPage />
            ) : (
              <Navigate to="/" />
            ),
        },
        {
          path: 'severity-log',
          element:
            isUserLoggedIn && userLevel === '1' ? (
              <Navigate to="/" />
            ) : isUserLoggedIn && userLevel === '2' ? (
              <MonitorPage />
            ) : (
              <Navigate to="/" />
            ),
        },
        {
          path: 'user',
          element:
            isUserLoggedIn && userLevel === '1' ? (
              <RegisteredUserPage />
            ) : isUserLoggedIn && userLevel === '2' ? (
              <RegisteredUserPage />
            ) : (
              <Navigate to="/" />
            ),
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/profile',
      element: isUserLoggedIn ? <Profile /> : <Navigate to="/" />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '*',
      element: <SimpleLayout />,
      children: [
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
  ]);

  return routes;
}
