// GitHub user search view embedded in the dashboard router.
import styles from './Dashboard.module.scss';
import { useState } from 'react';
import OctkitManager from "../../utils/OctkitManager";
import SearchText from "../../components/atoms/SearchText";
import UserLists from "../../components/block/UserLists";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const octokit = OctkitManager({});

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

// Fetch GitHub users and present search results within a light theme.
function GhviewerContent() {

  const [users, setUsers] = useState([]);

  return (
    <>
     <ThemeProvider theme={theme}>
        <div className={styles.boxmergin} >
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
      </ThemeProvider>
    </>
  );
}

export default function Ghviewer() {
  return <GhviewerContent />;
}
