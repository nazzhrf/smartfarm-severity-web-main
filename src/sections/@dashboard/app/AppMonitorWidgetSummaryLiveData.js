// @mui
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils

// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledIcon = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(10),
  height: theme.spacing(10),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

AppMonitorWidgetSummaryLiveData.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  title1: PropTypes.string.isRequired,
  total: PropTypes.number,
  prefix: PropTypes.string,
  sx: PropTypes.object,
  target: PropTypes.number,
  title2: PropTypes.string.isRequired,
  total1: PropTypes.number,
  prefix1: PropTypes.string,
  sx1: PropTypes.object,
  target1: PropTypes.number,
  total2: PropTypes.number,
};

export default function AppMonitorWidgetSummaryLiveData({
  title,
  title1,
  total,
  prefix,
  icon,
  color,
  target = 'primary',
  sx,
  title2,
  total1,
  prefix1,
  target1 = 'primary',
  total2,
  ...other
}) {
  return (
    <Card
      sx={{
        py: 7,
        height: '400px',
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        {title}
      </Typography>

      <StyledIcon
        sx={{
          color: (theme) => theme.palette[color].dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
              theme.palette[color].dark,
              0.24
            )} 100%)`,
        }}
      >
        <Iconify icon={icon} width={30} height={30} />
      </StyledIcon>

      <Typography variant="h6" sx={{ mb: 1 }}>
        {title1} : {total} {prefix}
      </Typography>

      <Typography variant="h6" sx={{ mb: 2, opacity: 0.72 }}>
        Target: {target} {prefix}
      </Typography>

      <Typography variant="h6" sx={{ mb: 1 }}>
        {title2} : {total1} {prefix1}
      </Typography>

      <Typography variant="h6" sx={{ mb: 2, opacity: 0.72 }}>
        Target: {target1} {prefix1}
      </Typography>

      <Typography variant="h8" sx={{ mb: 2, opacity: 0.72 }}>
        CPU: {total2} {prefix}
      </Typography>
        
    </Card>
  );
}
