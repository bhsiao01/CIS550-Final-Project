import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0085A3',
    },
    background: {
      default: '#def1e7'
    }
  },
  typography: {
    button: {
      textTransform: 'none',
    }
  },
  overrides: {
    MuiCard: {
      root: {
        margin: '0 0 24px 0',
      },
    },
  },
})

export default theme
