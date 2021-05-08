import { Loader, Dimmer } from 'semantic-ui-react';

const Spinner = () => (
  <Dimmer active>
    <Loader size="huge" content="Launching App..." />
  </Dimmer>
);

export default Spinner;
