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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Fungsi bantu untuk ambil angka dari nama file image
function extractImageNumber(imageName) {
  const match = imageName.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export default function AppTableSeverity({ selectedDate, selectedTime }) {
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' | 'error'

  const fetchData = async (tanggal = null, waktu = null) => {
    setLoading(true);
    try {
      const body = {};
      if (tanggal) body.tanggal = tanggal;
      if (waktu) body.waktu = waktu;

      const res = await axios.post('https://api-classify.smartfarm.id/get-data', body);

      // Sorting data berdasarkan tanggal + waktu terbaru dulu, lalu berdasarkan angka di nama file image
      const sortedData = res.data.sort((a, b) => {
        const dateA = new Date(`${a.tanggal}T${a.waktu}`);
        const dateB = new Date(`${b.tanggal}T${b.waktu}`);

        if (dateA.getTime() !== dateB.getTime()) {
          // Urutkan berdasarkan datetime terbaru di atas
          return dateB.getTime() - dateA.getTime();
        }

        // Jika tanggal dan waktu sama, urutkan berdasarkan angka pada nama file image
        const numA = extractImageNumber(a.image);
        const numB = extractImageNumber(b.image);

        return numA - numB;
      });

      setLogData(sortedData);
    } catch (error) {
      console.error('Gagal fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    fetchData(selectedDate, selectedTime);
  }, [selectedDate, selectedTime]);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    const payload = {
      tanggal: itemToDelete.tanggal,
      waktu: itemToDelete.waktu,
      image: itemToDelete.image,
    };

    try {
      const res = await axios.post('https://api-classify.smartfarm.id/delete', payload);
      showSnackbar(res.data?.message || 'Data berhasil dihapus', 'success');
      fetchData(selectedDate, selectedTime);
    } catch (error) {
      console.error('Gagal menghapus data:', error);
      showSnackbar('Gagal menghapus data', 'error');
    } finally {
      setOpenDialog(false);
      setItemToDelete(null);
    }
  };

  return (
    <Card sx={{ p: 3, maxWidth: 1000, width: '100%', mx: 'auto' }}>
      <CardHeader title="Severity Table" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Tambahkan overflowX untuk scroll horizontal */}
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 600, overflowY: 'auto', maxWidth: 1000, overflowX: 'auto' }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Chili</TableCell>
                  <TableCell>Date</TableCell>
                  {/* Pred 1, 2, 3 dengan maxWidth kecil */}
                  <TableCell sx={{ maxWidth: 80, width: 80, textAlign: 'center' }}>Pred 1</TableCell>
                  <TableCell sx={{ maxWidth: 80, width: 80, textAlign: 'center' }}>Pred 2</TableCell>
                  <TableCell sx={{ maxWidth: 80, width: 80, textAlign: 'center' }}>Pred 3</TableCell>
                  <TableCell>tanggal</TableCell>
                  <TableCell>waktu</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : logData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
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
                      <TableCell sx={{ maxWidth: 80, width: 80, textAlign: 'center' }}>
                        {item.pred_class_1}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 80, width: 80, textAlign: 'center' }}>
                        {item.pred_class_2}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 80, width: 80, textAlign: 'center' }}>
                        {item.pred_class_3}
                      </TableCell>
                      <TableCell>{item.tanggal}</TableCell>
                      <TableCell>{item.waktu}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(item)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Dialog Konfirmasi */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
        <DialogContent>
          <Typography>
            Data dengan gambar <strong>{itemToDelete?.image}</strong> pada tanggal{' '}
            <strong>{itemToDelete?.tanggal}</strong> pukul <strong>{itemToDelete?.waktu}</strong>{' '}
            akan dihapus secara permanen. Apakah Anda yakin?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Batal
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
