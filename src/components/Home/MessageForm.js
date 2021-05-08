import { useRef, useState, useEffect } from 'react';
import { Segment, Button, TextArea, Form, Ref } from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../firebase';
import UploadFileModal from './UploadFileModal';
import ProgressBar from './ProgressBar';
import 'emoji-mart/css/emoji-mart.css';

const MessageForm = ({ messagesRef, currentChannel, currentUser, isPrivateChannel }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [shortcutKeyPressed, setShortcutKeyPressed] = useState(0);
  const [uploadState, setUploadState] = useState('');
  const storageRef = useRef(firebase.storage().ref()).current;
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setError('');
    setMessage(e.target.value);
  };

  const createMessage = (fileUrl = null) => {
    const messageObject = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    };

    if (fileUrl !== null) {
      messageObject.image = fileUrl;
    } else {
      messageObject.content = message;
    }
    return messageObject;
  };

  const sendMessage = async () => {
    if (message.trim().length > 0) {
      setLoading(true);
      try {
        await messagesRef.child(currentChannel.id).push().set(createMessage());
        setLoading(false);
        setMessage('');
      } catch (error) {
        setLoading(false);
        setMessage('');
        console.error(error);
        setError(error.message);
      }
    } else {
      setError('Add a message.');
    }
  };

  useEffect(() => {
    if (shortcutKeyPressed !== 0) {
      sendMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortcutKeyPressed]);

  useEffect(() => {
    const copyOfRefForCleanup = textareaRef.current;

    const onKeyDown = (e) => {
      if (e.ctrlKey && e.keyCode === 13) {
        // console.log('hi');
        setShortcutKeyPressed((p) => p + 1);
      }
    };

    if (textareaRef.current) {
      textareaRef.current.addEventListener('keydown', onKeyDown);
    }

    return () => copyOfRefForCleanup.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendFileMessage = async (fileUrl, messagesRef, path) => {
    try {
      await messagesRef.child(path).push().set(createMessage(fileUrl));
      setUploadState('finished');
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const getPath = () => {
    if (isPrivateChannel) {
      return `chat/private/${currentChannel.id}`;
    }
    return `chat/public`;
  };

  const uploadFile = async (file, metadata) => {
    const pathToUpload = currentChannel.id;
    const filePath = `${getPath()}/${uuidv4()}.jpg`;
    console.log('🚀 ~ filePath', filePath);

    setUploadState('uploading');
    const uploadTask = storageRef.child(filePath).put(file, metadata);

    uploadTask.on(
      'state_changed',
      (snap) => {
        const percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        setProgress(percentage);
      },
      (err) => {
        console.error(err);
        setError(err);
        setUploadState('error');
      },
      () => {
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then((downloadUrl) => {
            sendFileMessage(downloadUrl, messagesRef, pathToUpload);
          })
          .catch((err) => {
            console.error(err);
            setError(err);
            setUploadState('error');
          });
      }
    );
  };

  return (
    <Segment className="message__form">
      <Form>
        <Ref innerRef={textareaRef}>
          <TextArea
            rows={2}
            // fluid
            name="message"
            onChange={handleChange}
            value={message}
            style={{ marginBottom: '0.7em', fontFamily: 'inherit', maxHeight: 200, minHeight: 100 }}
            className={error && 'error'}
            // label={<Button icon="add" />}
            // labelPosition="left"
            placeholder="Write your message (Markdown is supported)"
          />
        </Ref>
      </Form>
      <Button.Group icon widths="2">
        <Button
          loading={loading}
          disabled={loading}
          onClick={sendMessage}
          color="orange"
          content="Send Message"
          labelPosition="left"
          icon="send"
        />
        <Button
          onClick={() => setShowModal(true)}
          disabled={uploadState === 'uploading'}
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
      <ProgressBar percentUploaded={progress} uploadState={uploadState} />
      <UploadFileModal uploadFile={uploadFile} showModal={showModal} setShowModal={setShowModal} />
    </Segment>
  );
};

export default MessageForm;
