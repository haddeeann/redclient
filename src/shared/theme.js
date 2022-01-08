import { createMuiTheme } from '@material-ui/core/styles';
import { colors } from './colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.brandBlue,
    },
    secondary: {
      main: colors.brandRed,
    },
  },
});

export default theme;