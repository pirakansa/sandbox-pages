// Search text input with submit button used across dashboard views.
import PropTypes from 'prop-types';
import { useRef } from 'react';

SearchTextContent.propTypes = {
  onsubmit: PropTypes.any,
  placeholder: PropTypes.any
};
SearchText.propTypes = {
  onsubmit: PropTypes.any,
  placeholder: PropTypes.any
};


// Render the controlled search form and forward submissions.
function SearchTextContent({ onsubmit, placeholder }) {

  const ref = useRef();

  const onSubmitHandler = () => {
    onsubmit(ref.current.value);
  }

  return (
    <form
      className="flex w-full items-stretch overflow-hidden rounded-full border border-slate-300 bg-white shadow-sm ring-slate-200 focus-within:ring-2 focus-within:ring-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:ring-slate-700"
      onSubmit={(ev)=>{
        ev.preventDefault();
        onSubmitHandler();
      }}
    >

      <input
        ref={ref}
        type="search"
        placeholder={placeholder}
        className="flex-1 bg-transparent px-4 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
      />

      <button
        type="button"
        onClick={()=>onSubmitHandler()}
        className="m-1 inline-flex items-center justify-center rounded-full bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        aria-label="検索"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path
            d="m15.5 15.5 4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="11"
            cy="11"
            r="6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </button>
    
    </form>
  );
}

// Wrapper atom that wires validation and props through to the actual form.
export default function SearchText({ onsubmit, placeholder }) {
  return <SearchTextContent onsubmit={onsubmit} placeholder={placeholder} />;
}
