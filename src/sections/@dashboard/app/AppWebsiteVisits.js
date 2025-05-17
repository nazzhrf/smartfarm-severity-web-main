import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, Grid, Typography } from '@mui/material';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
import Select from '@mui/material/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './customDatePickerWidth.css';

// components
import { useChart } from '../../../components/chart';
import useResponsive from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleDateChange: PropTypes.func,
  selectedDate: PropTypes.instanceOf(Date),
};

export default function AppWebsiteVisits({
  title,
  subheader,
  chartLabels,
  chartData,
  handleDateChange,
  selectedDate,
  ...other
}) {
  const [chartValue, setChartValue] = useState('Temperature');
  const temperature = [chartData[0]];
  const humidity = [chartData[1]];
  const intensity = [chartData[2]];
  const cpuTemp = [chartData[3]];
  const mdUp = useResponsive('up', '1770');
  const userLevel = localStorage.getItem('level');

  let margin = 0;
  if (mdUp) {
    margin = 48;
  } else {
    margin = 3;
  }

  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    xaxis: {
      type: 'category',
      datetimeFormatter: {
        hour: 'HH',
        minute: 'mm',
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y}`;
          }
          return y;
        },
      },
    },
    chart: {
      zoom: {
        enabled: true,
      },
    },
  });

  return (
    <Card {...other}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 16px' }}>
        <CardHeader title={title} subheader={subheader} />
        <div style={{ alignItems: 'center' }}>
          <Typography paragraph style={{ marginRight: '8px', marginTop: '20px' }}>
            Input Date:
          </Typography>
          <DatePicker selected={selectedDate} onChange={handleDateChange} dateFormat="yyyy-MM-dd" />
        </div>
      </Box>
      <Box sx={{ p: 2, pb: 1, mx: margin }} justifyContent="start">
        {' '}
        <FormControl fullWidth size="small">
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            onChange={(e) => setChartValue(e.target.value)}
            value={chartValue}
          >
            <MenuItem value={'Temperature'}>Temperature</MenuItem>
            <MenuItem value={'Humidity'}>Humidity</MenuItem>
            <MenuItem value={'Intensity'}>Intensity</MenuItem>
            {Number(userLevel) === 2 && <MenuItem value={'Gateway Temperature'}>Gateway Temperature</MenuItem>}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        {chartLabels.length === 0 ? (
          <Grid container spacing={3} justifyContent={'center'}>
            <Grid item xs={12} sm={6} md={6} justifyContent={'center'} alignItems={'center'}>
              <CardHeader
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  justifyItems: 'center',
                  alignContent: 'center',
                }}
                title={'Sorry'}
                subheader={'There is no condition data for today please check it again letter'}
              />
              <img src="/assets/illustrations/chamber_depan.png" alt="login" width="455" height="308" />
            </Grid>
          </Grid>
        ) : (
          <ReactApexChart
            type="line"
            series={
              chartValue === 'Temperature'
                ? temperature
                : chartValue === 'Humidity'
                ? humidity
                : chartValue === 'Intensity'
                ? intensity
                : cpuTemp
            }
            options={chartOptions}
            height={364}
          />
        )}
      </Box>
    </Card>
  );
}
