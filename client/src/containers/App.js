import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { inject, observer } from 'mobx-react';
import Login from './Login';
import Home from './Home';
import Apply from './Apply';
import Confirm from './Confirm';
import Admin from './Admin';
import withHooks from '../util/withHooks';

@inject('store')
@observer
class App extends React.Component {
  ensureAuth = (history) => {
    if (!this.props.store.loggedIn) {
      history.replace('/login');
    }
  }

  ensureAdminAuth = (history) => {
    if (!this.props.store.adminLoggedIn) {
      history.replace('/login');
    }
  }

  ensureNoAuth = (history) => {
    if (this.props.store.loggedIn) {
      history.replace('/');
    }
  }

  clearMessages = () => this.props.store.clearMessages();

  render() {
    return (
      <Router>
        <div>
          <Route path="/" exact  component={withHooks(Home,    this.ensureAuth,      this.clearMessages)} />
          <Route path="/login"   component={withHooks(Login,   this.ensureNoAuth,    this.clearMessages)} />
          <Route path="/apply"   component={withHooks(Apply,   this.ensureAuth,      this.clearMessages)} />
          <Route path="/confirm" component={withHooks(Confirm, this.ensureAuth,      this.clearMessages)} />
          <Route path="/admin"   component={withHooks(Admin,   this.ensureAdminAuth, this.clearMessages)} />
        </div>
      </Router>
    );
  }
}

export default App;