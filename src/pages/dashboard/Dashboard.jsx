import styles from './Dashboard.module.scss';
import Header from '../../components/block/Header.jsx';
import MenuBtn from '../../components/atoms/MenuBtn.jsx';
import Container from '@mui/material/Container';
import {Route, Routes, HashRouter, useLocation} from 'react-router-dom';


function DashboardContent() {

  const MARGIN_WIDTH_PROPERTY = {
    maxWidth: 'xl',
    disableGutters: false,
    sx:{
      my: 2, // mergin-y
    }
  };

  return (
    <>
      <Header >
        <MenuBtn></MenuBtn>
      </Header>

      <Container {...MARGIN_WIDTH_PROPERTY} >

        <HashRouter>
          <Routes>
            <Route path="/*" element={
              <div className={styles.hoge} >
              {[...new Array(12)]
                .map(
                  () => `Cras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in, egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
                )
                .join('\n')}
            </div>
            } />
          </Routes>
        </HashRouter>

      </Container>
    </>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}