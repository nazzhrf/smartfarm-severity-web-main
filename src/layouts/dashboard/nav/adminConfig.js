// component
import { Icon } from '@iconify/react';
import SvgColor from '../../../components/svg-color';


// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navAdminConfig = [
  {
    title: 'Device & Access',
    path: '/admin/request',
    icon: icon('ic_user'),
  },
  {
    title: 'dashboard',
    path: '/admin/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Monitor',
    path: '/admin/monitor',
    icon: icon('ic_lock'),
  },
  {
    title: 'Severity Log',
    path: '/admin/severity-log',
    icon: icon('ic_warning'), // atau sesuaikan dengan nama icon yang ada di folder `public/assets/icons/navbar`
  },
  {
    title: 'Users',
    path: '/admin/user',
    icon: <Icon icon="streamline:contact-phonebook-2" />,
  },
];

export default navAdminConfig;
