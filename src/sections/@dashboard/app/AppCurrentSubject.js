import PropTypes from 'prop-types';
import { useState, useEffect, forwardRef } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Card, CardHeader, Stack, TextField, Divider, Button, Slide, Dialog, Typography } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// hooks
import axiosInstance from '../../../hooks/axiosInstance';
// ----------------------------------------------------------------------

const CHART_HEIGHT = 460;
const LEGEND_HEIGHT = 72;
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const StyledChartWrapper = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  '& .apexcharts-canvas svg': {
    height: CHART_HEIGHT,
  },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

AppCurrentSubject.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  subheader2: PropTypes.string,
  deviceId: PropTypes.string,
  jwtToken: PropTypes.string,
};

export default function AppCurrentSubject({ title, subheader, subheader2, deviceId, jwtToken, ...other }) {
  const [setpoinValue, setsetpoinValue] = useState({
    temperature: '',
    humidity: '',
    intensity: '',
    mode: '',
  });
  const [open, setOpen] = useState(false);
  const [msg, setmsg] = useState('');
  const [error, seterror] = useState(null);
  let callbackTimeout;

  useEffect(() => {
    const savedSetpointValue = localStorage.getItem('setpoinValue');
    if (savedSetpointValue) {
      setsetpoinValue(JSON.parse(savedSetpointValue));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('setpoinValue', JSON.stringify(setpoinValue));
  }, [setpoinValue]);

  const handleClose = () => {
    setOpen(false);
  };

  const setter = () => {
    axiosInstance
      .post(`/condition/setpoint/${deviceId}`, {
        temperature: parseFloat(setpoinValue.temperature),
        humidity: parseFloat(setpoinValue.humidity),
        intensity: parseFloat(setpoinValue.intensity),
        mode: setpoinValue.mode,
      })
      .then((res) => {
        if (res.status === 200) {
          clearTimeout(callbackTimeout);
          seterror(2);
          setmsg('Waiting device processing the data');
          const subEventSource = new EventSource(
            `https://api.smartfarm.id/condition/get-events-callback/${deviceId}?jwt_token=${jwtToken}`
          );
          subEventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.message === "Setpoint settings received") {
              setmsg('Set point settings received');
              seterror(0);
              subEventSource.close();
              clearTimeout(callbackTimeout);
            }
            callbackTimeout = setTimeout(() => {
              setmsg('Set point sent but not received well by Device, try again later');
              seterror(1);
              subEventSource.close();
            }, 12000);
          };
        }
      })
      .catch((err) => {
        setmsg(err.response.data.msg);
        seterror(1);
      });
    setOpen(true);
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <StyledChartWrapper dir="ltr">
        <Stack spacing={2} sx={{ my: 2, mx: 3 }}>
          <TextField
            name="Temperature"
            label="Temperature"
            InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
            InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
            type="number"
            onChange={(e) => setsetpoinValue({ ...setpoinValue, temperature: e.target.value })}
            value={setpoinValue.temperature}
          />
          <TextField
            name="Humidity"
            label="Humidity"
            InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
            InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
            type="number"
            onChange={(e) => setsetpoinValue({ ...setpoinValue, humidity: e.target.value })}
            value={setpoinValue.humidity}
          />
          <TextField
            name="Intensity"
            label="Intensity"
            InputProps={{ sx: { backgroundColor: 'white', borderColor: '#6D9886' } }}
            InputLabelProps={{ sx: { outlineColor: '#6D9886' } }}
            type="number"
            onChange={(e) => setsetpoinValue({ ...setpoinValue, intensity: e.target.value })}
            value={setpoinValue.intensity}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Mode</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Mode"
              onChange={(e) => setsetpoinValue({ ...setpoinValue, mode: e.target.value })}
              value={setpoinValue.mode}
            >
              <MenuItem value={'Day'}>Day</MenuItem>
              <MenuItem value={'Night'}>Night</MenuItem>
            </Select>
          </FormControl>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Button
            disabled={
              setpoinValue.temperature.length === 0 ||
              setpoinValue.humidity.length === 0 ||
              setpoinValue.intensity.length === 0 ||
              setpoinValue.mode.length === 0
            }
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={setter}
          >
            SET
          </Button>
        </Stack>
        <CardHeader subheader={subheader2} />
      </StyledChartWrapper>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {error === 1 && (
            <Typography variant="h3" align="center">
              Failure
            </Typography>
          )}
          {error === 0 && (
            <Typography variant="h3" align="center">
              Success
            </Typography>
          )}
          {error === 2 && (
            <Typography variant="h3" align="center">
              Loading...
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
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}