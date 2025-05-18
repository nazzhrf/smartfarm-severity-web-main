import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, Grid, TextField, Button, Typography, Collapse } from '@mui/material';

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

      // Waktu tetap disortir ascending saat fetch agar konsisten
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
    fetchFilteredDirectories(); // initial fetch
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
    const payload = {
      tanggal: date,
      waktu: time,
    };
    console.log('Payload waktu yang dipilih:', payload);
    if (onDateSelect) onDateSelect(date);   // Kirim tanggal dan waktu ke parent
    if (onTimeSelect) onTimeSelect(time);   // Kirim waktu ke parent
  };

  const toggleSortOrder = () => {
    setIsAscending(prev => !prev);
  };

  // Urutkan tanggal sesuai isAscending
  const sortedDatesToShow = isAscending ? [...dates].sort() : [...dates].sort().reverse();

  return (
    <Card sx={{ p: 3, backgroundColor: '#fff' }}>
      <CardHeader title="Filter Direktori" />
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <TextField
            label="Tahun"
            type="number"
            value={year}
            onChange={e => setYear(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            label="Bulan"
            type="number"
            value={month}
            onChange={e => setMonth(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            label="Minggu ke-"
            type="number"
            value={week}
            onChange={e => setWeek(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            label="Tanggal"
            type="date"
            value={day}
            onChange={e => setDay(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" fullWidth onClick={handleSubmit}>
            Submit Filter
          </Button>
        </Grid>

        {errorMessage && (
          <Grid item>
            <Typography color="error">{errorMessage}</Typography>
          </Grid>
        )}

        <Grid item>
          <Typography variant="h6">Tanggal Tersedia:</Typography>

          {/* Tombol toggle urutan */}
          <Button
            variant="outlined"
            size="small"
            onClick={toggleSortOrder}
            sx={{ mb: 1 }}
          >
            Urutkan: {isAscending ? 'Lama ke Baru (Ascending)' : 'Baru ke Lama (Descending)'}
          </Button>

          <Grid
            container
            spacing={1}
            direction="column"
            sx={{ maxHeight: 300, overflowY: 'auto' }}
          >
            {sortedDatesToShow.map((date, idx) => (
              <Grid item key={idx}>
                <button
                  onClick={() => handleDateClick(date)}
                  style={{
                    width: '100%',
                    padding: '6px 12px',
                    borderRadius: 4,
                    border: 'none',
                    backgroundColor: expandedDate === date ? '#115293' : '#1976d2',
                    color: '#fff',
                    fontWeight: expandedDate === date ? 'bold' : 'normal',
                    cursor: 'pointer',
                  }}
                >
                  {date}
                </button>

                <Collapse in={expandedDate === date} timeout="auto" unmountOnExit>
                  <Grid container direction="column" sx={{ pl: 2, pt: 1 }}>
                    {((dateTimeMap[date] || []).slice().sort((a, b) => {
                      const [hA, mA, sA] = a.split(':').map(Number);
                      const [hB, mB, sB] = b.split(':').map(Number);

                      if (hA !== hB) return isAscending ? hA - hB : hB - hA;
                      if (mA !== mB) return isAscending ? mA - mB : mB - mA;
                      return isAscending ? sA - sB : sB - sA;
                    })).map((time, i) => (
                      <Grid item key={i}>
                        <button
                          onClick={() => handleTimeClick(date, time)}
                          style={{
                            marginBottom: 4,
                            padding: '4px 8px',
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            border: '1px solid #ccc',
                            cursor: 'pointer',
                          }}
                        >
                          {time}
                        </button>
                      </Grid>
                    ))}
                  </Grid>
                </Collapse>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AppDatePicker;
