// @mui
import PropTypes from 'prop-types';
import { Card, Typography, MenuItem, Select, FormControl, Paper, Button, Stack, Slide } from '@mui/material';
import { useState, forwardRef } from 'react';
import Carousel from 'react-material-ui-carousel';

// @mui for loading modal
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// hooks
import axiosInstance from '../../../hooks/axiosInstance';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

PhotoCamera.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string.isRequired,
  arraytop: PropTypes.array,
  arraybot: PropTypes.array,
  arraytopRight: PropTypes.array,
  arraybotRight: PropTypes.array,
  arrayuser: PropTypes.array,
  sx: PropTypes.object,
};

export default function PhotoCamera({
  title,
  color = 'primary',
  arraytop,
  arraybot,
  arraytopRight,
  arraybotRight,
  arrayuser,
  sx,
  ...other
}) {
  const [position, setPosition] = useState(0);
  const [error, seterror] = useState(null);
  const [open, setOpen] = useState(false);
  const [msg, setmsg] = useState('');
  let callbackTimeout;

  const handleClose = () => {
    setOpen(false);
  };

  const takePhoto = () => {
    const deviceId = localStorage.getItem('device_id');
    const jwtToken = localStorage.getItem('jwtToken');
    axiosInstance
      .post(`/condition/setpoint/${deviceId}`, {
        take_photos: 'images',
      })
      .then((res) => {
        if (res.status === 200) {
          clearTimeout(callbackTimeout);
          seterror(2);
          setmsg('Waiting device taking photo');
          const subEventSource = new EventSource(
            `https://api.smartfarm.id/condition/get-events-callback/${deviceId}?jwt_token=${jwtToken}`
          );
          subEventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.message === "Camera command received") {
              setmsg('Take photo successfully, you can refresh the page to see new photos');
              seterror(0);
              subEventSource.close();
              clearTimeout(callbackTimeout);
            }
            callbackTimeout = setTimeout(() => {
              setmsg('Command to take photo not received well by Device, try again later');
              seterror(1);
              subEventSource.close();
              clearTimeout(callbackTimeout);
            }, 20000)
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
    <Card
      sx={{
        py: 1,
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        alignItems: 'center',
        justifyContent: 'center',
        justifyItems: 'center',
        alignContent: 'center',
        ...sx,
      }}
      {...other}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FormControl sx={{ m: 1, minWidth: 120, minHeight: 5, my: 0.5, backgroundColor: 'white' }} size="small">
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            onChange={(e) => setPosition(e.target.value)}
            value={position}
          >
            <MenuItem value={0}>Top Camera</MenuItem>
            <MenuItem value={1}>Bottom Camera</MenuItem>
            <MenuItem value={2}>Top Right Camera</MenuItem>
            <MenuItem value={3}>Bottom Right Camera</MenuItem>
            <MenuItem value={4}>User Camera</MenuItem>
          </Select>
        </FormControl>
      </div>
      {position === 0 && arraytop.length !== 0 ? (
        <Carousel
          sx={{
            bgcolor: (theme) => theme.palette[color].lighter,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
            alignContent: 'center',
            width: '100%', 
            maxWidth: '300px', 
          }}
        >
          {arraytop.map((item, i) => (
            <Paper
              sx={{
                bgcolor: (theme) => theme.palette[color].lighter,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                justifyItems: 'center',
                alignContent: 'center',
              }}
              key={i}
            >
              <img
                src={`https://api.smartfarm.id${item.file_url}`}
                alt="login"
                width="300"
                height="175"
                style={{
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  justifyItems: 'center',
                  alignContent: 'center',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
              <Stack>
                <Typography variant="p" sx={{ opacity: 0.72 }}>
                  Timestamp: {item.uploaded_at.match(/(?<=)(.*)(?=T)/gm)} {item.uploaded_at.match(/(?<=T)(.*)(?=:)/gm)}
                </Typography>
                <Button
                  size="medium"
                  type="submit"
                  variant="contained"
                  onClick={takePhoto}
                  sx={{
                    m: 1,
                    ml: 2,
                    minWidth: 120,
                    backgroundColor: 'primary.main',
                    color: 'white',
                  }}
                >
                  Take Photo
                </Button>
              </Stack>
            </Paper>
          ))}
        </Carousel>
      ) : position === 1 && arraybot.length !== 0 ? (
        <Carousel
          sx={{
            bgcolor: (theme) => theme.palette[color].lighter,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
            alignContent: 'center',
            width: '100%', 
            maxWidth: '300px', 
          }}
        >
          {arraybot.map((item, i) => (
            <Paper
              sx={{
                bgcolor: (theme) => theme.palette[color].lighter,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                justifyItems: 'center',
                alignContent: 'center',
              }}
              key={i}
            >
              <img
                src={`https://api.smartfarm.id${item.file_url}`}
                alt="login"
                width="300"
                height="175"
                style={{
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  justifyItems: 'center',
                  alignContent: 'center',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
              <Stack>
                <Typography variant="p" sx={{ opacity: 0.72 }}>
                  Timestamp: {item.uploaded_at.match(/(?<=)(.*)(?=T)/gm)} {item.uploaded_at.match(/(?<=T)(.*)(?=:)/gm)}
                </Typography>
                <Button
                  size="medium"
                  type="submit"
                  variant="contained"
                  onClick={takePhoto}
                  sx={{
                    m: 1,
                    ml: 2,
                    minWidth: 120,
                    backgroundColor: 'primary.main',
                    color: 'white',
                  }}
                >
                  Take Photo
                </Button>
              </Stack>
            </Paper>
          ))}
        </Carousel>
      ) : position === 2 && arraytopRight.length !== 0 ? (
        <Carousel
          sx={{
            bgcolor: (theme) => theme.palette[color].lighter,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
            alignContent: 'center',
            width: '100%', 
            maxWidth: '300px', 
          }}
        >
          {arraytopRight.map((item, i) => (
            <Paper
              sx={{
                bgcolor: (theme) => theme.palette[color].lighter,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                justifyItems: 'center',
                alignContent: 'center',
              }}
              key={i}
            >
              <img
                src={`https://api.smartfarm.id${item.file_url}`}
                alt="login"
                width="300"
                height="175"
                style={{
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  justifyItems: 'center',
                  alignContent: 'center',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
              <Stack>
                <Typography variant="p" sx={{ opacity: 0.72 }}>
                  Timestamp: {item.uploaded_at.match(/(?<=)(.*)(?=T)/gm)} {item.uploaded_at.match(/(?<=T)(.*)(?=:)/gm)}
                </Typography>
                <Button
                  size="medium"
                  type="submit"
                  variant="contained"
                  onClick={takePhoto}
                  sx={{
                    m: 1,
                    ml: 2,
                    minWidth: 120,
                    backgroundColor: 'primary.main',
                    color: 'white',
                  }}
                >
                  Take Photo
                </Button>
              </Stack>
            </Paper>
          ))}
        </Carousel>
      ) : position === 3 && arraybotRight.length !== 0 ? (
        <Carousel
          sx={{
            bgcolor: (theme) => theme.palette[color].lighter,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
            alignContent: 'center',
            width: '100%', 
            maxWidth: '300px', 
          }}
        >
          {arraybotRight.map((item, i) => (
            <Paper
              sx={{
                bgcolor: (theme) => theme.palette[color].lighter,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                justifyItems: 'center',
                alignContent: 'center',
              }}
              key={i}
            >
              <img
                src={`https://api.smartfarm.id${item.file_url}`}
                alt="login"
                width="300"
                height="175"
                style={{
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  justifyItems: 'center',
                  alignContent: 'center',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
              <Stack>
                <Typography variant="p" sx={{ opacity: 0.72 }}>
                  Timestamp: {item.uploaded_at.match(/(?<=)(.*)(?=T)/gm)} {item.uploaded_at.match(/(?<=T)(.*)(?=:)/gm)}
                </Typography>
                <Button
                  size="medium"
                  type="submit"
                  variant="contained"
                  onClick={takePhoto}
                  sx={{
                    m: 1,
                    ml: 2,
                    minWidth: 120,
                    backgroundColor: 'primary.main',
                    color: 'white',
                  }}
                >
                  Take Photo
                </Button>
              </Stack>
            </Paper>
          ))}
        </Carousel>
      ) : position === 4 && arrayuser.length !== 0 ? (
        <Carousel
          sx={{
            bgcolor: (theme) => theme.palette[color].lighter,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
            alignContent: 'center',
            width: '100%', 
            maxWidth: '300px', 
          }}
        >
          {arrayuser.map((item, i) => (
            <Paper
              sx={{
                bgcolor: (theme) => theme.palette[color].lighter,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                justifyItems: 'center',
                alignContent: 'center',
              }}
              key={i}
            >
              <img
                src={`https://api.smartfarm.id${item.file_url}`}
                alt="login"
                width="300"
                height="175"
                style={{
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  justifyItems: 'center',
                  alignContent: 'center',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
              <Stack>
                <Typography variant="p" sx={{ opacity: 0.72 }}>
                  Timestamp: {item.uploaded_at.match(/(?<=)(.*)(?=T)/gm)} {item.uploaded_at.match(/(?<=T)(.*)(?=:)/gm)}
                </Typography>
                <Button
                  size="medium"
                  type="submit"
                  variant="contained"
                  onClick={takePhoto}
                  sx={{
                    m: 1,
                    ml: 2,
                    minWidth: 120,
                    backgroundColor: 'primary.main',
                    color: 'white',
                  }}
                >
                  Take Photo
                </Button>
              </Stack>
            </Paper>
          ))}
        </Carousel>
      ) : (
        <Paper
          sx={{
            bgcolor: (theme) => theme.palette[color].lighter,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
            alignContent: 'center',
          }}
        >
          <img
            src="/assets/illustrations/chamber_depan.png"
            alt="login"
            width="300"
            height="165"
            style={{
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              justifyItems: 'center',
              alignContent: 'center',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
          <Stack>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
              {title}
            </Typography>
            <Button
              size="medium"
              type="submit"
              variant="contained"
              onClick={takePhoto}
              sx={{
                m: 1,
                ml: 2,
                minWidth: 120,
                backgroundColor: 'primary.main',
                color: 'white',
              }}
            >
              Take Photo
            </Button>
          </Stack>
        </Paper>
      )}

      {}
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
