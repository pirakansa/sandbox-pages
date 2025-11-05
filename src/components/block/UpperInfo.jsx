// Informational alert banner pinned near the top of the viewport.
import PropTypes from 'prop-types';

UpperInfo.propTypes = {
  children: PropTypes.any
};

// Display its children inside a Tailwind-styled info alert container.
export default function UpperInfo({ children }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center px-4">
      <div
        className="pointer-events-auto w-full max-w-xl rounded-2xl border border-blue-200 bg-blue-50/90 px-5 py-4 text-blue-900 shadow-lg shadow-blue-500/20 backdrop-blur dark:border-blue-500/30 dark:bg-blue-900/40 dark:text-blue-100"
        role="status"
        aria-live="polite"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">
          Scanned
        </p>
        <div className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}
