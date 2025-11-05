// Splash screen shell that shows the landing dashboard with global theme.
import Dashboard from "./Dashboard.jsx";
import { AppThemeProvider } from '../../utils/Theme.jsx';

// Wrap the splash dashboard with the shared layout and theme objects.
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
