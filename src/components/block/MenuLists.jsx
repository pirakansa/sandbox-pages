// Navigation menu components rendered in the side drawer.
import PropTypes from 'prop-types';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseClient.js';
import { removeSessionCookie } from '../../services/session.js';

function HomeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-5h-4v5H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ViewerIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      <path
        d="M12 10v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function GraphIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 19V5m0 14h16M8 16l4-7 4 3 4-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function SessionIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 8a5 5 0 1 1 10 0v2h1a2 2 0 0 1 2 2v8H4v-8a2 2 0 0 1 2-2h1V8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 21v-6a3 3 0 0 1 6 0v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 4h6v6H4V4Zm10 0h6v6h-6V4Zm0 10h6v6h-6v-6Zm-7 0h3v3H7v-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinejoin="round"
      />
      <path d="M14 14h2v2h-2z" fill="currentColor" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 3h6m-1 0v6.26l4.32 7.44A2 2 0 0 1 16.53 20H7.47a2 2 0 0 1-1.79-3.3L10 9.26V3"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 15h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M15 7v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="m10 12 10 0m0 0-3-3m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navigationLinks = [
  {
    href: '#/home',
    label: 'HOME',
    Icon: HomeIcon
  },
  {
    href: '#/ghv',
    label: 'Github Viwer',
    Icon: ViewerIcon
  },
  {
    href: '#/version',
    label: 'Version',
    Icon: InfoIcon
  },
  {
    href: '#/fgv',
    label: 'ForceGraph Viwer',
    Icon: GraphIcon
  },
  {
    href: '#/session',
    label: 'Session Status',
    Icon: SessionIcon
  },
  {
    href: '#/camv',
    label: 'Camera Viwer',
    Icon: QrIcon
  },
  {
    href: '#/wasm',
    label: 'WASM Lab',
    Icon: FlaskIcon
  }
];

MenuListsContent.propTypes = {
  onclick: PropTypes.any
};

MenuLists.propTypes = {
  onclick: PropTypes.any
};

// Build the grouped navigation list items shown inside the drawer.
function MenuListsContent({ onclick }) {
  const handleLogout = async () => {
    if (typeof onclick === 'function') {
      onclick();
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error('ログアウトに失敗しました', error);
      return;
    }

    removeSessionCookie();

    if (typeof window !== 'undefined' && window.location?.replace) {
      window.location.replace('/login.html');
    }
  };

  return (
    <nav aria-label="メインメニュー" className="w-full bg-white dark:bg-slate-900">
      <div className="border-b border-slate-200 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Content Menus
      </div>
      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {navigationLinks.map(({ href, label, Icon }) => (
          <li key={href}>
            <a
              href={href}
              className="flex items-center gap-4 px-5 py-4 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:text-slate-100 dark:hover:bg-slate-800"
              onClick={() => {
                if (typeof onclick === 'function') {
                  onclick();
                }
              }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Icon />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-full bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-inner transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-slate-800"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/10 dark:text-red-300">
            <LogoutIcon />
          </span>
          LOGOUT
        </button>
      </div>
    </nav>
  );
}

// Public wrapper component exposing the menu list with click handler.
export default function MenuLists({ onclick }) {
  return <MenuListsContent onclick={onclick} />;
}
