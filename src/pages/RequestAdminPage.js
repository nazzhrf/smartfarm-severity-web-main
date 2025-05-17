import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, forwardRef } from 'react';
import {
  Table,
  Stack,
  Paper,
  Grid,
  Button,
  Dialog,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Container,
  Typography,
  Slide,
  Snackbar,
  Alert,
  TableContainer,
  TextField,
  IconButton,
} from '@mui/material';
import { FileCopy } from '@mui/icons-material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AppWidgetSummary } from '../sections/@dashboard/app';
import Label from '../components/label';
import axiosInstance from '../hooks/axiosInstance';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const CENSORED_CHARACTERS = 2;

export default function RequestAdminPage() {
  const [deviceData, setDeviceData] = useState({
    code_device: '',
    alamat: '',
  });
  const [listDevice, setListDevice] = useState([]);
  const [Username, setUsername] = useState('');
  const [NameDevice, setNameDevice] = useState('');
  const [requestData, setRequestData] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [msg, setmsg] = useState('');
  const [error, seterror] = useState(0);
  const [zero, setZero] = useState(false);
  const [noRequest, setNoRequest] = useState(false);

  const postRequest = () => {
    axiosInstance
      .post('/request/acc', {
        username: Username,
        code_device: NameDevice,
      })
      .then((res) => {
        if (res.status === 200) {
          setOpen(false);
          setOpen2(true);
        }
      })
      .catch((err) => {
        setmsg(err.response.data.msg);
        seterror(1);
      });
  };

  const deleteRequest = () => {
    axiosInstance
      .delete('/request/delete', {
        data: { username: Username, code_device: NameDevice },
      })
      .then((res) => {
        if (res.status === 200) {
          setOpen(false);
          setOpen2(true);
        }
      })
      .catch((err) => {
        setmsg(err.response.data.msg);
        seterror(1);
      });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen2(false);
  };

  const handleClick = () => {
    window.location.reload(true);
    setOpen(false);
  };

  const accept = (username, deviceCode) => {
    setOpen(true);
    seterror(2);
    setmsg('Are You Sure Want To Accept This Request?');
    setUsername(username);
    setNameDevice(deviceCode);
  };

  const reject = (username, deviceCode) => {
    setOpen(true);
    seterror(3);
    setmsg('Are You Sure Want To Reject This Request?');
    setUsername(username);
    setNameDevice(deviceCode);
  };

  const register = () => {
    axiosInstance
      .post('/device/create', {
        code_device: deviceData.code_device,
        alamat: deviceData.alamat,
      })
      .then((res) => {
        if (res.status === 200) {
          setmsg(res.data.msg);
          seterror(0);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      })
      .catch((err) => {
        setmsg(err.response.data.msg);
        seterror(1);
      });
    setOpen(true);
  };

  const handleCopyToClipboard = (deviceKey) => {
    const textField = document.createElement('textarea');
    textField.innerText = deviceKey;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

  const getPartiallyCensoredDeviceKey = (deviceKey) => {
    const prefix = deviceKey.substring(0, CENSORED_CHARACTERS);
    return `${prefix}**..`;
  };

  useEffect(() => {
    axiosInstance.get('/device/find').then((response) => {
      if (response.data.msg === 'Device not found') {
        setZero(true);
      } else {
        setZero(false);
      }
      setListDevice(response.data.data);
    });
  }, []);

  useEffect(() => {
    const fetchData = () => {
      axiosInstance.get(`/request/list`).then((response) => {
        setNoRequest(false);
        setRequestData(response.data.data);
      });
    };

    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title> Admin | Plant Growth Chamber </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Device List
          </Typography>
        </Stack>
        {zero ? (
          <AppWidgetSummary title="There is no Device" color="error" icon={'ic:sharp-error'} />
        ) : (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Device Id</TableCell>
                  <TableCell>Code Device</TableCell>
                  <TableCell>Alamat</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Device Key</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listDevice.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.code_device}</TableCell>
                    <TableCell>{row.alamat}</TableCell>
                    <TableCell>
                      <Label color="success">Can Access</Label>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {getPartiallyCensoredDeviceKey(row.device_key)}
                        <IconButton onClick={() => handleCopyToClipboard(row.device_key)}>
                          <FileCopy />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2}>
          <Typography variant="h4" gutterBottom>
            Request Access Approval
          </Typography>
        </Stack>
        {!noRequest && requestData.length === 0 ? (
          <AppWidgetSummary
            title="There is no request that you havent check, have a good day"
            color="success"
            icon={'mdi:success-bold'}
          />
        ) : (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Institution</TableCell>
                  <TableCell>Requested Device</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requestData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.instansi}</TableCell>
                    <TableCell>{row.code_device}</TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => accept(row.username, row.code_device)}
                        variant="contained"
                        color="success"
                        sx={{ mx: 2, mb: 2 }}
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => reject(row.username, row.code_device)}
                        variant="contained"
                        color="error"
                        sx={{ mb: 2 }}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2}>
          <Typography variant="h4" gutterBottom>
            Register Device
          </Typography>
        </Stack>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Stack spacing={3} sx={{ my: 2 }}>
              <TextField
                name="Code Device"
                label="Code Device"
                InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
                InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
                value={deviceData.code_device}
                onChange={(e) => setDeviceData({ ...deviceData, code_device: e.target.value })}
              />
              <TextField
                name="Address"
                label="Address"
                InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
                InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
                value={deviceData.alamat}
                onChange={(e) => setDeviceData({ ...deviceData, alamat: e.target.value })}
              />
              <Button
                disabled={deviceData.code_device.length === 0 || deviceData.alamat.length === 0}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={register}
              >
                Register
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
          {error === 2 && (
            <Typography variant="title" align="center">
              Alert
            </Typography>
          )}
          {error === 3 && (
            <Typography variant="title" align="center">
              Alert
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
          {error === 0 ? (
            <Button onClick={handleClick}>Refresh</Button>
          ) : error === 1 ? (
            <Button onClick={handleClose}>Close</Button>
          ) : error === 2 ? (
            <Container
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                justifyItems: 'center',
                alignContent: 'center',
              }}
            >
              <Button onClick={postRequest}>Yes </Button>
              <Button onClick={handleClose}>No </Button>
            </Container>
          ) : (
            <Container
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                justifyItems: 'center',
                alignContent: 'center',
              }}
            >
              <Button onClick={deleteRequest}>Yes </Button>
              <Button onClick={handleClose}>No </Button>
            </Container>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar open={open2} autoHideDuration={5000} onClose={handleClose2}>
        <Alert onClose={handleClose2} severity="success" sx={{ width: '100%' }}>
          Success
        </Alert>
      </Snackbar>
    </>
  );
}
