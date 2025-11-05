// GitHub user search view embedded in the dashboard router.
import { useState } from 'react';
import OctkitManager from "../../utils/OctkitManager";
import SearchText from "../../components/atoms/SearchText";
import UserLists from "../../components/block/UserLists";

const octokit = OctkitManager({});

// Fetch GitHub users and present search results with the shared theme.
function GhviewerContent() {

  const [users, setUsers] = useState([]);

  return (
    <>
      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <SearchText
          placeholder="search user name"
          onsubmit={(user)=>{
            octokit.request('GET /search/users',{
              q : `${user}`
            }).then((res)=>{
              if (res.status == 200 ){
                setUsers(res.data.items);
                console.log(res.data.items);
                console.log(res.data.total_count);
              }else{
                alert("status error");
              }
            });
          }}
        />
      </div>

      <UserLists users={users} />
    </>
  );
}

export default function Ghviewer() {
  return <GhviewerContent />;
}
