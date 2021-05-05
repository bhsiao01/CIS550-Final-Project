import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0085A3',
    },
    background: {
      // default: '#def1e7'
      default: '#0085a31a'
    }
  },
  typography: {
    button: {
      textTransform: 'none',
      fontFamily: 'Inter var'
    }
  },
  overrides: {
    MuiCard: {
      root: {
        margin: '0 0 24px 0',
      },
    },
    MuiSelect: {
      root: {
        border: '5px',
      }
    }
  },
})

export default theme
