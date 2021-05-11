import formatDistance from 'date-fns/formatDistance';
import { forwardRef } from 'react';
import { Comment, Image } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';

const isOwnMessage = (message, user) => (message.user.id === user.uid ? 'message__self' : '');

const timeFromNow = (timestamp) =>
  formatDistance(new Date(timestamp), new Date(), { addSuffix: true });

const Message = forwardRef(({ message, user, imageLoaded }, ref) => {
  const isImage = () =>
    Object.prototype.hasOwnProperty.call(message, 'image') &&
    !Object.prototype.hasOwnProperty.call(message, 'content');

  return (
    <div ref={ref}>
      <Comment className={isOwnMessage(message, user)}>
        <Comment.Avatar src={message.user.avatar} />
        <Comment.Content style={{ overflow: 'hidden' }}>
          <Comment.Author as="a">{message.user.name}</Comment.Author>
          <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
          {isImage() ? (
            <Image onLoad={imageLoaded} src={message.image} className="message__image" />
          ) : (
            <Comment.Text>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </Comment.Text>
          )}
        </Comment.Content>
      </Comment>
    </div>
  );
});

Message.displayName = 'ChatMessage';
export default Message;
