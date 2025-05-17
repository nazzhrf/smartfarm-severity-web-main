import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography } from '@mui/material';
// hooks
import RegisterForm from '../sections/auth/login/RegisterForm';
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
  backgroundColor: theme.palette.background.brown,
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.black,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
  backgroundColor: theme.palette.background.brown,
}));

export default function Register() {
  const mdUp = useResponsive('up', 'md');
  return (
    <>
      <Helmet>
        <title> Register | Plant Growth Chamber </title>
      </Helmet>
      <StyledRoot>
        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Register
            </Typography>

            <Typography variant="body2" sx={{ mb: 2 }}>
              Already Have an Account? {''}
              <Link variant="subtitle2" href="/login">
                Log in
              </Link>
            </Typography>

            <RegisterForm />
          </StyledContent>
        </Container>

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5, ml: 5 }} color={'white'}>
              Register your Account
            </Typography>
            <img
              src="/assets/illustrations/chamber_serong_kiri.png"
              alt="login"
              width="400"
              height="360"
              style={{ marginLeft: 45 }}
            />
          </StyledSection>
        )}
        <Logo
          disabledLink
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 20 },
          }}
        />
      </StyledRoot>
    </>
  );
}
