// Splash screen layout that centers the logo and adapts image size.
import styles from './Dashboard.module.scss';
import { useWindowSize } from '../../utils/WindowSize.js';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import jpegLogo from '../../assets/logo.jpeg';
import Box from '@mui/material/Box';
import ThemeModeToggle from '../../components/atoms/ThemeModeToggle.jsx';

// Calculate responsive dimensions for the splash image element.
function GetImageSizeProp(size) {
  const imgSizeProp = (size.height > size.width)
    ?{ width: (size.width*0.6) }
    :{ height: (size.height*0.6) };
  return imgSizeProp;
}

// Render the centered splash view with a link to the main dashboard.
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 2
          }}
        >
          <ThemeModeToggle size="small" />
        </Box>
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
