import { Helmet } from 'react-helmet-async';

import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
// @mui

import {
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Box,
  CardHeader,
  Button,
  Container,
  FormControl,
  Select,
  MenuItem,
  Skeleton,
  Typography,
} from '@mui/material';
import { zonedTimeToUtc, format } from 'date-fns-tz';
import DatePicker from 'react-datepicker';

// hooks
import axiosInstance from '../hooks/axiosInstance';

// sections
import { AppWebsiteVisits, AppWidgetSummaryLiveData, AppCurrentSubject, PhotoCamera } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
  }));
  const [isLoading, setIsloading] = useState(true);
  const [sseData, setSSEData] = useState({});
  const [zero, setZero] = useState(false);
  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - 1);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedStartDate, setSelectedStartDate] = useState(startDate);
  const [selectedEndDate, setSelectedEndDate] = useState(endDate);
  const [graphData, setGraphData] = useState([]);
  const [chartData, setChartData] = useState({ temperature: [], intensity: [], humidity: [], time: [] });
  const [deviceData, setDeviceData] = useState([]);
  const [IDDevice, setIDDevice] = useState(localStorage.getItem('device_id'));
  const [NameDevice, setNameDevice] = useState(localStorage.getItem('device_name'));
  const [cameraTop, setcameraTop] = useState([]);
  const [cameraBot, setcameraBot] = useState([]);
  const [cameraTopRight, setcameraTopRight] = useState([]);
  const [cameraBotRight, setcameraBotRight] = useState([]);
  const [cameraUser, setcameraUser] = useState([]);
  const [showMessage, setShowMessage] = useState(true);
  const jwtToken = localStorage.getItem('jwtToken');
  const level = localStorage.getItem('level');
  const [averageData, setAverageData] = useState(null); // Initializing with null or an initial value

  const fetchAverageData = async (chamberId, date) => {
    try {
      console.log('Fetching average data for chamberId:', chamberId, 'and date:', date);
      const response = await axiosInstance.get(`/condition/average/${chamberId}?date=${date}`);
      console.log('Response from API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching data from the new API endpoint:', error);
      throw error;
    }
  };

  useEffect(() => {
    const userID = localStorage.getItem('token');
    if (level === '1') {
      axiosInstance.get(`/device/list/${userID}`).then((response) => {
        if (response.data.data.length === 0) {
          setIsloading(true);
          setZero(true);
        } else {
          setZero(false);
          setDeviceData(response.data.data);
        }
        if (localStorage.getItem('device_id') === null && localStorage.getItem('device_name') === null) {
          setIDDevice(response.data.data[0].id);
          setNameDevice(response.data.data[0].code_device);
          localStorage.setItem('device_id', response.data.data[0].id);
          localStorage.setItem('device_name', response.data.data[0].code_device);
        }
      });
    } else if (level === '2') {
      axiosInstance.get(`/device/find`).then((response) => {
        if (response.data.data.length === 0) {
          setIsloading(true);
          setZero(true);
        } else {
          setZero(false);
          setDeviceData(response.data.data);
        }
        if (localStorage.getItem('device_id') === null && localStorage.getItem('device_name') === null) {
          setIDDevice(response.data.data[0].id);
          setNameDevice(response.data.data[0].code_device);
          localStorage.setItem('device_id', response.data.data[0].id);
          localStorage.setItem('device_name', response.data.data[0].code_device);
        }
      });
    }
  }, [level]);

  useEffect(() => {
    const fetchAverageDataFromApi = async () => {
      try {
        const timeZone = 'Asia/Jakarta';
        const formattedDate = format(zonedTimeToUtc(selectedDate, timeZone), 'yyyy-MM-dd');

        const response = await fetchAverageData(IDDevice, formattedDate);
        console.log('Response from API:', response);

        if (response && response.status === 'success' && response.data && response.data.length > 0) {
          // Update the state with the fetched data
          setAverageData(response.data);
          console.log('Average Data:', response.data);
        } else {
          console.log('No valid data received from the API');
        }
      } catch (error) {
        console.error('Error fetching average data:', error);
      }
    };

    fetchAverageDataFromApi();
  }, [IDDevice, selectedDate]);

  // Rest of the component code

  useEffect(() => {
    if (IDDevice && jwtToken) {
      const eventSource = new EventSource(
        `https://api.smartfarm.id/condition/events/${IDDevice}?jwt_token=${jwtToken}`
      );
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setSSEData(data);
      };
      return () => {
        eventSource.close();
      };
    }
    return () => {};
  }, [IDDevice, jwtToken]);

  useEffect(() => {
    if (IDDevice) {
      axiosInstance.get(`/file/listtop/${IDDevice}`).then((response) => {
        setcameraTop(response.data.data);
      });
      axiosInstance.get(`/file/listbottom/${IDDevice}`).then((response) => {
        setcameraBot(response.data.data);
      });
      axiosInstance.get(`/file/listtopright/${IDDevice}`).then((response) => {
        setcameraTopRight(response.data.data);
      });
      axiosInstance.get(`/file/listbottomright/${IDDevice}`).then((response) => {
        setcameraBotRight(response.data.data);
      });
      axiosInstance.get(`/file/listuser/${IDDevice}`).then((response) => {
        setcameraUser(response.data.data);
      });
    }
  }, [IDDevice]);

  useEffect(() => {
    setIsloading(true);
    const fetchData = () => {
      if (IDDevice !== null) {
        axiosInstance.get(`/condition/info/${IDDevice}?date=${format(zonedTimeToUtc(selectedDate, timeZone), 'yyyy-MM-dd')}`).then((response) => {
          if (response.data.data.length === 0) {
            setIsloading(false);
            setGraphData([]);
          } else {
            setGraphData(response.data.data);
          }
        });
      }
    };
    fetchData();
  }, [IDDevice, selectedDate]);

  useEffect(() => {
    const temperatureData = [];
    const intensityData = [];
    const humidityData = [];
    const cpuTempData = [];
    const timeData = [];

    if (graphData.length !== 0 && chartData.length === 0) {
      setIsloading(true);
    } else if (graphData.length !== 0 && chartData.length !== 0) {
      setIsloading(false);
    }

    const hourDataCounts = {}; // Keep track of data counts for each hour

    graphData.forEach((item) => {
      temperatureData.push(parseFloat(item.temperature));
      intensityData.push(item.intensity);
      humidityData.push(parseFloat(item.humidity));
      cpuTempData.push(parseFloat(item.cpu_temp));

      // Assuming item.time is in the format "hour:minute"
      const timeParts = item.time.split(':');
      const hours = parseInt(timeParts[0], 10); // Parse hours as an integer

      if (hourDataCounts[hours] === undefined) {
        hourDataCounts[hours] = 1; // Initialize the count for this hour
      } else {
        hourDataCounts[hours] += 1; // Increment the count for this hour
      }

      if (hourDataCounts[hours] === 1) {
        // Display "HH:00" for the first data point within the hour
        timeData.push(`${hours}:00`);
      } else if (hourDataCounts[hours] === 15) {
        // Display "HH:30" for the 15th data point within the hour
        timeData.push(`${hours}:30`);
      } else {
        timeData.push(''); // Add an empty string for other data points within the hour
      }
    });

    setChartData({
      temperature: temperatureData,
      intensity: intensityData,
      humidity: humidityData,
      cpu_temp: cpuTempData,
      time: timeData,
    });
    // eslint-disable-next-line
  }, [graphData]);

  const handleDateChange = (dateString) => {
    const dateObject = new Date(dateString);
    setSelectedDate(dateObject);
  };

  const downloadExcel = () => {
    const timeZone = 'Asia/Jakarta'; // Replace this with your server's time zone
    const formattedStartDate = format(zonedTimeToUtc(selectedStartDate, timeZone), 'yyyy-MM-dd');
    const formattedEndDate = format(zonedTimeToUtc(selectedEndDate, timeZone), 'yyyy-MM-dd');
    // Axios config to handle binary responses (Excel file)
    const axiosConfig = {
      method: 'get',
      url: `/condition/download/${IDDevice}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      responseType: 'blob', // Set responseType to 'blob' for binary responses
    };

    axiosInstance(axiosConfig)
      .then((response) => {
        // Extract the filename from the Content-Disposition header
        const filename = `Data Chamber ${NameDevice} on ${formattedStartDate} until ${formattedEndDate} .xlsx`;

        // Create a Blob from the binary response data
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a download link and trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename; // Use the extracted filename for download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      })
      .catch((error) => {
        console.error('Error downloading Excel file:', error);
      });
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const timeZone = 'Asia/Jakarta'; // Replace this with your server's time zone
  const formattedDate = format(zonedTimeToUtc(selectedDate, timeZone), 'yyyy-MM-dd');
  const formattedDateForDisplay = new Date(formattedDate).toLocaleString('en-us', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 10010);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | Plant Growth Chamber </title>
      </Helmet>
      {isLoading && !zero ? (
        <Skeleton
          variant="rounded"
          height={550}
          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', mx: 3, my: 2 }}
        />
      ) : zero ? (
        <Container>
          <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h3" paragraph>
              Sorry
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}>Sorry, you didn’t have any access to the device.</Typography>

            <Box
              component="img"
              src="/assets/illustrations/chamber_depan.png"
              sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
            />

            <Button to="/dashboard/access" size="large" variant="contained" component={RouterLink}>
              Go Request Access
            </Button>
          </StyledContent>
        </Container>
      ) : (
        <Container maxWidth="xl">
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
              id="demo-select-small"
              onChange={(e) => {
                const deviceId = e.target.value;
                const selectedDevice = deviceData.find((device) => device.id === deviceId);
                setIDDevice(e.target.value);
                localStorage.setItem('device_id', e.target.value);
                localStorage.setItem('device_name', selectedDevice.code_device);
                setNameDevice(selectedDevice.code_device);
                window.location.reload();
              }}
              sx={{
                boxShadow: 'none',
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
                '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
              }}
              value={NameDevice}
              renderValue={() => <Typography variant="h4">{NameDevice}</Typography>}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {deviceData.map((device) => (
                <MenuItem key={device.id} value={device.id}>
                  {device.code_device}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {sseData.mode === 'manual' && (
            <Box
              mb={2}
              sx={{
                textAlign: 'center',
                backgroundColor: '#fdecea',
                padding: '10px',
                borderRadius: '10px',
              }}
            >
              <Typography variant="body1" sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <span role="img" aria-label="warning" style={{ fontSize: '16px', marginRight: '5px' }}>
                  ⚠️
                </span>
                This device is being controlled in Manual mode via onsite display. You can check the User Camera to see
                onsite user.
              </Typography>
            </Box>
          )}

          {Number(sseData.temperature) > Number(sseData.SPTemp) + 4 && level === '2' && (
            <Box
              mb={2}
              sx={{
                textAlign: 'center',
                backgroundColor: '#fdecea',
                padding: '10px',
                borderRadius: '10px',
              }}
            >
              <Typography variant="body1" sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <span role="img" aria-label="warning" style={{ fontSize: '16px', marginRight: '5px' }}>
                  ⚠️
                </span>
                Abnormal Temperature increase is detected! Please check the chamber
              </Typography>
            </Box>
          )}

          {Number(sseData.temperature) < Number(sseData.SPTemp) - 4 && level === '2' && (
            <Box
              mb={2}
              sx={{
                textAlign: 'center',
                backgroundColor: '#ADD8E6',
                padding: '10px',
                borderRadius: '10px',
              }}
            >
              <Typography variant="body1" sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <span role="img" aria-label="warning" style={{ fontSize: '16px', marginRight: '5px' }}>
                  ⚠️
                </span>
                Abnormal Temperature decrease is detected! Please check the chamber
              </Typography>
            </Box>
          )}

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
              {sseData.gateway_temp ? (
                Number(level) === 2 ? (
                  <>
                    Gateway CPU Temperature: <strong>{sseData.gateway_temp} °С</strong>
                  </>
                ) : Number(level) === 1 ? (
                  <>Device online</>
                ) : null
              ) : (
                <>{showMessage ? 'Waiting for data...' : 'Device not online'}</>
              )}
            </Typography>
          </Box>

          <Grid container spacing={3} mb={2}>
                      <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummaryLiveData
                title="Temperature"
                total={JSON.stringify(sseData) === JSON.stringify({}) ? 0 : sseData.temperature}
                target={JSON.stringify(sseData) === JSON.stringify({}) ? 0 : sseData.SPTemp}
                color="error"
                icon={'mdi:temperature-low'}
                prefix="°С"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummaryLiveData
                title="Humidity"
                total={JSON.stringify(sseData) === JSON.stringify({}) ? 0 : sseData.humidity}
                target={JSON.stringify(sseData) === JSON.stringify({}) ? 0 : sseData.SPHum}
                color="info"
                icon={'material-symbols:humidity-percentage'}
                prefix="%"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummaryLiveData
                title="Intensity"
                total={JSON.stringify(sseData) === JSON.stringify({}) ? 0 : sseData.intensity}
                target={JSON.stringify(sseData) === JSON.stringify({}) ? 0 : sseData.SPLight}
                color="warning"
                icon={'material-symbols:water-lux-rounded'}
                prefix="lux"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <PhotoCamera
                title="Sorry There is no camera data for this chamber, please check again later"
                total={JSON.stringify(sseData) === JSON.stringify({}) ? 0 : sseData.intensity}
                icon={'material-symbols:water-lux-rounded'}
                color="success"
                prefix="lux"
                arraybot={cameraBot}
                arraytop={cameraTop}
                arraytopRight={cameraTopRight}
                arraybotRight={cameraBotRight}
                arrayuser={cameraUser}
              />
            </Grid>

            <Grid item xs={12} md={8} lg={9}>
              <Card>
                <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                  <Tab label="Chart" />
                </Tabs>

                <CardContent>
                  {activeTab === 0 && (
                    isLoading ? (
                      <Skeleton variant="rounded" height={550} />
                    ) : (
                      <AppWebsiteVisits
                        title="Condition Chart on Date"
                        subheader={formattedDateForDisplay}
                        chartLabels={chartData.time}
                        chartData={[
                          {
                            name: 'Temperature(°С)',
                            type: 'area',
                            fill: 'gradient',
                            data: chartData.temperature,
                          },
                          {
                            name: 'Humidity(%)',
                            type: 'area',
                            fill: 'gradient',
                            data: chartData.humidity,
                          },
                          {
                            name: 'Intensity(lx)',
                            type: 'area',
                            fill: 'gradient',
                            data: chartData.intensity,
                          },
                          {
                            name: 'Gateway Temperature(°С)',
                            type: 'area',
                            fill: 'gradient',
                            data: chartData.cpu_temp,
                          },
                        ]}
                        selectedDate={selectedDate}
                        formattedDate={formattedDate}
                        handleDateChange={handleDateChange}
                        averageData={averageData}
                      />
                    )
                  )}

                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
              <AppCurrentSubject
                deviceId={IDDevice.toString()}
                title="Condition Setter"
                subheader="Set your Chamber Condition"
                subheader2="*Please try again later if your settings or photo capture are sent but not updated on this page"
                jwtToken={jwtToken}
              />
            </Grid>
          </Grid>

          <Grid
            container
            direction="column"
            justifyContent="space-around"
            alignItems="center"
            bgcolor="White"
            borderRadius="10px"
            padding="10px"
            border="0.5px solid #ccc"
            textAlign="center"
          >
            <Grid item>
              <Typography variant="h5" align="center" gutterBottom>
                Average Data
              </Typography>
            </Grid>

            <Grid item container spacing={2} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
              {/* Temperature */}
              <Grid item xs={12} md={4}>
                <Box bgcolor="#FFD580" p={3} borderRadius={1} sx={{ margin: '0 12px' }}>
                  <Typography variant="h6" gutterBottom>
                    <strong>Temperature</strong>
                  </Typography>
                  <Typography variant="subtitle1">Day: {averageData[0]?.avg_temp_day ?? '-'} °С</Typography>
                  <Typography variant="subtitle1">Night: {averageData[0]?.avg_temp_night ?? '-'} °С</Typography>
                </Box>
              </Grid>

              {/* Humidity */}
              <Grid item xs={12} md={4}>
                <Box bgcolor="#E3F2FD" p={3} borderRadius={1} sx={{ margin: '0 12px' }}>
                  <Typography variant="h6" gutterBottom>
                    <strong>Humidity</strong>
                  </Typography>
                  <Typography variant="subtitle1">Day: {averageData[0]?.avg_hum_day ?? '-'} %</Typography>
                  <Typography variant="subtitle1">Night: {averageData[0]?.avg_hum_night ?? '-'} %</Typography>
                </Box>
              </Grid>

              {/* Intensity */}
              <Grid item xs={12} md={4}>
                <Box bgcolor="#E8F5E9" p={3} borderRadius={1} sx={{ margin: '0 12px' }}>
                  <Typography variant="h6" gutterBottom>
                    <strong>Intensity</strong>
                  </Typography>
                  <Typography variant="subtitle1">Day: {averageData[0]?.avg_light_day ?? '-'} lux</Typography>
                  <Typography variant="subtitle1">Night: {averageData[0]?.avg_light_night ?? '-'} lux</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Box
            mt={2}
            mb={2}
            sx={{
              textAlign: 'center',
              padding: '10px',
              borderRadius: '10px',
              border: '0.5px solid #e6eaed',
              backgroundColor: 'white',
            }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              Export Condition Data to Excel File
            </Typography>
            <div
              style={{
                display: 'flex',
                flexDirection: window.innerWidth <= 524 ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography paragraph style={{ marginRight: '8px', marginTop: '20px' }}>
                  Start Date:
                </Typography>
                <DatePicker selected={selectedStartDate} onChange={handleStartDateChange} dateFormat="yyyy-MM-dd" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography paragraph style={{ marginRight: '8px', marginTop: '20px' }}>
                  End Date:
                </Typography>
                <DatePicker selected={selectedEndDate} onChange={handleEndDateChange} dateFormat="yyyy-MM-dd" />
              </div>
            </div>
            <div>
              <Button fullWidth size="large" type="submit" variant="contained" onClick={downloadExcel}>
                Download File
              </Button>
            </div>
            <div>
              <CardHeader
                subheader={`*This feature allows you to download Excel file of historical condition data for ${NameDevice} device. Data ranges from the entered start date to the specified end date.`}
                style={{ textAlign: 'left', marginBottom: '16px' }}
              />
            </div>
          </Box>
        </Container>
      )}
    </>
  );
}
