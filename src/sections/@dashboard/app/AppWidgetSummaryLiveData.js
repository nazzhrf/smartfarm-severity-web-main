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

AppWidgetSummaryLiveData.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  total: PropTypes.number,
  prefix: PropTypes.string,
  sx: PropTypes.object,
  target: PropTypes.number,
};

export default function AppWidgetSummaryLiveData({
  title,
  total,
  prefix,
  icon,
  color,
  target = 'primary',
  sx,
  ...other
}) {
  return (
    <Card
      sx={{
        py: 7,
        height: '350px',
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
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

      <Typography variant="h3" sx={{ mb: 1 }}>
        {total} {prefix}
      </Typography>

      <Typography variant="h5" sx={{ mb: 2, opacity: 0.72 }}>
        {title}
      </Typography>

      <Typography variant="h6" sx={{ mb: 2, opacity: 0.72 }}>
        Target: {target} {prefix}
      </Typography>
    </Card>
  );
}
