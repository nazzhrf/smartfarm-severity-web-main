import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Typography } from '@mui/material';

// sections
import { AppDatePicker, AppTableSeverity, AppTray } from '../sections/@severitylog/app';

export default function SeverityLogPage() {
  // Tambahkan state untuk tanggal yang dipilih
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <>
      <Helmet>
        <title>Severity Log | Dashboard</title>
      </Helmet>

      <div style={{ padding: '20px' }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Severity Log
        </Typography>

        {/* Layout dengan 3 kolom */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
          
          {/* Kiri: Date Picker */}
          <div style={{ flex: 1, maxWidth: '250px' }}>
            {/* Kirim fungsi setSelectedDate ke AppDatePicker */}
            <AppDatePicker onDateSelect={setSelectedDate} />
          </div>

          {/* Tengah: Table */}
          <div style={{ flex: 2 }}>
            {/* Kirim tanggal yang dipilih ke AppTableSeverity */}
            <AppTableSeverity selectedDate={selectedDate} />
          </div>

          {/* Kanan: Tray */}
          <div style={{ flex: 1 }}>
            <AppTray />
          </div>
        </div>
      </div>
    </>
  );
}
