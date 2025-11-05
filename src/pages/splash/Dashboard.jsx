// Splash screen layout that centers the logo and adapts image size.
import { useWindowSize } from '../../utils/WindowSize.js';
import jpegLogo from '../../assets/logo.jpeg';
import ThemeModeToggle from '../../components/atoms/ThemeModeToggle.jsx';

// Calculate responsive dimensions for the splash image element.
function getImageSizeProp(size) {
  if (size.height > size.width) {
    return { width: size.width * 0.6 };
  }
  return { height: size.height * 0.6 };
}

// Render the centered splash view with a link to the main dashboard.
function DashboardContent() {
  const size = useWindowSize();
  const imageSize = getImageSizeProp(size);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-6 py-6 text-slate-800 transition dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col">
        <div className="flex justify-end">
          <ThemeModeToggle size="small" />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <a
            href="/top.html"
            className="group inline-flex flex-col items-center rounded-3xl bg-white/80 p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 transition hover:shadow-2xl hover:ring-blue-200 dark:bg-slate-900/60 dark:ring-slate-800 dark:hover:bg-slate-900/80 dark:hover:ring-blue-500/30"
          >
            <img
              alt="logo"
              src={jpegLogo}
              style={imageSize}
              className="rounded-2xl object-contain drop-shadow-lg transition group-hover:scale-[1.02]"
            />
            <span className="mt-6 text-sm font-medium text-blue-600 transition group-hover:text-blue-500 dark:text-blue-300 dark:group-hover:text-blue-200">
              Enter Dashboard
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
