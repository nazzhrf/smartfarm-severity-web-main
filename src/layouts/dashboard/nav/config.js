// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Severity Log',
    path: '/dashboard/severity-log',
    icon: icon('ic_warning'), // atau sesuaikan dengan nama icon yang ada di folder `public/assets/icons/navbar`
  },
  {
    title: 'access',
    path: '/dashboard/access',
    icon: icon('ic_user'),
  },
];

export default navConfig;
