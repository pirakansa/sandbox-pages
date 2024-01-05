import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';


UserListsContent.propTypes = {
  users: PropTypes.any
};
UserLists.propTypes = {
  users: PropTypes.any
};


function UserListsContent({ users }) {

  const generate = users.map((value, idx) => {
    return (
      <ListItem alignItems="flex-start" divider={true} key={idx} >
        <ListItemAvatar>
          <Avatar alt={value.login} src={value.avatar_url} />
        </ListItemAvatar>
        <ListItemText
          primary={value.login}
          secondary={
            <a href={value.html_url} target="_blank" rel="noreferrer" >
                {value.html_url}
            </a>
          }
        />
      </ListItem>
    );
  });

  return (
    <>
      <List>
        {generate}
      </List>
    </>
  );
}

export default function UserLists({ users }) {
  return <UserListsContent users={users} />;
}