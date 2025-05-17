import { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Dialog, Stack, IconButton, InputAdornment, TextField, Slide, Button, Typography } from '@mui/material';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// req
import axios from 'axios';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function LoginForm() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [showPassword, setShowPassword] = useState(false);
  const [loginValue, setLoginValue] = useState({
    umail: '',
    password: '',
  });
  const [msg, setmsg] = useState('');
  const [error, seterror] = useState(0);
  const login = (e) => {
    e.preventDefault();

    axios
      .post(
        'https://api.smartfarm.id/user/login',
        {
          umail: loginValue.umail,
          password: loginValue.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('jwtToken', res.data.jwt_token);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('level', res.data.level);
          seterror(0);
          setTimeout(() => {
            if (res.data.level === 1) {
              navigate('/dashboard', { replace: true });
            } else if (res.data.level === 2) {
              navigate('/admin/monitor', { replace: true });
            }
          }, 0);
        }
      })
      .catch((err) => {
        setmsg(err.response.data.msg);
        seterror(1);
        setOpen(true);
      });
  };

  return (
    <>
      <form onSubmit={login}>
        <Stack spacing={3} sx={{ my: 2 }}>
          <TextField
            name="email"
            label="Email or Username"
            InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
            InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
            onChange={(e) => setLoginValue({ ...loginValue, umail: e.target.value })}
            value={loginValue.umail}
          />

          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { backgroundColor: 'white' },
            }}
            onChange={(e) => setLoginValue({ ...loginValue, password: e.target.value })}
            value={loginValue.password}
          />
        </Stack>

        <Button
          disabled={loginValue.umail.length === 0 || loginValue.password.length === 0}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={login}
        >
          Login
        </Button>
      </form>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            justifyItems: 'center',
            alignContent: 'center',
          }}
        >
          {error === 1 && (
            <Typography variant="title" align="center">
              Failure
            </Typography>
          )}
        </DialogTitle>

        <DialogContent
          sx={{
            placeItems: 'center',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            justifyItems: 'center',
            alignContent: 'center',
          }}
        >
          <DialogContentText id="alert-dialog-slide-description">{msg}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          {error === 1 && <Button onClick={handleClose}>Close</Button>}
        </DialogActions>
      </Dialog>
    </>
  );
}
