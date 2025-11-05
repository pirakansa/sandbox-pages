// Render a list of GitHub users with avatars and profile links.
import PropTypes from 'prop-types';

UserListsContent.propTypes = {
  users: PropTypes.any
};

UserLists.propTypes = {
  users: PropTypes.any
};

// Map user records to a Tailwind-styled list presentation.
function UserListsContent({ users }) {
  const generate = users.map((value, idx) => {
    return (
      <li
        key={idx}
        className="flex items-center gap-4 border-b border-slate-200 px-4 py-3 last:border-none dark:border-slate-800"
      >
        <img
          alt={value.login}
          src={value.avatar_url}
          className="h-12 w-12 rounded-full border border-slate-200 object-cover dark:border-slate-700"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {value.login}
          </p>
          <a
            href={value.html_url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block truncate text-xs text-blue-600 underline transition hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
          >
            {value.html_url}
          </a>
        </div>
      </li>
    );
  });

  return (
    <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
      {generate}
    </ul>
  );
}

// Public wrapper ensuring prop-types validation flows through.
export default function UserLists({ users }) {
  return <UserListsContent users={users} />;
}
