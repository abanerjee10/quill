import { action, observable, computed } from 'mobx';
import * as AuthService from '../services/AuthService';

export default class AppStore {
  @observable token = null;
  @observable user = {};
  @computed get loggedIn() {
    return this.token != null;
  }
  @computed get adminLoggedIn() {
    return this.user != null && this.user.admin;
  }

  @observable messages = [];
  @action clearMessages = () => this.messages.length = 0;

  @action login = async (email, password, history) => {
    const loginResponse = await AuthService.login(null, email, password);
    const loginJson = await loginResponse.json();

    if (loginResponse.ok) {
      this.token = loginJson['token'];
      this.user = loginJson['user'];
      AuthService.setTokenInCookies(this.token);
      history.push('/');
    } else {
      this.clearMessages();
      this.messages.push({
        text: loginJson['message'],
        type: 'error',
      });
    }
  }

  @action loginWithToken = async (token) => {
    const loginResponse = await AuthService.login(token, null, null);
    const loginJson = await loginResponse.json();

    if (loginResponse.ok) {
      this.token = loginJson['token'];
      this.user = loginJson['user'];
      AuthService.setTokenInCookies(this.token);
      return true;
    } else {
      this.clearMessages();
      this.messages.push({
        text: loginJson['message'],
        type: 'error',
      });
    }

    return false;
  }

  @action logout = (history) => {
    this.token = null;
    this.user = {};
    AuthService.logout();
    history.push('/login');
  }

  @action signup = async (email, password, history) => {
    const signupResponse = await AuthService.signup(email, password);
    const signupJson = await signupResponse.json();
    
    if (signupResponse.ok) {
      this.token = signupJson['token'];
      this.user = signupJson['user'];
      AuthService.setTokenInCookies(this.token);
      history.push('/');
    } else {
      this.clearMessages();
      this.messages.push({
        text: signupJson['message'],
        type: 'error',
      });
    }
  }

  @action verify = async (token, history) => {
    const verifyResponse = await AuthService.verify(token);

    if (verifyResponse.ok) {
      if (this.loggedIn) {
        await this.loginWithToken(this.token); // re-login to refresh user object
      }
      return true;
    } else if (verifyResponse.status === 404) {
      this.messages.push({
        text: `An internal error has occurred: ${verifyResponse.status}`,
        type: 'error',
      });
    } else {
      const verifyJson = await verifyResponse.json();
      this.clearMessages();
      this.messages.push({
        text: verifyJson['message'],
        type: 'error',
      });
    }

    return false;
  }
}
