// Prominent absolute-positioned button used for camera controls.
import PropTypes from 'prop-types';

AbsButtomBtn.propTypes = {
  onclick: PropTypes.any
};

// Render the floating button and propagate click events to parents.
export default function AbsButtomBtn({ onclick }) {
  return (
    <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center">
      <button
        type="button"
        onClick={onclick}
        className="pointer-events-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-500 text-slate-100 shadow-2xl shadow-orange-900/40 transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        aria-label="停止"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-12 w-12"
        >
          <circle className="fill-current" opacity="0.2" cx="12" cy="12" r="10" />
          <rect
            x="6"
            y="10.5"
            width="12"
            height="3"
            rx="1.5"
            className="fill-current"
          />
        </svg>
      </button>
    </div>
  );
}
