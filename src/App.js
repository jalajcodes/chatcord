import { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import firebase from './firebase';
import Auth from './components/Auth';
import { clearUser, setUser } from './actions';
import Spinner from './components/Spinner';
import Home from './components/Home';

import 'semantic-ui-css/semantic.min.css';

const App = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('🚀authstatechanges ~ user', user);
        dispatch(setUser(user));
        history.push('/');
      } else {
        history.push('/auth');
        dispatch(clearUser());
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? (
    <Spinner />
  ) : (
    <Switch>
      <Route exact path="/auth">
        <Auth />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
    </Switch>
  );
};

export default App;
