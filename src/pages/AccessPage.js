import { Helmet } from 'react-helmet-async';

import React, { useState, useEffect, forwardRef } from 'react';
// @mui
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
  InputLabel,
  TableContainer,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { FileCopy } from '@mui/icons-material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AppWidgetSummary } from '../sections/@dashboard/app';
import axiosInstance from '../hooks/axiosInstance';
// components
import Label from '../components/label';

// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const CENSORED_CHARACTERS = 2;

// ----------------------------------------------------------------------

function compareById(a, b) {
  return a.id - b.id;
}
export default function UserPage() {
  const [deviceData, setDeviceData] = useState([]);
  const [listDevice, setListDevice] = useState([]);
  const [userData, setUserData] = useState({});
  const [NameDevice, setNameDevice] = useState('');
  const [equal, setEqual] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setmsg] = useState('');
  const [error, seterror] = useState(0);
  const [zero, setZero] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(false);
  };
  const register = () => {
    axiosInstance
      .post('/request/create', {
        username: userData,
        code_device: NameDevice,
      })
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
    const userID = localStorage.getItem('token');
    axiosInstance.get('/device/list-name').then((response) => {
      setListDevice(response.data.data);
    });
    axiosInstance.get(`/device/list/${userID}`).then((response) => {
      if (response.data.msg === 'Didnt have access') {
        setZero(true);
      } else {
        setZero(false);
      }
      setDeviceData(response.data.data);
    });
    axiosInstance
      .get(`/user/find/${userID}`)
      .then((response) => {
        const { data } = response.data;
        const user = data[0];
        setUserData(user.username);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

    listDevice.sort(compareById);
    deviceData.sort(compareById);
    if (JSON.stringify(listDevice) === JSON.stringify(deviceData) && listDevice.length !== 0) {
      setEqual(true);
    } else {
      setEqual(false);
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Helmet>
        <title> Access | Plant Growth Chamber </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Device List
          </Typography>
        </Stack>
        {zero ? (
          <AppWidgetSummary title="You Didnt Have Acces to any device" color="error" icon={'ic:sharp-error'} />
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
                {deviceData.map((row) => (
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
            Request Access
          </Typography>
        </Stack>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            {equal ? (
              <AppWidgetSummary
                title="You Already Have Access for All Chamber"
                color="success"
                icon={'mdi:success-bold'}
              />
            ) : (
              <Stack spacing={3} sx={{ my: 2 }}>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="demo-simple-select-label">Device</InputLabel>
                  <Select
                    id="demo-select-small"
                    onChange={(e) => {
                      setNameDevice(e.target.value);
                    }}
                    label="Device"
                    value={NameDevice}
                    defaultValue=""
                  >
                    {listDevice.map((device) => (
                      <MenuItem key={device.id} value={device.code_device}>
                        {device.code_device}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  disabled={NameDevice.length === 0}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  onClick={register}
                >
                  Request
                </Button>
              </Stack>
            )}
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
}
