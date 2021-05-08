import { useState, useRef, useEffect } from 'react';
import md5 from 'md5';
import { Button } from 'semantic-ui-react';
import firebase from '../../firebase';

const Form = ({ option, setOption }) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();

  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => () => setOption(1), [setOption]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (option === 1) {
      try {
        setSubmitLoading(true);
        const result = await firebase
          .auth()
          .signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);

        if (result.user) {
          // console.dir(result.user);
          // setSubmitLoading(false);
          emailRef.current.value = '';
          passwordRef.current.value = '';
        }
      } catch (error) {
        setSubmitLoading(false);
        setError(error.message || 'Login failed. Try again later.');
      }
    } else if (option === 2) {
      if (passwordRef.current.value.length < 6) {
        return setError('Password should be greater or equal to 6 characters.');
      }

      // try {
      setError('');
      setSubmitLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
        .then((createdUser) => {
          createdUser.user
            .updateProfile({
              displayName: usernameRef.current.value,
              photoURL: `https://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`,
            })
            .then(() => {
              firebase.database().ref('users').child(createdUser.user.uid).set({
                name: createdUser.user.displayName,
                avatar: createdUser.user.photoURL,
              });
            })
            .catch((err) => {
              setSubmitLoading(false);
              setError(err.message);
            });
        })
        .catch((err) => {
          setSubmitLoading(false);
          setError(err.message);
        });

      // await result.user.updateProfile({
      //   displayName: usernameRef.current.value,
      //   photoURL: `https://gravatar.com/avatar/${md5(result.user.email)}?d=identicon`,
      // });
      // await firebase.database().ref('users').child(result.user.uid).set({
      //   name: result.user.displayName,
      //   avatar: result.user.photoURL,
      // });
      // if (result) {
      // console.dir(result.user);
      // setSubmitLoading(false);
      // emailRef.current.value = '';
      // usernameRef.current.value = '';
      // passwordRef.current.value = '';
      // }
      // } catch (error) {
      //   setSubmitLoading(false);
      //   setError(error.message);
      // }
    } else if (option === 3) {
      try {
        setSubmitLoading(true);
        await firebase.auth().sendPasswordResetEmail(emailRef.current.value);
        emailRef.current.value = '';
        setSubmitLoading(false);
      } catch (error) {
        setSubmitLoading(false);
        setError(error.message || 'Sending email failed, try again later.');
      }
    }
  };

  const fillGuestCreds = (e) => {
    e.preventDefault();
    emailRef.current.value = 'guest@chatcord.com';
    passwordRef.current.value = '123456';
  };

  return (
    <form className="account-form" onSubmit={handleSubmit}>
      <div
        className={`account-form-fields ${
          option === 1 ? 'sign-in' : option === 2 ? 'sign-up' : 'forgot'
        }`}
      >
        <input ref={emailRef} id="email" name="email" type="email" placeholder="E-mail" required />
        <input
          ref={passwordRef}
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required={!!(option === 1 || option === 2)}
          disabled={option === 3}
        />
        <input
          ref={usernameRef}
          id="username"
          name="username"
          type="username"
          placeholder="Username"
          required={option === 2}
          disabled={option === 3 || option === 1}
        />
      </div>
      {error && <div className="error-alert">{error}</div>}
      <Button
        disabled={submitLoading}
        color="teal"
        fluid
        size="large"
        className={`btn-submit-form ${submitLoading && 'loading'}`}
        style={{ fontFamily: 'inherit', fontWeight: 'normal' }}
        type="submit"
      >
        {submitLoading
          ? 'Loading...'
          : option === 1
          ? 'Sign in'
          : option === 2
          ? 'Sign up'
          : 'Reset password'}
      </Button>
      <Button
        type="button"
        color="orange"
        fluid
        size="large"
        style={{ marginTop: 8, fontFamily: 'inherit', fontWeight: 'normal' }}
        disabled={submitLoading || option !== 1}
        className="btn-submit-form"
        onClick={fillGuestCreds}
      >
        Guest Credentials
      </Button>
    </form>
  );
};
export default Form;
