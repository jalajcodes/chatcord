import { useRef, useState, useEffect, useCallback } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import FlipMove from 'react-flip-move';
import { useDispatch } from 'react-redux';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import { setUserPosts } from '../../actions';

const Messages = ({ currentChannel: channel, currentUser: user, isPrivateChannel }) => {
  const messagesRef = useRef(firebase.database().ref('messages')).current;
  const privateMessagesRef = useRef(firebase.database().ref('privateMessages')).current;
  // const usersRef = useRef(firebase.database().ref('users')).current;
  const [messages, setMessages] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [, setMessagesLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isChannelStarred, setIsChannelStarred] = useState(false);
  const messageEndRef = useRef(null);
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSearchLoading(true);
  };

  useEffect(() => {
    const filterMessages = () => {
      const channelMessages = [...messages];
      const regex = new RegExp(searchTerm, 'gi');
      const searchResults = channelMessages.reduce((acc, message) => {
        if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
          acc.push(message);
        }
        return acc;
      }, []);
      console.log('🚀 ~ searchResults', searchResults);
      setSearchResults([...searchResults]);
      setTimeout(() => setSearchLoading(false), 800);
    };

    if (searchTerm && searchTerm.length > 1) {
      filterMessages();
    } else {
      setSearchLoading(false);
    }
  }, [searchTerm, messages]);

  useEffect(() => {
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;
    setUniqueUsers(numUniqueUsers);
  };

  const countUserPosts = useCallback(
    (messages) => {
      const userPosts = messages.reduce((acc, message) => {
        if (message.user.name in acc) {
          acc[message.user.name].count += 1;
        } else {
          acc[message.user.name] = {
            avatar: message.user.avatar,
            count: 1,
          };
        }
        return acc;
      }, {});
      dispatch(setUserPosts(userPosts));
    },
    [dispatch]
  );

  const getMessagesRef = useCallback(() => (isPrivateChannel ? privateMessagesRef : messagesRef), [
    isPrivateChannel,
    messagesRef,
    privateMessagesRef,
  ]);

  const imageLoaded = () => {
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const displayMessages = (messages) =>
    messages &&
    messages.map((message) => (
      <Message imageLoaded={imageLoaded} key={message.timestamp} message={message} user={user} />
    ));

  const displayChannelName = (channel) =>
    channel ? `${isPrivateChannel ? '@' : '#'}${channel.name}` : '';

  useEffect(() => {
    const newMessageListener = (channelId) => {
      const loadedMessages = [];
      const ref = getMessagesRef();
      ref
        .child(channelId)
        .limitToLast(40)
        .on('child_added', async (snap) => {
          await loadedMessages.push(snap.val());
          // console.log("🚀 ~ loadedMessages", loadedMessages);
          setMessages([...loadedMessages]);
          countUniqueUsers([...loadedMessages]);
          countUserPosts([...loadedMessages]);
          setMessagesLoading(false);
        });
    };

    if (channel && user) {
      newMessageListener(channel.id);
    }

    return () => getMessagesRef().off();
  }, [channel, user, getMessagesRef, countUserPosts]);

  // const starChanel = () => {
  //   if (channel && user) {
  //     if (!isChannelStarred) {
  //       usersRef.child(`${user.uid}/starred`).update({
  //         [channel.id]: {
  //           name: channel.name,
  //           about: channel.about,
  //           createdBy: {
  //             name: channel.createdBy.name,
  //             avatar: channel.createdBy.avatar,
  //           },
  //         },
  //       });
  //     } else {
  //       usersRef
  //         .child(`${user.uid}/starred`)
  //         .child(channel.id)
  //         .remove((err) => {
  //           if (err !== null) {
  //             console.error(err);
  //           }
  //         });
  //     }
  //   }
  // };

  const handleStar = () => {
    setIsChannelStarred((prev) => !prev);
    // starChanel();
  };

  // useEffect(() => {
  //   if (user && channel) {
  //     usersRef
  //       .child(user.uid)
  //       .child('starred')
  //       .once('value')
  //       .then((data) => {
  //         if (data.val() !== null) {
  //           const channelIds = Object.keys(data.val());
  //           const alreadyStarred = channelIds.includes(channel.id);
  //           setIsChannelStarred(alreadyStarred);
  //         }
  //       });
  //   }
  // }, []);

  return (
    <>
      <div className="messages-wrapper">
        <MessagesHeader
          isChannelStarred={isChannelStarred}
          handleStar={handleStar}
          isPrivateChannel={isPrivateChannel}
          handleSearch={handleSearch}
          channelName={displayChannelName(channel)}
          uniqueUsers={uniqueUsers}
          searchLoading={searchLoading}
        />

        <Segment className="messages">
          <Comment.Group>
            <FlipMove delay={20} staggerDelayBy={20}>
              {searchTerm && searchTerm.length > 1
                ? displayMessages(searchResults)
                : displayMessages(messages)}
            </FlipMove>
            <div ref={messageEndRef} />
          </Comment.Group>
        </Segment>

        <MessageForm
          isPrivateChannel={isPrivateChannel}
          messagesRef={getMessagesRef()}
          currentChannel={channel}
          currentUser={user}
        />
      </div>
    </>
  );
};

export default Messages;

// import { Segment, Comment } from 'semantic-ui-react';
// import { useRef, useEffect, useState } from 'react';
// import FlipMove from 'react-flip-move';
// import MessagesHeader from './MessagesHeader';
// import MessageForm from './MessageForm';
// import firebase from '../../firebase';
// import Message from './Message';

// const Messages = ({ currentUser, currentChannel }) => {
//   const messagesRef = useRef(firebase.database().ref('messages')).current;

//   const [messages, setMessages] = useState([]);
//   const [messagesLoading, setMessagesLoading] = useState(true);

//   useEffect(() => {
//     if (currentChannel && messages) {
//       const loadedMessages = [];
//       messagesRef.child(currentChannel.id).on('child_added', async (snap) => {
//         const messageData = snap.val();
//         loadedMessages.push(messageData);
//         console.log('🚀 ~ loadedMessages', loadedMessages);
//         console.log('🚀 ~ messagesData', messageData);
//       });
//       setMessages(loadedMessages);
//       setMessagesLoading(false);
//     }
//   }, [currentChannel, messagesRef]);

//   return (
//     <div className="messages-wrapper">
//       <MessagesHeader />

//       <Segment className="messages">
//         <Comment.Group>
//           <FlipMove appearAnimation="fade" leaveAnimation="elevator">
//             {messages.length > 0 &&
//               messages.map((message) => (
//                 <Message key={message.timestamp} message={message} user={currentUser} />
//               ))}
//           </FlipMove>
//         </Comment.Group>
//       </Segment>

//       <MessageForm
//         messagesRef={messagesRef}
//         currentChannel={currentChannel}
//         currentUser={currentUser}
//       />
//     </div>
//   );
// };

// export default Messages;
