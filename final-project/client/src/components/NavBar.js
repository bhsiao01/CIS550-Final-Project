import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Button } from '@material-ui/core'

const NavBar = () => {
  return (
    <>
      <Grid
        container
        direction={'row'}
        alignItems="center"
        spacing={3}
        style={{ padding: 24 }}
      >
        <Grid item xs={3} style={{ textAlign: 'left' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button size="large">what's this called</Button>
          </Link>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={1}>
          <Link to="/location/">
            <Button size="large">
              Location
            </Button>
          </Link>
        </Grid>
        <Grid item xs={1}>
          <Link to="/company/">
            <Button size="large">
              Company
            </Button>
          </Link>
        </Grid>
        <Grid item xs={1}>
          <Link to="/industry/">
            <Button size="large">
              Industry
            </Button>
          </Link>
        </Grid>
      </Grid>
    </>
  )
}

export default NavBar
