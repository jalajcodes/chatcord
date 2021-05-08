import { Header, Segment, Input, Icon } from 'semantic-ui-react';

const MessagesHeader = ({
  channelName,
  uniqueUsers,
  handleSearch,
  searchLoading,
  isPrivateChannel,
  // handleStar,
  isChannelStarred,
}) => (
  <Segment inverted className="messages__header">
    <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
      <span>
        {channelName || '#channel'}{' '}
        {!isPrivateChannel && (
          <Icon
            // onClick={handleStar}
            name={isChannelStarred ? 'star' : 'star outline'}
            color={isChannelStarred ? 'yellow' : null}
            style={{ cursor: 'pointer' }}
          />
        )}
      </span>
      <Header.Subheader style={{ color: '#eee' }}>
        {isPrivateChannel ? '2 users' : uniqueUsers || '0 Users'}
      </Header.Subheader>
    </Header>

    <Header floated="right" className="searchbar">
      <Input
        loading={searchLoading}
        onChange={handleSearch}
        size="mini"
        icon="search"
        name="searchTerm"
        placeholder="Search Messages or Users"
      />
    </Header>
  </Segment>
);

export default MessagesHeader;
