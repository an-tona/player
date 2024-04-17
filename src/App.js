import './App.css';
import './normalize.css';
import {Router, Route, Link, Redirect} from 'react-router-dom';
import createHistory from "history/createBrowserHistory";
import { Provider, connect, useDispatch, useSelector} from 'react-redux';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import store from './reducers/slices';

import { Header } from './visual_components/Header';
import Aside from './visual_components/Aside';
import Footer from './visual_components/Footer';
import MainPage from './visual_components/MainPage';
import { Login } from './visual_components/SignIn';
import { SignUp } from './visual_components/SignUp';
import Profile from './visual_components/Profile';
import SearchResults from './visual_components/SearchResults';
import Playlist from './visual_components/Playlist';


const history = createHistory();
export { history }

function App() {

  return (
    <Router history={history}>
       <Provider store={store}>
        <Switch>
          <Route path='/sign-in' component={Login} exact />
          <Route path='/sign-up' component={SignUp} exact />
          <PrivateRoute path='/' component={DefaultPage} />
        </Switch>
      </Provider>
    </Router>
  );
}

function PrivateRoute({ component: Component, ...rest }) {

  const isAuthenticated = useSelector(state => state.auth.token !== null);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/sign-in" />
        )
      }
    />
  );
}

function DefaultPage() {

  return (
    <>
    <Router history={history}>
    <Header />
    <main>
      <Aside />
      <Switch>
        <div className='main_container'> 
          <Route path='/' component={MainPage} exact />
          <Route path='/profile' component={Profile}/>
          <Route path='/search/:queryValue' component={SearchResults}/>
          <Route path='/playlist/:playlistId' component={Playlist}/>
        </div>
      </Switch>
    </main>
    <Footer />
    </Router>
  </>
  );
}

export default App;

