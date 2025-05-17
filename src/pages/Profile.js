import React, { useEffect, useState, forwardRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Button,
  Typography,
  Container,
  Box,
  Stack,
  Avatar,
  Grid,
  TextField,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Dialog,
  Slide,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Iconify from '../components/iconify';
// mocks
import account from '../_mock/account';
// hooks
import axiosInstance from '../hooks/axiosInstance';

// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const Profile = () => {
  const userid = localStorage.getItem('token');
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dataError, setDataError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [msg, setmsg] = useState('');
  const [error, seterror] = useState(0);
  const handleClick = () => {
    setOpen(false);
  };
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/user/find/${userid}`);
        setUserData(response.data.data[0]);
        setFormData({
          Fullname: response.data.data[0].name,
          Username: response.data.data[0].username,
          Email: response.data.data[0].email,
          Phone: response.data.data[0].phone,
          Instansi: response.data.data[0].instansi,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [userid]);

  if (!userData || !formData) {
    return (
      <>
        <Helmet>
          <title>Profile | Plant Growth Chamber</title>
        </Helmet>
        <div>Loading user data...</div>
      </>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInputPasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmitData = async () => {
    setDataError(null);
    if (!validateForm()) {
      setDataError('Please fill in all the mandatory fields.');
      return;
    }
    try {
      await axiosInstance
        .put(`/user/edit/${userid}`, {
          name: formData.Fullname,
          username: formData.Username,
          email: formData.Email,
          phone: formData.Phone,
          instansi: formData.Instansi,
        })
        .then((res) => {
          if (res.status === 200) {
            setmsg(res.data.msg);
            seterror(0);
          }
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        })
        .catch((err) => {
          setmsg(err.response.data.msg);
          seterror(1);
        });
      setOpen(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleSubmitPassword = async () => {
    setPasswordError(null);
    if (
      formData['Current Password'] == null &&
      formData['New Password'] == null &&
      formData['Confirm Password'] == null
    ) {
      setPasswordError('Please fill in all the password fields correctly.');
      return;
    }
    if (formData['New Password'] !== formData['Confirm Password']) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }
    try {
      await axiosInstance
        .put(`/user/changepass/${userid}`, {
          password: formData['Current Password'],
          new_password: formData['New Password'],
        })
        .then((res) => {
          if (res.status === 200) {
            setmsg(res.data.msg);
            seterror(0);
            // Clear the password fields
            setFormData((prevFormData) => ({
              ...prevFormData,
              'Current Password': '',
              'New Password': '',
              'Confirm Password': '',
            }));
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 2000);
          }
        })
        .catch((err) => {
          setmsg(err.response.data.msg);
          seterror(1);
        });
      setOpen(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const validateForm = () => {
    const { Fullname, Username, Email, Phone, Instansi } = formData;
    return Fullname && Username && Email && Phone && Instansi;
  };

  return (
    <>
      <Helmet>
        <title>Profile | Plant Growth Chamber</title>
      </Helmet>
      <Container sx={{ marginTop: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          <Button to="/" size="large" variant="contained" component={RouterLink} sx={{ justifySelf: 'flex-end' }}>
            Go to Home
          </Button>
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={account.photoURL} alt="User Avatar" sx={{ width: 80, height: 80 }} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h4">{userData.name}</Typography>
            <Typography variant="subtitle1">{userData.instansi}</Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1">
            <strong>Username:</strong> {userData.username}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {userData.email}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {userData.phone}
          </Typography>
          <Typography variant="body1">
            <strong>Role:</strong> {userData.level === 2 ? 'Admin/Teknisi' : 'Customer'}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: 'dashed', mt: 2 }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2}>
          <Typography variant="h4" gutterBottom>
            Edit Profile
          </Typography>
        </Stack>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Stack spacing={1} sx={{ my: 1 }}>
              <TextField
                name="Fullname"
                label="Fullname"
                defaultValue={formData.Fullname}
                onChange={handleInputChange}
              />
              <TextField
                name="Username"
                label="Username"
                defaultValue={formData.Username}
                onChange={handleInputChange}
              />
              <TextField name="Email" label="Email" defaultValue={formData.Email} onChange={handleInputChange} />
              <TextField name="Phone" label="Phone" defaultValue={formData.Phone} onChange={handleInputChange} />
              <TextField
                name="Instansi"
                label="Instansi"
                defaultValue={formData.Instansi}
                onChange={handleInputChange}
              />
              {dataError && <Alert severity="error">{dataError}</Alert>}
              <Button fullWidth size="large" variant="contained" onClick={handleSubmitData}>
                Submit Change Data
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ borderStyle: 'dashed', mt: 2 }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2}>
          <Typography variant="h4" gutterBottom>
            Change Password
          </Typography>
        </Stack>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Stack spacing={1} sx={{ my: 1 }}>
              <TextField
                name="Current Password"
                label="Current Password"
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
                value={formData['Current Password'] || ''}
                onChange={handleInputPasswordChange}
              />

              <TextField
                name="New Password"
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                        <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { backgroundColor: 'white' },
                }}
                value={formData['New Password'] || ''}
                onChange={handleInputPasswordChange}
              />
              <TextField
                name="Confirm Password"
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { backgroundColor: 'white' },
                }}
                value={formData['Confirm Password'] || ''}
                onChange={handleInputPasswordChange}
              />
              {passwordError && <Alert severity="error">{passwordError}</Alert>}
              <Button
                disabled={
                  formData['Current Password'] == null ||
                  formData['New Password'] == null ||
                  formData['Confirm Password'] == null
                }
                fullWidth
                size="large"
                variant="contained"
                onClick={handleSubmitPassword}
              >
                Submit Change Password
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
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
};

export default Profile;
