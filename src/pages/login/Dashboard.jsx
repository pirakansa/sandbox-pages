import styles from './Dashboard.module.scss';
import Header from '../../components/block/Header.jsx';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import cookie from 'cookie';
import { v4 as uuidv4 } from 'uuid';

function DashboardContent() {

  const MARGIN_WIDTH_PROPERTY = {
    maxWidth: 'xl',
    disableGutters: false,
    sx:{
      my: 2, // mergin-y
    }
  };

  document.cookie = cookie.serialize('uuid', '',{maxAge : 0});
  
  return (
    <>
      <Header ></Header>

      <Container {...MARGIN_WIDTH_PROPERTY} >
        <Grid container >
          <Grid item className={styles.center} >

          <Button
            variant="contained"
            onClick={() => {
              document.cookie = cookie.serialize('uuid',
                uuidv4(),
                {maxAge : 60 * 30}
              );
              location.replace('/top.html');
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