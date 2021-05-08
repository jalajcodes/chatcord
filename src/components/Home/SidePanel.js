import { Menu, Ref } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import Channels from './Channels';
// import DirectMessages from './DirectMessages';
// import StarredChannels from './StarredChannels';

const SidePanel = ({ currentUser, sidepanelRef }) => (
  <Ref innerRef={sidepanelRef}>
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      className="sidepanel"
      as="div"
      style={{ background: '#2F3037', fontSize: '1.2rem' }}
    >
      <UserPanel currentUser={currentUser} />
      {/* <StarredChannels currentUser={currentUser} /> */}
      <Channels currentUser={currentUser} />
      {/* <DirectMessages currentUser={currentUser} /> */}
    </Menu>
  </Ref>
);

export default SidePanel;
