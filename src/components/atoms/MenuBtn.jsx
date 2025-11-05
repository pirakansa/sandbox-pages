// Floating menu button that toggles the navigation drawer.
import { useState } from 'react';
import { createPortal } from 'react-dom';
import MenuLists from '../block/MenuLists';
import { isMobile } from '../../utils/WindowSize.js';

// Maintain drawer state and render the activator button.
function MenuBtnContent() {

  const [open, setOpen] = useState(false);
  const mobile = isMobile();
  const panelShapeClass = mobile ? 'rounded-t-3xl' : 'rounded-b-3xl';
  const verticalOffsetClass = mobile ? 'mt-auto pb-6' : 'pt-6';

  const overlay =
    open && typeof document !== 'undefined'
      ? createPortal(
        <div
          className="fixed inset-0 z-[1300] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="メニュー"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => {
              setOpen(false);
            }}
          />

          <div className={`relative mx-auto w-full max-w-xl px-4 ${verticalOffsetClass}`}>
            <div
              className={`overflow-hidden ${panelShapeClass} bg-white shadow-2xl ring-1 ring-black/10 dark:bg-slate-900 dark:ring-white/10`}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <MenuLists
                onclick={() => {
                  setOpen(false);
                }}
              />
            </div>
          </div>
        </div>,
        document.body
      )
      : null;

  return (
    <>
      <button
        type="button"
        aria-label="メニューを開く"
        onClick={() => {
          setOpen(true);
        }}
        className="inline-flex items-center justify-center rounded-full p-2 text-slate-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-6 w-6"
        >
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {overlay}
    </>
  );
}

// Public wrapper component exposing the menu button atom.
export default function MenuBtn() {
  return <MenuBtnContent />;
}
