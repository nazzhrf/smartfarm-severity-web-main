import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardHeader,
  Grid,
  Box,
  Slider,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function AppTray({

  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
}) {
  const trayImagePath = '/assets/images/Tray/chili_detection_order.jpg';
  const fallbackImage = '/assets/images/fallback/sample-disease.png';

  const [imageSrc, setImageSrc] = useState(trayImagePath);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Zoom & drag state
  const [zoom, setZoom] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState('center center');
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const imageRef = useRef(null);
  const dragData = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });

  const fetchImage = async (date = null, time = null) => {
    setLoading(true);
    setError(null);
    try {
      const body = {};
      if (date) body.tanggal = date;
      if (time) body.waktu = time;

      const res = await axios.post(
        'https://api-classify.smartfarm.id/get-full-image',
        body
      );

      const { image_data: imageData } = res.data || {};

      if (imageData) {
        setImageSrc(imageData);
        setZoom(1);
        setTranslate({ x: 0, y: 0 });
      } else {
        setImageSrc(fallbackImage);
      }
    } catch (err) {
      setError('Pilih tanggal dan waktu serta tampilan tray kiri atau kanan');
      setImageSrc(fallbackImage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImage(selectedDate, selectedTime);
  }, [selectedDate, selectedTime]);

  const handleImageError = () => {
    setError('Pilih tanggal dan waktu serta tampilan tray kiri atau kanan');
  };

  const handleSubmitFilter = () => {
    if (selectedDate && selectedTime) {
      fetchImage(selectedDate, selectedTime);
    }
  };

  const onMouseDown = (e) => {
    if (zoom <= 1) return;
    dragData.current.isDragging = true;
    dragData.current.startX = e.clientX;
    dragData.current.startY = e.clientY;
    dragData.current.lastX = translate.x;
    dragData.current.lastY = translate.y;

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!dragData.current.isDragging) return;

    const dx = e.clientX - dragData.current.startX;
    const dy = e.clientY - dragData.current.startY;

    setTranslate({
      x: dragData.current.lastX + dx,
      y: dragData.current.lastY + dy,
    });
  };

  const onMouseUp = () => {
    dragData.current.isDragging = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  const onClick = (e) => {
    e.preventDefault();
    if (dragData.current.isDragging) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const xPercent = ((e.clientX - bounds.left) / bounds.width) * 100;
    const yPercent = ((e.clientY - bounds.top) / bounds.height) * 100;

    setZoomOrigin(`${xPercent}% ${yPercent}%`);
    setZoom((prev) => Math.min(prev + 0.5, 5));
  };

  const onContextMenu = (e) => {
    e.preventDefault();

    const bounds = e.currentTarget.getBoundingClientRect();
    const xPercent = ((e.clientX - bounds.left) / bounds.width) * 100;
    const yPercent = ((e.clientY - bounds.top) / bounds.height) * 100;

    setZoomOrigin(`${xPercent}% ${yPercent}%`);
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const handleSliderChange = (event, newValue) => {
    setZoom(newValue);
  };

  const handleTrayButton = async (side) => {
    if (!selectedDate || !selectedTime) {
      setError("Tanggal dan waktu belum dipilih.");
      return;
    }

    const payload = {
      tanggal: selectedDate,        // sudah dalam format yyyy-MM-dd
      waktu: selectedTime,          // sudah dalam format HH:mm:ss
      image: side === 'left' ? 'left_full.jpg' : 'right_full.jpg'
    };

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        'https://api-classify.smartfarm.id/get-full-image',
        payload
      );
      const { image_data: imageData } = res.data || {};
      if (imageData) {
        setImageSrc(imageData);
        setZoom(1);
        setTranslate({ x: 0, y: 0 });
      } else {
        setImageSrc(fallbackImage);
      }
    } catch (err) {
      setError('Gagal memuat gambar tray.');
      setImageSrc(fallbackImage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 3, width: '100%', mx: 'auto', maxHeight: { xs: 'none', md: 600 }, mt: { xs: 2, md: 0 } }}>
      <CardHeader title="Full Tray View" />

      <Grid container spacing={2} direction="column">
        {/* Filter input */}
        <Grid item>
          <Grid container spacing={2} alignItems="center" sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
            <Grid item xs={12} sm="auto">
              <TextField
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={selectedDate || ''}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm="auto">
              <TextField
                label="Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={selectedTime || ''}
                onChange={(e) => setSelectedTime(e.target.value)}
                inputProps={{ step: 1 }}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm="auto">
              <Button variant="contained" onClick={handleSubmitFilter} fullWidth size="small">
                Submit Filter
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Left & Right buttons */}
        <Grid item>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" onClick={() => handleTrayButton('left')}>
              Left Tray
            </Button>
            <Button variant="outlined" onClick={() => handleTrayButton('right')}>
              Right Tray
            </Button>
          </Box>
        </Grid>

        {/* Loading & error */}
        {loading && (
          <Grid item sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Grid>
        )}

        {/* {error && (
          <Grid item>
            <Typography color="error" variant="body2">{error}</Typography>
          </Grid>
        )} */}

        {/* Image display */}
        {!loading && (
            <Grid item>
              <Box
                sx={{
                  borderRadius: 2,
                  padding: 1,
                  backgroundColor: '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: { xs: 250, sm: 300, md: 350 },
                  overflow: 'hidden',
                  userSelect: 'none',
                  textAlign: 'center',
                }}
              >
                {error ? (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',           // warna netral, tidak mencolok
                      fontStyle: 'italic',
                      px: 2,
                    }}
                  >
                    Pilih tanggal dan waktu serta tampilan tray kiri atau kanan
                  </Typography>
                ) : (
                  <Box
                    component="img"
                    ref={imageRef}
                    src={imageSrc}
                    alt="Tray Image"
                    onError={handleImageError}
                    onClick={onClick}
                    onContextMenu={onContextMenu}
                    onMouseDown={onMouseDown}
                    sx={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: 1,
                      transform: `scale(${zoom}) translate(${translate.x}px, ${translate.y}px)`,
                      transformOrigin: zoomOrigin,
                      transition: dragData.current.isDragging ? 'none' : 'transform 0.3s ease',
                      cursor: zoom > 1 ? (dragData.current.isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                      touchAction: 'none',
                    }}
                    draggable={false}
                  />
                )}
              </Box>
            </Grid>
          )}

        {/* Zoom slider */}
        <Grid item>
          <Slider
            value={zoom}
            onChange={handleSliderChange}
            min={1}
            max={5}
            step={0.1}
            aria-label="Zoom"
            valueLabelDisplay="auto"
            disabled={loading || !!error}
            size="small"
          />
        </Grid>
      </Grid>
    </Card>
  );
}

AppTray.propTypes = {
  selectedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  selectedTime: PropTypes.string,
  setSelectedDate: PropTypes.func,
  setSelectedTime: PropTypes.func,
};
