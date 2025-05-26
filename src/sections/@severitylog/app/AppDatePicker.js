import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  Grid,
  TextField,
  Button,
  Typography,
  Collapse,
  Paper,
  Box
} from '@mui/material';

const AppDatePicker = ({ onDateSelect, onTimeSelect }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [week, setWeek] = useState('');
  const [day, setDay] = useState('');
  const [dates, setDates] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [dateTimeMap, setDateTimeMap] = useState({});
  const [expandedDate, setExpandedDate] = useState(null);
  const [isAscending, setIsAscending] = useState(true);

  const API_URL = 'https://api-classify.smartfarm.id/filter-directories';

  const fetchFilteredDirectories = async (filterPayload = {}) => {
    try {
      const response = await axios.post(API_URL, filterPayload);
      const dirs = response.data.matched_directories || [];

      const map = {};
      dirs.forEach(dir => {
        const [date, timeRaw] = dir.split('_');
        if (!map[date]) map[date] = [];
        const time = timeRaw.replace(/-/g, ':');
        map[date].push(time);
      });

      Object.keys(map).forEach(date => {
        map[date].sort((a, b) => {
          const [hA, mA, sA] = a.split(':').map(Number);
          const [hB, mB, sB] = b.split(':').map(Number);
          if (hA !== hB) return hA - hB;
          if (mA !== mB) return mA - mB;
          return sA - sB;
        });
      });

      const sortedDates = Object.keys(map).sort();
      setDirectories(dirs);
      setDates(sortedDates);
      setDateTimeMap(map);
      setErrorMessage('');
    } catch (err) {
      setDirectories([]);
      setDates([]);
      setDateTimeMap({});
      setErrorMessage(err.response?.data?.message || 'Gagal mengambil data');
    }
  };

  useEffect(() => {
    fetchFilteredDirectories();
  }, []);

  const handleSubmit = () => {
    setErrorMessage('');
    const isYearMonth = year && month && !week && !day;
    const isYearMonthWeek = year && month && week && !day;
    const isDayOnly = day && !year && !month && !week;

    if (!(isYearMonth || isYearMonthWeek || isDayOnly)) {
      setErrorMessage('Gunakan salah satu kombinasi: (1) tahun+bulan, (2) tahun+bulan+minggu, (3) tanggal');
      return;
    }

    if (day && !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      setErrorMessage('Format tanggal harus YYYY-MM-DD');
      return;
    }

    const payload = isDayOnly
      ? { tanggal: day }
      : { tahun: year, bulan: month, ...(week && { minggu: week }) };

    fetchFilteredDirectories(payload);
    setDay('');
    if (onDateSelect) onDateSelect(null);
    if (onTimeSelect) onTimeSelect(null);
  };

  const handleDateClick = (selectedDate) => {
    setExpandedDate(prev => (prev === selectedDate ? null : selectedDate));
  };

  const handleTimeClick = (date, time) => {
    if (!date) {
      setErrorMessage('Pilih tanggal terlebih dahulu sebelum memilih waktu.');
      return;
    }
    const payload = { tanggal: date, waktu: time };
    console.log('Payload waktu yang dipilih:', payload);
    if (onDateSelect) onDateSelect(date);
    if (onTimeSelect) onTimeSelect(time);
  };

  const toggleSortOrder = () => {
    setIsAscending(prev => !prev);
  };

  const sortedDatesToShow = isAscending ? [...dates].sort() : [...dates].sort().reverse();

  return (
    <Card sx={{ p: 3, backgroundColor: '#fff'}}>
    <CardHeader title="Severity Table Filter" />
    <Grid container spacing={2}>
      {/* Baris input tahun, bulan, minggu, tanggal */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              label="Tahun"
              type="number"
              value={year}
              onChange={e => setYear(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Bulan"
              type="number"
              value={month}
              onChange={e => setMonth(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Minggu ke-"
              type="number"
              value={week}
              onChange={e => setWeek(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Tanggal"
              type="date"
              value={day}
              onChange={e => setDay(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Submit Filter
        </Button>
      </Grid>

      {errorMessage && (
        <Grid item xs={12}>
          <Typography color="error">{errorMessage}</Typography>
        </Grid>
      )}

      {/* Bagian hasil tanggal */}
      <Grid item xs={12}>
        <Typography variant="h6">Classification Results from the Last 7 Days:</Typography>
        <Button variant="outlined" size="small" onClick={toggleSortOrder} sx={{ mb: 1 }}>
          Urutkan: {isAscending ? 'Lama ke Baru' : 'Baru ke Lama'}
        </Button>

        <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, pb: 2 }}>
          {sortedDatesToShow.map((date, idx) => (
            <Box key={idx} sx={{ minWidth: 120 }}>
              <Paper
                onClick={() => handleDateClick(date)}
                sx={{
                  p: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: expandedDate === date ? '#1976d2' : '#e0e0e0',
                  color: expandedDate === date ? '#fff' : '#000',
                  fontWeight: expandedDate === date ? 'bold' : 'normal',
                }}
              >
                {date}
              </Paper>

              <Collapse in={expandedDate === date} timeout="auto" unmountOnExit>
                <Box sx={{ display: 'flex', overflowX: 'auto', gap: 1, mt: 1, pl: 1 }}>
                  {(dateTimeMap[date] || []).map((time, i) => (
                    <Paper
                      key={i}
                      onClick={() => handleTimeClick(date, time)}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {time}
                    </Paper>
                  ))}
                </Box>
              </Collapse>
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  </Card>
  );
};

export default AppDatePicker;
