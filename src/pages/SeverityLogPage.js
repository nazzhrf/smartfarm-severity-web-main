import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Typography, Box, useTheme, useMediaQuery } from '@mui/material';

// sections
import { AppDatePicker, AppTableSeverity, AppTray } from '../sections/@severitylog/app';

export default function SeverityLogPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if screen is mobile/tablet

  return (
    <>
      <Helmet>
        <title>Severity Log | Dashboard</title>
      </Helmet>

      <Box sx={{ padding: '20px' }}>
        {/* Filter Section */}
        <Box sx={{ marginBottom: '20px' }}>
          <AppDatePicker onDateSelect={setSelectedDate} onTimeSelect={setSelectedTime} />
        </Box>

        {/* Main Content: Responsive Layout */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, // Stack vertically on mobile, side by side on desktop
          gap: '20px', 
          alignItems: 'flex-start' 
        }}>
          {/* Table Section */}
          <Box sx={{ 
            flex: { xs: 'none', md: 2 }, // No flex on mobile, flex: 2 on desktop
            width: { xs: '100%', md: 'auto' } // Full width on mobile
          }}>
            <AppTableSeverity selectedDate={selectedDate} selectedTime={selectedTime} />
          </Box>

          {/* Tray Section */}
          <Box sx={{ 
            flex: { xs: 'none', md: 1 }, // No flex on mobile, flex: 1 on desktop
            width: { xs: '100%', md: 'auto' }, // Full width on mobile
            maxWidth: { xs: 'none', md: '900px' } // Remove max-width constraint on mobile
          }}>
            <AppTray
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              setSelectedDate={setSelectedDate}
              setSelectedTime={setSelectedTime}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}

// Alternative: Always Vertical Layout (simpler approach)
export function SeverityLogPageAlwaysVertical() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <>
      <Helmet>
        <title>Severity Log | Dashboard</title>
      </Helmet>

      <div style={{ padding: '20px' }}>
        {/* Filter */}
        <div style={{ marginBottom: '20px' }}>
          <AppDatePicker onDateSelect={setSelectedDate} onTimeSelect={setSelectedTime} />
        </div>

        {/* Table - Always on top */}
        <div style={{ marginBottom: '20px' }}>
          <AppTableSeverity selectedDate={selectedDate} selectedTime={selectedTime} />
        </div>

        {/* Tray - Always on bottom */}
        <div>
          <AppTray
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            setSelectedDate={setSelectedDate}
            setSelectedTime={setSelectedTime}
          />
        </div>
      </div>
    </>
  );
}