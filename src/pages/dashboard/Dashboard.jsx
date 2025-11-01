// Routing hub for dashboard sub-pages and placeholder content.
import styles from './Dashboard.module.scss';
import Container from '@mui/material/Container';
import { Route, Routes, HashRouter } from 'react-router-dom';
import Ghviewer from './Ghviewer.jsx';
import Fgraphviewer from './Fgraphviewer.jsx';
import Cameraviewer from './Cameraviewer.jsx';
import Version from './Version.jsx';
import WasmPlayground from './WasmPlayground.jsx';


// Provide the layout container and wire hash routes to sub components.
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
      <Container {...MARGIN_WIDTH_PROPERTY} >

        <HashRouter>
          <Routes>
            <Route path="/*" element={
              <div className={styles.hoge} >
                {[...new Array(12)].map(
                  () => `Cras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in, egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
                ).join('\n')}
              </div>
            } />
            <Route path="/ghv" element={<Ghviewer />} />
            <Route path="/fgv" element={<Fgraphviewer />} />
            <Route path="/camv" element={<Cameraviewer />} />
            <Route path="/version" element={<Version />} />
            <Route path="/wasm" element={<WasmPlayground />} />
          </Routes>
        </HashRouter>

      </Container>
    </>
  );
}

// Simplify usage by exporting the memoized content function.
export default function Dashboard() {
  return <DashboardContent />;
}
