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
  TextField,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import CheckIcon from '@mui/icons-material/Check';


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
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [sortField, setSortField] = useState('tanggal');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterPred, setFilterPred] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [sortFields, setSortFields] = useState([]); 




  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchData = async (tanggal = null, waktu = null) => {
    setLoading(true);
    try {
      const body = {};
      if (tanggal) body.tanggal = tanggal;
      if (waktu) body.waktu = waktu;

      const res = await axios.post('https://api-classify.smartfarm.id/get-data', body);

      const filteredData = res.data.filter(item => {
        const dateMatch = !filterDate || item.tanggal === filterDate;
        const timeMatch = !filterTime || item.waktu === filterTime;
        const predMatch = !filterPred ||
          item.pred_class_1 === filterPred ||
          item.pred_class_2 === filterPred ||
          item.pred_class_3 === filterPred;
        return dateMatch && timeMatch && predMatch;
      });

      const sortedData = filteredData.sort((a, b) => {
        const extractSideAndNumber = (filename) => {
          const match = filename.match(/(left|right)_chili_(\d+)/i);
          if (!match) return { side: '', number: 0 };
          return {
            side: match[1].toLowerCase(),
            number: parseInt(match[2], 10)
          };
        };

        const aInfo = extractSideAndNumber(a.image);
        const bInfo = extractSideAndNumber(b.image);

        // Penentu urutan sisi (left: 0, right: 1)
        const aSideOrder = aInfo.side === 'left' ? 0 : 1;
        const bSideOrder = bInfo.side === 'left' ? 0 : 1;

        // Jika ascending: left dulu, lalu urutkan angka kecil ke besar
        // Jika descending: right dulu, lalu angka besar ke kecil
        const dir = sortOrder === 'asc' ? 1 : -1;

        if (aSideOrder !== bSideOrder) {
          return (aSideOrder - bSideOrder) * dir;
        }

        return (aInfo.number - bInfo.number) * dir;
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

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  fetchData(selectedDate, selectedTime);
}, [selectedDate, selectedTime, sortFields, sortOrder, filterPred, filterDate, filterTime]);

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
    <Card sx={{ 
      p: { xs: 1, sm: 2, md: 3 }, 
      maxWidth: isMobile ? '100%' : 1000, 
      width: '100%', 
      mx: 'auto',
      overflow: 'hidden' // Prevent card from overflowing
    }}>
      <CardHeader 
        title="Severity Table" 
        sx={{ 
          px: { xs: 1, sm: 2 },
          '& .MuiCardHeader-title': {
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }
        }}
      />

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField
            select
            label="Sort By"
            value={sortFields}
            onChange={(e) =>
              setSortFields(
                typeof e.target.value === 'string'
                  ? e.target.value.split(',')
                  : e.target.value
              )
            }
            SelectProps={{ multiple: true }}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="tanggal">
              {sortFields.includes("tanggal") && <CheckIcon fontSize="small" sx={{ mr: 1 }} />}
              Date
            </MenuItem>
            <MenuItem value="waktu">
              {sortFields.includes("waktu") && <CheckIcon fontSize="small" sx={{ mr: 1 }} />}
              Time
            </MenuItem>
            <MenuItem value="pred_class_1">
              {sortFields.includes("pred_class_1") && <CheckIcon fontSize="small" sx={{ mr: 1 }} />}
              Prediction 1
            </MenuItem>
          </TextField>

          <TextField
            select
            label="Order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: true }}
            sx={{ minWidth: 150 }}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </TextField>

          <TextField
            label="Filter Level"
            value={filterPred}
            onChange={(e) => setFilterPred(e.target.value)}
            placeholder="0/1/5/3/7/9"
            size="small"
          />

      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{ 
              maxHeight: { xs: 500, sm: 600 },
              overflowY: 'auto',
              overflowX: 'auto',
              maxWidth: '100%',
              // Enhanced scrollbar styling
              '&::-webkit-scrollbar': {
                width: 8,
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#c1c1c1',
                borderRadius: 4,
                '&:hover': {
                  backgroundColor: '#a8a8a8',
                },
              },
            }}
          >
            <Table 
              stickyHeader 
              size={isSmallScreen ? "small" : "medium"}
              sx={{ 
                minWidth: isMobile ? 800 : 'auto', // Ensure minimum width for mobile scrolling
                '& .MuiTableCell-head': {
                  backgroundColor: '#f5f5f5',
                  fontWeight: 'bold',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 1, sm: 1.5 },
                  whiteSpace: 'nowrap',
                },
                '& .MuiTableCell-body': {
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                }
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: { xs: 80, sm: 100 } }}>Image</TableCell>
                  <TableCell sx={{ minWidth: { xs: 80, sm: 120 } }}>Chili</TableCell>
                  <TableCell sx={{ minWidth: { xs: 80, sm: 100 } }}>Date</TableCell>
                  <TableCell sx={{ 
                    minWidth: { xs: 60, sm: 80 }, 
                    width: { xs: 60, sm: 80 }, 
                    textAlign: 'center' 
                  }}>
                    Pred 1
                  </TableCell>
                  <TableCell sx={{ 
                    minWidth: { xs: 60, sm: 80 }, 
                    width: { xs: 60, sm: 80 }, 
                    textAlign: 'center' 
                  }}>
                    Pred 2
                  </TableCell>
                  <TableCell sx={{ 
                    minWidth: { xs: 60, sm: 80 }, 
                    width: { xs: 60, sm: 80 }, 
                    textAlign: 'center' 
                  }}>
                    Pred 3
                  </TableCell>
                  <TableCell sx={{ minWidth: { xs: 80, sm: 100 } }}>Tanggal</TableCell>
                  <TableCell sx={{ minWidth: { xs: 60, sm: 80 } }}>Waktu</TableCell>
                  <TableCell sx={{ minWidth: { xs: 70, sm: 90 } }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : logData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tidak ada data
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  logData.map((item, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '&:nth-of-type(odd)': { 
                          backgroundColor: '#fafafa' 
                        },
                        '&:hover': { 
                          backgroundColor: '#f0f0f0' 
                        }
                      }}
                    >
                      <TableCell sx={{ 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: { xs: 80, sm: 120 }
                      }}>
                        {item.image}
                      </TableCell>
                      <TableCell sx={{ width: { xs: 80, sm: 120 } }}>
                        {item.image_data ? (
                          <img
                            src={item.image_data}
                            alt="Chili"
                            style={{
                              width: '100%',
                              maxWidth: isMobile ? '60px' : '100px',
                              height: 'auto',
                              borderRadius: 4,
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell sx={{ 
                        whiteSpace: 'nowrap',
                        fontSize: { xs: '0.7rem', sm: '0.8rem' }
                      }}>
                        {item.tanggal}
                      </TableCell>
                      <TableCell sx={{ 
                        minWidth: { xs: 60, sm: 80 }, 
                        width: { xs: 60, sm: 80 }, 
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}>
                        {item.pred_class_1}
                      </TableCell>
                      <TableCell sx={{ 
                        minWidth: { xs: 60, sm: 80 }, 
                        width: { xs: 60, sm: 80 }, 
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}>
                        {item.pred_class_2}
                      </TableCell>
                      <TableCell sx={{ 
                        minWidth: { xs: 60, sm: 80 }, 
                        width: { xs: 60, sm: 80 }, 
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}>
                        {item.pred_class_3}
                      </TableCell>
                      <TableCell sx={{ 
                        whiteSpace: 'nowrap',
                        fontSize: { xs: '0.7rem', sm: '0.8rem' }
                      }}>
                        {item.tanggal}
                      </TableCell>
                      <TableCell sx={{ 
                        whiteSpace: 'nowrap',
                        fontSize: { xs: '0.7rem', sm: '0.8rem' }
                      }}>
                        {item.waktu}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          size={isMobile ? "small" : "medium"}
                          onClick={() => handleDeleteClick(item)}
                          sx={{ 
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            px: { xs: 1, sm: 2 },
                            py: { xs: 0.5, sm: 1 },
                            minWidth: { xs: 50, sm: 70 }
                          }}
                        >
                          {isMobile ? 'Del' : 'Delete'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Scroll hint for mobile */}
          {isMobile && (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 1,
                fontStyle: 'italic'
              }}
            >
              ← Geser horizontal untuk melihat kolom lainnya →
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Dialog Konfirmasi */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            mx: { xs: 2, sm: 3 },
            my: { xs: 2, sm: 3 },
          }
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Konfirmasi Penghapusan
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Data dengan gambar <strong>{itemToDelete?.image}</strong> pada tanggal{' '}
            <strong>{itemToDelete?.tanggal}</strong> pukul <strong>{itemToDelete?.waktu}</strong>{' '}
            akan dihapus secara permanen. Apakah Anda yakin?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            color="primary"
            size={isMobile ? "small" : "medium"}
          >
            Batal
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            size={isMobile ? "small" : "medium"}
          >
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
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ 
            width: '100%',
            fontSize: { xs: '0.8rem', sm: '0.875rem' }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}

AppTableSeverity.propTypes = {
  selectedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  selectedTime: PropTypes.string,
};
