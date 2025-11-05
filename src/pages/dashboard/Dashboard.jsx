// Routing hub for dashboard sub-pages and placeholder content.
import { Route, Routes, HashRouter } from 'react-router-dom';
import Ghviewer from './Ghviewer.jsx';
import Fgraphviewer from './Fgraphviewer.jsx';
import Cameraviewer from './Cameraviewer.jsx';
import Version from './Version.jsx';
import SessionStatus from './SessionStatus.jsx';
import WasmPlayground from './WasmPlayground.jsx';


// Provide the layout container and wire hash routes to sub components.
function DashboardContent() {

  return (
    <>
      <div className="space-y-8 pb-10">
        <HashRouter>
          <Routes>
            <Route
              path="/*"
              element={
                <div className="rounded-3xl border border-cyan-200 bg-cyan-100/60 p-6 text-sm leading-relaxed text-cyan-900 shadow-inner dark:border-cyan-500/40 dark:bg-cyan-900/30 dark:text-cyan-100">
                  {[...new Array(12)]
                    .map(
                      () =>
                        'Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.'
                    )
                    .join('\n')}
                </div>
              }
            />
            <Route path="/ghv" element={<Ghviewer />} />
            <Route path="/fgv" element={<Fgraphviewer />} />
            <Route path="/camv" element={<Cameraviewer />} />
            <Route path="/version" element={<Version />} />
            <Route path="/session" element={<SessionStatus />} />
            <Route path="/wasm" element={<WasmPlayground />} />
          </Routes>
        </HashRouter>
      </div>
    </>
  );
}

// Simplify usage by exporting the memoized content function.
export default function Dashboard() {
  return <DashboardContent />;
}
