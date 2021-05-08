import { Button, Grid } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import ServerPanel from './ServerPanel';
import SidePanel from './SidePanel';
import Messages from './Messages';
import Meta from './Meta';

const Home = () => {
  const {
    channel: { currentChannel, isPrivateChannel, userPosts },
    user: { currentUser },
  } = useSelector((state) => state);
  const sidepanelRef = useRef(null);

  const toggleSidepanel = () => {
    if (sidepanelRef.current) {
      sidepanelRef.current.classList.toggle('sidepanel-visible');
    }
  };
  return (
    <div className="home">
      <div className="mobile-sidebar-toggle">
        <Button size="huge" onClick={toggleSidepanel} circular icon="align left" color="teal" />
      </div>
      <Grid columns="equal" style={{ background: '#37383F' }}>
        <ServerPanel />
        <SidePanel sidepanelRef={sidepanelRef} currentUser={currentUser} />

        <Grid.Column style={{ marginLeft: 320, height: '100vh' }} className="messages-column">
          <Messages
            toggleSidepanel={toggleSidepanel}
            sidepanelRef={sidepanelRef}
            key={currentChannel && currentChannel.id}
            isPrivateChannel={isPrivateChannel}
            currentUser={currentUser}
            currentChannel={currentChannel}
          />
        </Grid.Column>
        <Grid.Column width={4} className="meta-column">
          <Meta
            userPosts={userPosts}
            currentChannel={currentChannel}
            isPrivateChannel={isPrivateChannel}
          />
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default Home;
