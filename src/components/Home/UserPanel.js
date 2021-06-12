import { useState, useRef, useEffect } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { v4 as uuidV4 } from 'uuid';
import { Dropdown, Grid, Header, Icon, Image, Modal, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';

const UserPanel = ({ currentUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [croppedImage, setCroppedImage] = useState('');
  const [uploadedCroppedImage, setUploadedCroppedImage] = useState('');
  const [blob, setBlob] = useState('');
  const avatarEditor = useRef();
  const storageRef = useRef(firebase.storage().ref()).current;
  const usersRef = useRef(firebase.database().ref('users')).current;
  const currentUserRef = useRef(firebase.auth().currentUser).current;
  const metaData = useRef({ contentType: 'image/jpeg' }).current;

  useEffect(() => {
    const changeAvatar = async () => {
      console.log('change avatar called');
      await currentUserRef.updateProfile({
        photoURL: uploadedCroppedImage,
      });

      await usersRef.child(currentUser.uid).update({
        avatar: uploadedCroppedImage,
      });
    };
    if (uploadedCroppedImage) {
      try {
        changeAvatar();
        console.log('PhotoURL Updated!');
        setShowModal(false);
      } catch (error) {
        console.error(error);
      }
    }
  }, [uploadedCroppedImage, currentUserRef, usersRef, currentUser.uid]);

  const handleSignout = async () => {
    await firebase
      .auth()
      .signOut()
      .then(() => console.log('Signed out!'));
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        setPreviewImage(reader.result);
      });
    }
  };

  const handleCropImage = () => {
    if (avatarEditor.current) {
      avatarEditor.current.getImage().toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setCroppedImage(imageUrl);
        setBlob(blob);
      });
    }
  };

  const uploadCroppedImage = async () => {
    const uploadedImage = await storageRef
      .child(`avatars/user/${currentUserRef.uid}/${uuidV4()}.jpg`)
      .put(blob, metaData);
    const downloadUrl = await uploadedImage.ref.getDownloadURL();
    setUploadedCroppedImage(downloadUrl);
  };

  const dropdownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          <strong>{currentUser.email}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: 'avatar',
      text: (
        <span
          role="button"
          tabIndex="-2"
          onClick={() => setShowModal(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setShowModal(true);
            }
          }}
        >
          Change Avatar
        </span>
      ),
    },
    {
      key: 'signout',
      text: (
        <span
          tabIndex="-1"
          role="button"
          onClick={handleSignout}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSignout();
            }
          }}
        >
          Sign Out
        </span>
      ),
    },
  ];

  return (
    <Grid>
      <Grid.Column>
        <Grid.Row centered style={{ padding: '1.2em', margin: 0 }}>
          <Header
            inverted
            as="h2"
            style={{ fontFamily: 'Lobster', fontSize: '2em', letterSpacing: '1px' }}
          >
            <Icon name="rocket" />
            <Header.Content>Chatcord</Header.Content>
          </Header>

          <Header style={{ padding: '0.25em', textAlign: 'center' }} as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={currentUser.photoURL} spaced="right" avatar />
                  {currentUser.displayName}
                </span>
              }
              options={dropdownOptions()}
            />
          </Header>
        </Grid.Row>

        <Modal basic open={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            <Input
              onChange={handleChange}
              fluid
              type="file"
              label="New Avatar"
              name="previewImage"
            />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">
                  {previewImage && (
                    <AvatarEditor
                      ref={avatarEditor}
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                    />
                  )}
                </Grid.Column>
                <Grid.Column>
                  {croppedImage && (
                    <Image
                      className="cropped-image"
                      style={{ margin: '3.5em auto' }}
                      width={100}
                      height={100}
                      src={croppedImage}
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            {croppedImage && (
              <Button color="green" onClick={uploadCroppedImage}>
                <Icon name="save" /> Save
              </Button>
            )}
            <Button color="orange" onClick={handleCropImage}>
              <Icon name="image" /> Preview
            </Button>
            <Button inverted color="red" onClick={() => setShowModal(false)}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
