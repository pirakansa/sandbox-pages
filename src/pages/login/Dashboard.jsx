import styles from './Dashboard.module.scss';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import * as cookie from 'cookie';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

const NameScope = uuidv5(window.location.hostname, uuidv5.URL);

function DashboardContent() {

  const MARGIN_WIDTH_PROPERTY = {
    maxWidth: 'xl',
    disableGutters: false,
    sx:{
      my: 2, // mergin-y
    }
  };

  document.cookie = cookie.serialize(NameScope, '',{maxAge : 0});
  
  return (
    <>
      <Container {...MARGIN_WIDTH_PROPERTY} >
        <Grid container >
          <Grid item className={styles.center} >

          <Button
            variant="contained"
            onClick={() => {
              document.cookie = cookie.serialize(NameScope,
                uuidv4(),
                {maxAge : 60 * 30}
              );
              setTimeout(()=>{
                location.replace('/top.html');
              }, 300)
            }}
          >
            Dummy Login Boutton
          </Button>

          </Grid>
        </Grid>

      </Container>
    </>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}