import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, Grid, TextField, Button, Typography } from '@mui/material';

const AppDatePicker = ({ onDateSelect }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [week, setWeek] = useState('');
  const [day, setDay] = useState('');
  const [dates, setDates] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = 'https://api-classify.smartfarm.id/filter-directories';

  // ⬇️ Fungsi untuk ambil data berdasarkan filter
  const fetchFilteredDirectories = async (filterPayload = {}) => {
    try {
      const response = await axios.post(API_URL, filterPayload);
      const dirs = response.data.matched_directories || [];
      const uniqueDates = Array.from(
        new Set(dirs.map(dir => dir.split('_')[0]))
      ).sort();
      setDirectories(dirs);
      setDates(uniqueDates);
      setErrorMessage('');
    } catch (err) {
      setDirectories([]);
      setDates([]);
      setErrorMessage(err.response?.data?.message || 'Gagal mengambil data');
    }
  };

  // ⬇️ Saat awal buka halaman
  useEffect(() => {
    fetchFilteredDirectories(); // payload kosong
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
    setDay(''); // Kosongkan tanggal terpilih setelah filter baru
    if (onDateSelect) onDateSelect(null);
  };

  const handleDateClick = (selectedDate) => {
    setDay(selectedDate);
    if (onDateSelect) onDateSelect(selectedDate);
  };

  return (
    <Card sx={{ p: 3, backgroundColor: '#fff' }}>
      <CardHeader title="Filter Direktori" />
      <Grid container direction="column" spacing={2}>
        <Grid item><TextField label="Tahun" type="number" value={year} onChange={e => setYear(e.target.value)} fullWidth /></Grid>
        <Grid item><TextField label="Bulan" type="number" value={month} onChange={e => setMonth(e.target.value)} fullWidth /></Grid>
        <Grid item><TextField label="Minggu ke-" type="number" value={week} onChange={e => setWeek(e.target.value)} fullWidth /></Grid>
        <Grid item><TextField label="Tanggal" type="date" value={day} onChange={e => setDay(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
        <Grid item><Button variant="contained" fullWidth onClick={handleSubmit}>Submit Filter</Button></Grid>

        {errorMessage && <Grid item><Typography color="error">{errorMessage}</Typography></Grid>}

        <Grid item>
          <Typography variant="h6">Tanggal Tersedia:</Typography>
          <Grid container spacing={1} direction="column" sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {dates.map((date, idx) => (
              <Grid item key={idx}>
                <button
                  onClick={() => handleDateClick(date)}
                  style={{
                    width: '100%',
                    padding: '6px 12px',
                    borderRadius: 4,
                    border: 'none',
                    backgroundColor: day === date ? '#115293' : '#1976d2',
                    color: '#fff',
                    fontWeight: day === date ? 'bold' : 'normal',
                    cursor: 'pointer',
                  }}
                >
                  {date}
                </button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AppDatePicker;
