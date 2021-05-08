import { useEffect, useRef, useState, forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import FlipMove from 'react-flip-move';
import firebase from '../../firebase';
import { setCurrentChannel, setPrivateChannel, setUserPosts } from '../../actions';

const Channels = ({ currentUser }) => {
  const [channels, setChannels] = useState([]);
  // const [notifications, setNotifications] = useState([]);
  // const [channel, setChannel] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [channelDetails, setChannelDetails] = useState({});
  const channelsRef = useRef(firebase.database().ref('channels')).current;
  // const messagesRef = useRef(firebase.database().ref('messages')).current;
  const firstRender = useRef(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadedChannels = [];
    channelsRef.on('child_added', async (snap) => {
      await loadedChannels.push(snap.val());
      console.log('🚀 ~ loadedChannels', loadedChannels);
      setChannels(loadedChannels);
    });

    return () => channelsRef.off();
  }, [channelsRef]);

  // this useEffect will only run on first render and select first channel from the list of channels.
  useEffect(() => {
    if (firstRender.current && channels.length > 0) {
      const firstChannel = channels[0];
      dispatch(setCurrentChannel(firstChannel));
      setActiveChannel(firstChannel);
      firstRender.current = false;
    }
  }, [channels, channelsRef, dispatch]);

  const isFormValid = ({ channelName, channelAbout }) => channelAbout && channelName;

  const addChannel = async () => {
    const { key } = channelsRef.push();
    const newChannel = {
      id: key,
      name: channelDetails.channelName,
      about: channelDetails.channelAbout,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    };
    try {
      setModalOpen(false);
      setChannelDetails({});
      await channelsRef.child(key).update(newChannel);
    } catch (error) {
      console.error(error);
    }
  };

  const changeChannel = (channel) => {
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false));
    dispatch(setUserPosts(null));
    setActiveChannel(channel);
    // setChannel(channel);
  };

  const DisplayChannels = forwardRef(({ channel }, ref) => (
    <Menu.Item
      ref={ref}
      key={channel.id}
      onClick={() => changeChannel(channel)}
      name={channel.name}
      style={{ opacity: 0.7 }}
      active={channel.id === activeChannel?.id}
    >
      # {channel.name}
    </Menu.Item>
  ));

  DisplayChannels.displayName = 'DisplayChannels';

  const handleChange = (e) => {
    setChannelDetails({
      ...channelDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormValid(channelDetails)) {
      addChannel();
    }
  };

  return (
    <>
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="usb" /> CHANNELS{' '}
          </span>
          ({channels.length}){' '}
          <Icon name="add" style={{ cursor: 'pointer' }} onClick={() => setModalOpen(true)} />
        </Menu.Item>
        <FlipMove>
          {channels.length > 0 &&
            channels.map((channel) => <DisplayChannels key={channel.id} channel={channel} />)}
        </FlipMove>
      </Menu.Menu>

      <Modal dimmer="blurring" basic open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>Add a channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input fluid label="Name" name="channelName" onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <Input fluid label="About" name="channelAbout" onChange={handleChange} />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleSubmit} color="green" inverted>
            <Icon name="checkmark" /> Add
          </Button>
          <Button color="red" inverted onClick={() => setModalOpen(false)}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Channels;
