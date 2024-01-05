import styles from './Dashboard.module.scss';
import { useWindowSize } from '../../utils/WindowSize.js';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import jpegLogo from '../../assets/logo.jpeg';

function GetImageSizeProp(size) {
  const imgSizeProp = (size.height > size.width)
    ?{ width: (size.width*0.6) }
    :{ height: (size.height*0.6) };
  return imgSizeProp;
}

function DashboardContent() {

  const MARGIN_WIDTH_PROPERTY = {
    maxWidth: 'xl',
    disableGutters: false,
    sx:{
      my: 2, // mergin-y
    }
  };

  const size = useWindowSize();
  const imageSize = GetImageSizeProp(size);

  return (
    <>
      <Container {...MARGIN_WIDTH_PROPERTY} >
        <Grid container >
          <Grid item className={styles.center} >
            <div>
              <a href="/top.html">
                <img
                  alt="logo"
                  src={jpegLogo}
                  {...imageSize}
                />
              </a>
            </div>
          </Grid>
        </Grid>

      </Container>
    </>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}