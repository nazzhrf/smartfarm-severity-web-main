import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Grid, Container, Box, Typography } from '@mui/material';
import axiosInstance from '../hooks/axiosInstance';
import { AppMonitorWidgetSummaryLiveData } from '../sections/@dashboard/app';

function calculateTemperatureColor(temperature, SPTemp) {
  if (temperature > SPTemp + 4) return 'error';
  if (temperature < SPTemp - 4) return 'info';
  if (temperature > 0) return 'success';
  return 'warning';
}

export default function MonitorPage() {
  const [deviceSSEData, setDeviceSSEData] = useState({});
  const [deviceData, setDeviceData] = useState([]);
  const [showMessage, setShowMessage] = useState(true);
  const jwtToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    // Fetch the initial device data from the API
    axiosInstance.get('/device/find').then((response) => {
      if (response.data.data.length !== 0) {
        setDeviceData(response.data.data);
      }
    });
    // Establish the SSE connection and handle incoming SSE data
    const eventSource = new EventSource(`https://api.smartfarm.id/condition/events?jwt_token=${jwtToken}`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDeviceSSEData((prevData) => ({
        ...prevData,
        [data.device_id]: data,
      }));
    };
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };
    return () => {
      eventSource.close();
    };
  }, [jwtToken]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 10010);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Monitor | Plant Growth Chamber</title>
      </Helmet>
      <Container maxWidth="xl">
        <Box
          mb={2}
          sx={{
            textAlign: 'center',
            backgroundColor: '#eafcd4',
            padding: '10px',
            borderRadius: '10px',
          }}
        >
          <Typography variant="body1" sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
            {Object.values(deviceSSEData).some((data) => data.device_id) ? (
              <>There is devices online</>
            ) : (
              <>{showMessage ? 'Waiting for data...' : 'All device offline'}</>
            )}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {deviceData.map((device) => {
            const sseData = deviceSSEData[device.id] || {};
            return (
              <Grid key={device.id} item xs={12} sm={6} md={3}>
                <AppMonitorWidgetSummaryLiveData
                  title={device.code_device}
                  title1="Temperature"
                  total={sseData.temperature || 0}
                  prefix="°С"
                  color={calculateTemperatureColor(Number(sseData.temperature || 0), Number(sseData.SPTemp || 0))}
                  icon={'mdi:alarm-light-outline'}
                  target={sseData.SPTemp || 0}
                  title2="Humidity"
                  total1={sseData.humidity || 0}
                  prefix1="%"
                  target1={sseData.SPHum || 0}
                  total2={sseData.gateway_temp || 0}
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
}
