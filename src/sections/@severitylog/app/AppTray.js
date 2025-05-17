import {
  Card,
  CardHeader,
  Grid,
  Box,
  TextField,
  Button,
} from '@mui/material';
import { useState } from 'react';

export default function AppTray() {
  // Default dan fallback gambar
  const trayImagePath = '/assets/images/Tray/chili_detection_order.jpg';
  const fallbackImage = '/assets/images/fallback/sample-disease.png';

  const [imageSrc, setImageSrc] = useState(trayImagePath);
  const [filterDate, setFilterDate] = useState('');
  const [filterTime, setFilterTime] = useState('');

  const handleImageError = () => {
    setImageSrc(fallbackImage);
  };

  const handleSubmitFilter = () => {
    // Sementara hanya console log saja, API belum ada
    console.log('Filter submit:', { filterDate, filterTime });
  };

  return (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Tray Image Viewer & Filter" />
      <Grid container spacing={2} direction="column">
        {/* Filter input */}
        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <TextField
                label="Date (YY-MM-DD)"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                inputProps={{
                  pattern: '\\d{2}-\\d{2}-\\d{2}', // pattern untuk format YY-MM-DD, tapi HTML date picker pakai yyyy-mm-dd asli
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Time (HH:MM:SS)"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
                inputProps={{ step: 1 }} // step 1 detik agar bisa input detik
              />
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleSubmitFilter}>
                Submit Filter
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Viewer gambar */}
        <Grid item>
          <Box
            sx={{
              borderRadius: 2,
              padding: 1,
              backgroundColor: '#FFFFFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 400,
            }}
          >
            <Box
              component="img"
              src={imageSrc}
              alt="Tray Photo not Found"
              onError={handleImageError}
              sx={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
