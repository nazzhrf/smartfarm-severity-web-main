import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import axiosInstance from '../../hooks/axiosInstance';
import Header from './header';

import NavAdmin from './nav/adminIndex';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', level: '' }); // Initialize userData as an object here
  const userid = localStorage.getItem('token');
  useEffect(() => {
    axiosInstance
      .get(`/user/find/${userid}`)
      .then((response) => {
        const { data } = response.data;
        const user = data[0];
        const updatedUserData = {
          name: user.name,
          level: user.level,
        };
        setUserData(updatedUserData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} userData={userData} />

      <NavAdmin openNav={open} onCloseNav={() => setOpen(false)} userData={userData} setUserData={setUserData} />

      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
