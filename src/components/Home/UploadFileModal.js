import { useState, useRef } from 'react';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';
import mime from 'mime-types';

const UploadFileModal = ({ showModal, setShowModal, uploadFile }) => {
  const [file, setFile] = useState(null);
  const allowedFileTypes = useRef(['image/jpeg', 'image/png', 'image/gif']).current;

  const isFileAllowed = (filename) => allowedFileTypes.includes(mime.lookup(filename));

  const addFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const sendFile = () => {
    if (file !== null) {
      if (isFileAllowed(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        setShowModal(false);
        setFile('');
        console.log('🚀 ~ metadata', metadata);
      }
    }
  };

  return (
    <Modal dimmer="blurring" basic open={showModal} onClose={() => setShowModal(false)}>
      <Modal.Header>Select an Image file</Modal.Header>
      <Modal.Content>
        <Input onChange={addFile} fluid label="File Type: jpg, png, gif" name="file" type="file" />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={sendFile} color="green">
          <Icon name="send" /> Send
        </Button>
        <Button color="red" inverted onClick={() => setShowModal(false)}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default UploadFileModal;
