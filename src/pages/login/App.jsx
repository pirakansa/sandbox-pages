// Login app shell applying the shared theme around the dashboard view.
import Dashboard from "./Dashboard.jsx";
import { AppThemeProvider } from '../../utils/Theme.jsx';

// Provide theming and consistent layout for the login dashboard.
function App() {
  return (
    <AppThemeProvider>
      <div className="min-h-screen">
        <Dashboard />
      </div>
    </AppThemeProvider>
  );
}

export default App;
