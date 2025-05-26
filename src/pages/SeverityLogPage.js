import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Typography } from '@mui/material';

// sections
import { AppDatePicker, AppTableSeverity, AppTray } from '../sections/@severitylog/app';

export default function SeverityLogPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <>
      <Helmet>
        <title>Severity Log | Dashboard</title>
      </Helmet>

      <div style={{ padding: '20px' }}>
        {/* Baris pertama: Filter */}
        <div style={{ marginBottom: '20px' }}>
          <AppDatePicker onDateSelect={setSelectedDate} onTimeSelect={setSelectedTime} />
        </div>

        {/* Baris kedua: Dua kolom: Table + Tray */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {/* Tabel di kiri */}
          <div style={{ flex: 2 }}>
            <AppTableSeverity selectedDate={selectedDate} selectedTime={selectedTime} />
          </div>

          {/* Gambar tray di kanan */}
          <div style={{ flex: 1, maxWidth: '900px' }}>
            <AppTray
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              setSelectedDate={setSelectedDate}
              setSelectedTime={setSelectedTime}
            />
          </div>
        </div>
      </div>
    </>
  );
}
