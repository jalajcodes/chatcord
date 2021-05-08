import { Sidebar, Menu, Divider, Button } from 'semantic-ui-react';

const ServerPanel = () => (
  <Sidebar
    as={Menu}
    icon="labeled"
    inverted
    vertical
    visible
    width="very thin"
    className="serverpanel"
    style={{ paddingTop: 10, backgroundColor: '#202225' }}
  >
    <Button title="Add Server" icon="add" size="small" color="teal" circular />
    <Divider inverted />
  </Sidebar>
);

export default ServerPanel;
