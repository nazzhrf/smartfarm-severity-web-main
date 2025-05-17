import { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import {
  Dialog,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  Grid,
  FormHelperText,
  Slide,
  Typography,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// components
import Iconify from '../../../components/iconify';
import useResponsive from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setmsg] = useState('');
  const [error, seterror] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    navigate('/login', { replace: true });
    setOpen(false);
  };
  const mdUp = useResponsive('up', '970');
  const [registerValue, setRegisterValue] = useState({
    name: '',
    phone: '',
    email: '',
    username: '',
    instansi: '',
    password: '',
    confirm: '',
    level: 1,
  });
  const register = () => {
    axios
      .post(
        'https://api.smartfarm.id/user/register',
        {
          name: registerValue.name,
          phone: registerValue.phone,
          email: registerValue.email,
          username: registerValue.username,
          password: registerValue.password,
          instansi: registerValue.instansi,
          level: 1,
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
          setmsg(res.data.msg);
          seterror(0);
        }
      })
      .catch((err) => {
        setmsg(err.response.data.msg);
        seterror(1);
      });
    setOpen(true);
  };
  return (
    <>
      <Stack spacing={2} sx={{ my: 2 }}>
        {mdUp && (
          <>
            <Grid container justifyContent={'space-between'}>
              <TextField
                onChange={(e) => setRegisterValue({ ...registerValue, name: e.target.value })}
                value={registerValue.name}
                name="name"
                label="Fullname"
                InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
                InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
              />
              <TextField
                name="email"
                onChange={(e) => setRegisterValue({ ...registerValue, phone: e.target.value })}
                value={registerValue.phone}
                label="Phone"
                InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
                InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
              />
            </Grid>
            <Grid container justifyContent={'space-between'}>
              <TextField
                name="email"
                label="Email"
                onChange={(e) => setRegisterValue({ ...registerValue, email: e.target.value })}
                value={registerValue.email}
                InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
                InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
              />

              <TextField
                name="email"
                label="Username"
                onChange={(e) =>
                  setRegisterValue({
                    ...registerValue,
                    username: e.target.value,
                  })
                }
                value={registerValue.username}
                InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
                InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
              />
            </Grid>
          </>
        )}
        {!mdUp && (
          <>
            <TextField
              onChange={(e) => setRegisterValue({ ...registerValue, name: e.target.value })}
              value={registerValue.name}
              name="name"
              label="Fullname"
              InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
              InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
            />
            <TextField
              name="email"
              onChange={(e) => setRegisterValue({ ...registerValue, phone: e.target.value })}
              value={registerValue.phone}
              label="Phone"
              InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
              InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
            />
            <TextField
              name="email"
              label="Email"
              onChange={(e) => setRegisterValue({ ...registerValue, email: e.target.value })}
              value={registerValue.email}
              InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
              InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
            />
            <TextField
              name="email"
              label="Username"
              onChange={(e) =>
                setRegisterValue({
                  ...registerValue,
                  username: e.target.value,
                })
              }
              value={registerValue.username}
              InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
              InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
            />
          </>
        )}
        <TextField
          name="email"
          label="Institution"
          onChange={(e) =>
            setRegisterValue({
              ...registerValue,
              instansi: e.target.value,
            })
          }
          value={registerValue.instansi}
          InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
          InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
        />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) =>
            setRegisterValue({
              ...registerValue,
              password: e.target.value,
            })
          }
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
          value={registerValue.password}
        />
        {registerValue.password.length < 8 && registerValue.password.length !== 0 && (
          <FormHelperText sx={{ color: '#e54d42' }}>*Harus lebih dari 8 karakter</FormHelperText>
        )}
        <TextField
          name="password"
          label="Confirm Password"
          type={showPassword2 ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword2(!showPassword2)} edge="end">
                  <Iconify icon={showPassword2 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
            sx: { backgroundColor: 'white' },
          }}
          onChange={(e) =>
            setRegisterValue({
              ...registerValue,
              confirm: e.target.value,
            })
          }
          value={registerValue.confirm}
        />
        {registerValue.password !== registerValue.confirm && registerValue.confirm.length !== 0 && (
          <FormHelperText sx={{ color: '#e54d42' }}>*Harus sama dengan kata sandi</FormHelperText>
        )}
      </Stack>

      <Button
        disabled={
          registerValue.email.length === 0 ||
          registerValue.name.length === 0 ||
          registerValue.phone.length === 0 ||
          registerValue.username.length === 0 ||
          registerValue.confirm.length === 0 ||
          registerValue.password.length === 0 ||
          registerValue.confirm !== registerValue.password
        }
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={register}
      >
        Register
      </Button>
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
          {error === 0 && (
            <Typography variant="title" align="center">
              Success
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
          {error === 0 && <Button onClick={handleClick}>Go Back!</Button>}
          {error === 1 && <Button onClick={handleClose}>Close</Button>}
        </DialogActions>
      </Dialog>
    </>
  );
}
