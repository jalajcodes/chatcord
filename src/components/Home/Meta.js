import { useState } from 'react';
import { Accordion, Segment, Icon, Header, Image, List } from 'semantic-ui-react';

const Meta = ({ isPrivateChannel, currentChannel, userPosts }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleActiveIndex = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const formatCount = (count) => (count > 1 || count === 0 ? `${count} chats` : `${count} chat`);

  const displayTopPosters = (userPosts) =>
    Object.entries(userPosts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, value], i) => (
        <List.Item key={i}>
          <Image avatar src={value.avatar} />
          <List.Content>
            <List.Header as="a">{key}</List.Header>
            <List.Description style={{ color: '#fff' }}>
              {formatCount(value.count)}
            </List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 5);

  if (isPrivateChannel || !currentChannel) return null;

  return (
    <>
      <Segment className="meta__segment">
        <Header
          className="meta__segment"
          style={{ border: 'none', fontFamily: 'inherit' }}
          as="h3"
          attached="top"
        >
          About #{currentChannel.name}
        </Header>
      </Segment>
      {/* <Segment> */}
      <Accordion className="meta__segment" styled attached="true" style={{ marginTop: 0 }}>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={handleActiveIndex}>
          <Icon name="dropdown" />
          <Icon name="info" />
          Channel Info
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>{currentChannel.about} </Accordion.Content>

        <Accordion.Title active={activeIndex === 1} index={1} onClick={handleActiveIndex}>
          <Icon name="dropdown" />
          <Icon name="user circle" />
          Top Chatters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <List>{userPosts && displayTopPosters(userPosts)}</List>
        </Accordion.Content>

        <Accordion.Title active={activeIndex === 2} index={2} onClick={handleActiveIndex}>
          <Icon name="dropdown" />
          <Icon name="pencil alternate" />
          Created By
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <Header as="h3" style={{ color: '#fff' }}>
            <Image avatar spaced="right" src={currentChannel.createdBy.avatar} />
            {currentChannel.createdBy.name}
          </Header>
        </Accordion.Content>
      </Accordion>
      {/* </Segment> */}
    </>
  );
};

export default Meta;
