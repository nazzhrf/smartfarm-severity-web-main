import {
  Card,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AppTableSeverity({ selectedDate }) {
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (tanggal = null) => {
    setLoading(true);
    try {
      const body = tanggal ? { tanggal } : {};
      const res = await axios.post('https://api-classify.smartfarm.id/get-data', body);
      setLogData(res.data);
      console.log('Data dari API:', res.data);
    } catch (error) {
      console.error('Gagal fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  return (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Severity Level Log" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Chili</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Pred Class 1</TableCell>
                  <TableCell>Pred Class 2</TableCell>
                  <TableCell>Pred Class 3</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : logData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  logData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.image}</TableCell>
                      <TableCell sx={{ width: 120 }}>
                        {item.image_data ? (
                          <img
                            src={item.image_data}
                            alt="Chili"
                            style={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: 0,
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{item.tanggal}</TableCell>
                      <TableCell>{item.waktu}</TableCell>
                      <TableCell>{item.pred_class_1}</TableCell>
                      <TableCell>{item.pred_class_2}</TableCell>
                      <TableCell>{item.pred_class_3}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Card>
  );
}
